# ACM MEC Website - Web Application Package (`club-website`)

This directory contains the source code for the ACM MEC website single-page application built with React 19, Vite 8, Tailwind CSS v4, and React Router v8.

## Tech Stack Summary

- Framework: React 19
- Build tool: Vite 8
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`
- Routing: React Router v8
- Icons: `lucide-react`
- Markdown: `react-markdown` + `@tailwindcss/typography`
- Linting: `oxlint`

## Development Commands

Run these from inside `club-website`:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Source Code Structure

- `src/components/layout/`: `Navbar.jsx`, `Footer.jsx`, `Layout.jsx`
- `src/components/shared/`: reusable cards such as `EventCard` and `TeamMemberCard`
- `src/components/ui/`: base UI elements, including `Button`, `Card`, `Badge`, `ThemeToggle`, `TypingHeadline`, and `PageTitle`
- `src/context/`: `ThemeContext.jsx` and `DataContext.jsx`
- `src/data/`: static source data in `siteConfig.js`, `events.js`, and `team.js`
- `src/pages/`: route views for `Home`, `About`, `Events`, `EventDetail`, `Team`, `Contact`, `Admin`, and `NotFound`
- `src/utils/`: helper methods such as `dates.js`

## Theme & Customization

The site design system is driven by CSS-first Tailwind CSS v4 variables in `src/index.css`.

For project-wide documentation, architecture details, and contribution guidelines, see the root repository documentation in [`../README.md`](../README.md) and [`../PROJECT_BRIEF.MD`](../PROJECT_BRIEF.MD).

## Admin Security Setup

The admin password is verified only by the serverless `/api/auth` endpoint. It is never put in the Vite bundle or browser storage. Before using the admin panel, generate a hash and session-signing key, then paste the two output lines into the ignored `.env` file:

```bash
node scripts/gen_pass.mjs "your admin password"
```

During local development, `npm run dev` serves `/api/auth` through a Vite middleware that uses the same server-side handler as deployment.

For Vercel deployments, add the same `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` values in the project Environment Variables settings. Do not use a `VITE_` prefix for either value: all `VITE_*` variables are public client-side build values. To rotate the password, generate a new pair and update both environment variables.

The API uses scrypt password verification, a 15-minute HttpOnly/Secure/SameSite session cookie, same-origin checks, and login throttling. The in-memory throttling protects a single serverless instance; for distributed, production-grade rate limits, put a shared rate limiter such as Vercel KV or Upstash in front of `/api/auth`.

## Admin Content Flow

The public site reads events, team members, and site settings through `DataContext`, which initializes from `src/data/events.js`, `src/data/team.js`, and `src/data/siteConfig.js`. Admin edits are saved to the current browser's `localStorage` for live preview. If the source data files change, stale browser data is automatically discarded; you can also use Reload Source Data in the admin panel to force the app back to the current `src/data/*` files.
