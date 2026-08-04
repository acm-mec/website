# ACM MEC Website - Project Brief

## What This Is
A public marketing-and-hub website for the ACM MEC technical/coding club (Model Engineering College Student Chapter). It is a React SPA deployed to Vercel, with a protected admin panel for managing the site data in the browser.

## Tech Stack
- Build tool: Vite 8
- UI library: React 19
- Styling: Tailwind CSS v4 via `@theme` in `src/index.css`
- Routing: React Router v8 (`BrowserRouter`, `Routes`, `Route`)
- Icons: `lucide-react`
- Markdown: `react-markdown` + `@tailwindcss/typography` for rich text content
- Linter: `oxlint`
- Hosting: Vercel with SPA rewrite rules and a serverless admin auth endpoint

## Core Routes & Pages
| Route | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Hero section, stats, event preview, and club summary |
| `/about` | `About.jsx` | Club history, mission, pillars, and executive board |
| `/events` | `Events.jsx` | Filterable list of upcoming and past events |
| `/events/:id` | `EventDetail.jsx` | Detailed single event page with schedule, location, and RSVP button |
| `/team` | `Team.jsx` | Executive committee and core team member cards |
| `/contact` | `Contact.jsx` | Contact details and social link directory |
| `/admin` | `Admin.jsx` | Protected admin panel for live browser-side content edits |
| `*` | `NotFound.jsx` | 404 page with quick redirect home |

## Content Management Architecture
Club-specific content lives in static source files under `club-website/src/data/`:
- `src/data/siteConfig.js` - club name, tagline, email, founding year, social links
- `src/data/events.js` - event list, dates, locations, status tags
- `src/data/team.js` - member names, roles, bios, socials

The public site reads through `DataContext`, which initializes from those source files and uses browser `localStorage` for live admin preview. If the source data changes, stale browser data is automatically invalidated.

## Design System
Defined in `DESIGN_SYSTEM.md` and configured via Tailwind v4 CSS `@theme` tokens in `src/index.css`. Supports light and dark themes with `ThemeContext`.

## Development Commands
```bash
cd club-website
npm run dev
npm run build
npm run lint
npm run preview
```

## Admin Security
The admin panel uses a serverless `/api/auth` endpoint. Password verification and session signing are handled server-side using secrets stored in `.env` locally and in Vercel environment variables in deployment.

## Deployment
Push to `main` on GitHub and Vercel auto-deploys the SPA with `vercel.json` rewrite rules for deep routes and the `/api/auth` serverless function.
- **Framework Preset:** Vite
- **Output Directory:** `dist`

## Status
- Last updated: 2026-08-05
- Status: Removed placeholder social URLs from `src/data/team.js` and updated `TeamMemberCard.jsx` & `Admin.jsx` so social icon buttons only render when valid URLs are present. Verified lint and build pass cleanly.


