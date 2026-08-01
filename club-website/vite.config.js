import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import adminAuthHandler from "./api/auth.js";

const ADMIN_ENV_KEYS = ["ADMIN_PASSWORD_HASH", "ADMIN_SESSION_SECRET"];

function readLocalEnvFile() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    return Object.fromEntries(
      envFile.split(/\r?\n/).flatMap((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) return [];

        const equalsIndex = trimmedLine.indexOf("=");
        if (equalsIndex < 1) return [];

        const key = trimmedLine.slice(0, equalsIndex).trim();
        const value = trimmedLine.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
        return [[key, value]];
      }),
    );
  } catch {
    return {};
  }
}

function applyAdminEnv() {
  const env = readLocalEnvFile();
  for (const key of ADMIN_ENV_KEYS) {
    if (env[key]) process.env[key] = env[key];
  }
}

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) return {};
  if (!req.headers["content-type"]?.includes("application/json")) return {};

  return JSON.parse(rawBody);
}

function adminAuthDevMiddleware() {
  return {
    name: "admin-auth-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/auth", async (req, res) => {
        try {
          req.body = await readBody(req);
          res.status = (statusCode) => {
            res.statusCode = statusCode;
            return res;
          };
          res.json = (body) => {
            res.end(JSON.stringify(body));
            return res;
          };
          return adminAuthHandler(req, res);
        } catch {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Admin authentication service is unavailable." }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(() => {
  applyAdminEnv();
  return {
  plugins: [
    react(),
    tailwindcss(),
    adminAuthDevMiddleware(),
  ],
  };
});
