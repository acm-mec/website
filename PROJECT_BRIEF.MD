# ACM MEC Website — Project Brief

## What This Is
A public marketing-and-hub website for the ACM MEC technical/coding club (Model Engineering College Student Chapter). Static React SPA, deployed to Vercel. No backend, no database, no authentication required.

## Tech Stack
- **Build tool:** Vite 8 (latest)
- **UI library:** React 19 (JavaScript — no TypeScript)
- **Styling:** Tailwind CSS v4 (CSS-first config via `@theme` in `src/index.css`)
- **Routing:** react-router v8 (declarative mode — `BrowserRouter`, `Routes`, `Route`)
- **Icons:** lucide-react
- **Markdown:** react-markdown + @tailwindcss/typography (blog posts only)
- **Linter:** oxlint
- **Hosting:** Vercel (see `vercel.json` for SPA rewrite rule)

## Core Routes & Pages
| Route | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Hero section, typing animation, mission statement, featured events & latest posts |
| `/about` | `About.jsx` | Club history, mission, pillars, and executive board |
| `/events` | `Events.jsx` | Filterable list of upcoming workshops, hackathons, and past events |
| `/events/:id` | `EventDetail.jsx` | Detailed single event page with schedule, location, and RSVP button |
| `/team` | `Team.jsx` | Executive committee and core team member cards |
| `/blog` | `Blog.jsx` | Tech articles, workshop write-ups, and student tutorials |
| `/blog/:id` | `BlogPost.jsx` | Dynamic Markdown article viewer rendered with syntax styling |
| `/contact` | `Contact.jsx` | Formspree contact form and social link directory |
| `*` | `NotFound.jsx` | 404 error page with quick redirect home |

## Content Management Architecture
All club-specific text content and site configurations are centralized into a single, comprehensive Markdown document:
- **Central Master Content File:** `SITE_CONTENT.md` (located at root `SITE_CONTENT.md` and `club-website/src/data/SITE_CONTENT.md`) — contains site details, page titles, headings, button labels, descriptions, and full documentation detailing where each item belongs.
- **Site Details:** `src/data/siteConfig.js` — dynamically parses text content directly from `SITE_CONTENT.md`.
- **Events:** `src/data/events.js` — individual event listings, dates, locations, status tags (remains separate per requirements).
- **Team Members:** `src/data/team.js` — individual team member names, roles, avatars, socials (remains separate per requirements).

## Design System ("Terminal Notebook")
Defined in `DESIGN_SYSTEM.md` and configured via Tailwind v4 CSS `@theme` tokens in `src/index.css`. Supports Light & Dark themes with `ThemeContext`.

## Development Commands
```bash
cd club-website
npm run dev        # Development server (http://localhost:5173)
npm run build      # Production build to /dist
npm run lint       # Run Oxlint static analysis
npm run preview    # Preview production build locally
```

## Deployment
Push to `main` branch on GitHub → Vercel auto-deploys Vite SPA with `vercel.json` rewrite rule for deep routes.
- **Root Directory:** `club-website` (if repo root is deployed on Vercel)
- **Framework Preset:** Vite
- **Output Directory:** `dist` (configured in `club-website/vercel.json` and Vite defaults)

## Status
- **Last Updated:** 2026-08-05
- **Status:** Completed mobile-friendliness polish pass across the application (lazy/async image loading, ~40px+ tap targets, global overflow-x guard, social/email touch target expansion, unused asset cleanup). Removed the "Join Us" CTA button from the mobile navigation dropdown menu while preserving it on desktop header navigation. Verified lint and build pass cleanly.
