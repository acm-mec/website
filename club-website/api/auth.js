import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const SESSION_COOKIE = "acm_admin_session";
const SESSION_TTL_SECONDS = 15 * 60;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const attemptsByIp = new Map();

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").flatMap((part) => {
      const index = part.indexOf("=");
      if (index < 1) return [];
      return [[part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())]];
    }),
  );
}

function cookie(name, value, maxAge = 0, httpOnly = true) {
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ];
  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") attributes.push("Secure");
  if (httpOnly) attributes.push("HttpOnly");
  return attributes.join("; ");
}

function send(res, status, body, cookies = []) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (cookies.length) res.setHeader("Set-Cookie", cookies);
  return res.status(status).json(body);
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  return !origin || origin === `https://${host}` || origin === `http://${host}`;
}

function passwordMatches(password, encodedHash) {
  const [algorithm, cost, blockSize, parallelization, salt, expected] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !password || !salt || !expected) return false;

  const N = Number(cost);
  const r = Number(blockSize);
  const p = Number(parallelization);
  if (!Number.isSafeInteger(N) || !Number.isSafeInteger(r) || !Number.isSafeInteger(p)) return false;

  try {
    const actual = scryptSync(password, Buffer.from(salt, "base64url"), 64, {
      N,
      r,
      p,
      maxmem: 128 * N * r + 1024 * 1024,
    });
    const expectedBuffer = Buffer.from(expected, "base64url");
    return expectedBuffer.length === actual.length && timingSafeEqual(expectedBuffer, actual);
  } catch {
    return false;
  }
}

function signSession(payload, secret) {
  const data = base64Url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function sessionIsValid(token, secret) {
  if (!token || !secret) return false;
  const [data, signature] = token.split(".");
  if (!data || !signature) return false;
  const expected = createHmac("sha256", secret).update(data).digest("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    return payload.role === "admin" && Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function getClientIp(req) {
  return (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
}

function getAttemptState(ip) {
  if (attemptsByIp.size > 10_000) attemptsByIp.clear();
  const state = attemptsByIp.get(ip);
  if (!state || state.lockedUntil <= Date.now() && state.firstAttempt + LOCKOUT_MS < Date.now()) {
    attemptsByIp.delete(ip);
    return { count: 0, lockedUntil: 0, firstAttempt: Date.now() };
  }
  return state;
}

function recordFailure(ip) {
  const state = getAttemptState(ip);
  const next = { ...state, count: state.count + 1 };
  if (next.count >= MAX_LOGIN_ATTEMPTS) next.lockedUntil = Date.now() + LOCKOUT_MS;
  attemptsByIp.set(ip, next);
  return next;
}

export default function handler(req, res) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!passwordHash || !sessionSecret || sessionSecret.length < 32) {
    return send(res, 503, { error: "Admin authentication is not configured." });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "Invalid request origin." });

  const cookies = parseCookies(req.headers.cookie);
  if (req.method === "GET") {
    return send(res, 200, { authenticated: sessionIsValid(cookies[SESSION_COOKIE], sessionSecret) });
  }
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed." });

  const { action, password } = req.body || {};
  if (action === "logout") {
    return send(res, 200, { authenticated: false }, [cookie(SESSION_COOKIE, "", 0)]);
  }
  if (action !== "login" || typeof password !== "string" || password.length > 1024) {
    return send(res, 400, { error: "Invalid request." });
  }

  const ip = getClientIp(req);
  const state = getAttemptState(ip);
  if (state.lockedUntil > Date.now()) {
    const retryAfter = Math.ceil((state.lockedUntil - Date.now()) / 1000);
    res.setHeader("Retry-After", retryAfter);
    return send(res, 429, { error: "Too many attempts. Try again later." });
  }

  if (!passwordMatches(password, passwordHash)) {
    const next = recordFailure(ip);
    if (next.lockedUntil > Date.now()) res.setHeader("Retry-After", Math.ceil(LOCKOUT_MS / 1000));
    return send(res, next.lockedUntil > Date.now() ? 429 : 401, { error: "Invalid credentials." });
  }

  attemptsByIp.delete(ip);
  const token = signSession(
    { role: "admin", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS, nonce: randomBytes(16).toString("base64url") },
    sessionSecret,
  );
  return send(res, 200, { authenticated: true }, [cookie(SESSION_COOKIE, token, SESSION_TTL_SECONDS)]);
}
