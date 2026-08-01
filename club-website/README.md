# ACM MEC Website — Web Application Package (`club-website`)

This directory contains the source code for the **ACM MEC Website** single-page web application built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **React Router v8**.

---

## 💻 Tech Stack Summary

- **Framework:** React 19 (JavaScript)
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` plugin with `@theme` config in `src/index.css`)
- **Routing:** React Router v8 (Declarative mode)
- **Icons:** `lucide-react`
- **Markdown:** `react-markdown` + `@tailwindcss/typography`
- **Linting:** `oxlint`

---

## 🚀 Development Commands

Execute these commands from inside the `club-website` directory:

```bash
# Install dependencies
npm install

# Run dev server with Hot Module Replacement (HMR)
npm run dev

# Build for production output (/dist)
npm run build

# Run Oxlint linter
npm run lint

# Local preview of the production build
npm run preview
```

---

## 📂 Source Code Structure

- **`src/components/layout/`**: `Navbar.jsx`, `Footer.jsx`, `Layout.jsx` wrappers.
- **`src/components/shared/`**: Reusable entity cards (`EventCard`, `TeamMemberCard`, `BlogPostCard`).
- **`src/components/ui/`**: Base UI elements (`Button`, `Card`, `Badge`, `ThemeToggle`, `TypingHeadline`).
- **`src/context/`**: `ThemeContext.jsx` for light/dark mode preference management.
- **`src/data/`**: Centralized static content files (`siteConfig.js`, `events.js`, `team.js`, `posts.js`).
- **`src/pages/`**: Route views (`Home`, `About`, `Events`, `EventDetail`, `Team`, `Blog`, `BlogPost`, `Contact`, `NotFound`).
- **`src/utils/`**: Helper methods (`dates.js`).

---

## 🎨 Theme & Customization

The site design system is driven by CSS-first Tailwind CSS v4 variables in `src/index.css`:
```css
@theme {
  --color-acm-bg: #070D17;
  --color-acm-card: #121E30;
  --color-acm-blue: #2DB7E5;
  --color-acm-glow: #66EAFF;
  --color-acm-silver: #C2C9D1;
}
```

For project-wide documentation, architecture details, and contribution guidelines, see the root repository documentation in [`../README.md`](../README.md) and [`../PROJECT_BRIEF.MD`](../PROJECT_BRIEF.MD).

## Admin security setup

The admin password is verified only by the serverless `/api/auth` endpoint. It is never put in the Vite bundle or browser storage. Before using the admin panel, generate a hash and session-signing key, then paste the two output lines into the ignored `.env` file:

```bash
node scripts/gen_pass.mjs "your admin password"
```

During local development, `npm run dev` serves `/api/auth` through a Vite middleware that uses the same server-side handler as deployment.

For Vercel deployments, add the same `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` values in the project Environment Variables settings. Do not use a `VITE_` prefix for either value: all `VITE_*` variables are public client-side build values. To rotate the password, generate a new pair and update both environment variables.

The API uses scrypt password verification, a 15-minute HttpOnly/Secure/SameSite session cookie, same-origin checks, and login throttling. The in-memory throttling protects a single serverless instance; for distributed, production-grade rate limits, put a shared rate limiter (such as Vercel KV/Upstash) in front of `/api/auth`.
