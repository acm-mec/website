# ACM MEC Website — AI Agent Build Specification

## Assumptions & Defaults Locked In

These were decided before this spec was written. If any is wrong, correct it before handing this to the agent — everything downstream depends on these:

| Decision | Choice | Why |
|---|---|---|
| Framework | React (via Vite's official `react` template) | Most common Vite pairing, largest ecosystem for agentic tools |
| Language | JavaScript, not TypeScript | Faster to scaffold, lower ceremony for a small rotating student team |
| Club type | Technical / Coding club | Drives copy, imagery, and the design direction below |
| Core pages | Home, About, Events, Team, Blog/Resources, Contact | Team is included as a near-universal default for club sites even though it wasn't in the original feature list |
| Routing | React Router v8, **declarative mode** | Simplest mode; no loaders/actions needed for mostly-static content |
| Data | Local JS files, no database | Fastest to ship, zero backend to host, fits Vercel-only static hosting |
| Contact form | Formspree (free tier), plain `fetch`, no SDK | Zero backend code, no extra dependency |
| Hosting | Vercel only | As requested — no Netlify/AWS-specific config anywhere |

---

## 1. Project Context & Target Audience

**What this is:** A public marketing-and-hub website for a technical/coding club at a college. It is not a member portal, not a learning management system, and not a real-time chat tool — Discord/Slack already own that job.

**Primary goals, in priority order:**
1. Convince a prospective student to join within one visit (clear "what we do" + easy "how to join").
2. Show that the club is active and credible — upcoming events, real people, real writing — to students, faculty advisors, and potential sponsors.
3. Give existing members a fast place to check "what's next" and read resources written by other members.

**Audience segments:**
- **Prospective members** — students deciding whether to join. Need to understand the club's focus and see a low-friction way to show interest.
- **Current members** — checking events and reading resources/blog posts.
- **Faculty / department / potential sponsors** — evaluating legitimacy and activity level.
- **External visitors** — other colleges, hackathon partners, recruiters.

**Explicitly out of scope for v1** (do not build these, do not scaffold placeholders for them):
- User accounts, login, or authentication of any kind.
- A CMS or admin dashboard for editing content through the browser.
- A payment/dues system.
- A real-time chat, forum, or comments system.
- A gallery, sponsors page, or dedicated project-showcase page — these were considered and deliberately not selected for v1.

---

## 2. Exact Tech Stack & Architecture

### Core stack
| Layer | Choice | Notes |
|---|---|---|
| Build tool | Vite (latest) | Scaffolded via `npm create vite@latest` |
| UI library | React (latest, via Vite's `react` template) | JavaScript, not TypeScript |
| Styling | Tailwind CSS v4 | Via the official `@tailwindcss/vite` plugin — **CSS-first config, no `tailwind.config.js`, no `postcss.config.js`** |
| Routing | `react-router` v8, declarative mode | Package is **`react-router`**, not `react-router-dom` — that package was removed as of v8 |
| Icons | `lucide-react` | Tree-shakeable, consistent stroke-based icon set |
| Markdown rendering | `react-markdown` + `@tailwindcss/typography` | For blog/resources post bodies only |
| Content/data | Local `.js` files under `src/data/` | No database — see Section 5 |
| Form handling | Formspree, called via plain `fetch` | No backend code, no extra SDK dependency |
| Hosting | Vercel | Auto-detects Vite; needs one `vercel.json` for SPA routing (Section 4) |
| Package manager | npm | Use npm commands exactly as written below — do not substitute yarn/pnpm |

### Prerequisites
- Node.js `20.19+` or `22.12+` (required by current Vite)
- npm `10+`

### Architecture rules
- **This is a static single-page app.** There is no server, no API routes, no environment-based backend logic. Every page is a client-rendered React route.
- **State management:** React's built-in `useState`/`useContext` only. Do not install Redux, Zustand, Recoil, or MobX — there is no state complex enough to justify one.
- **Data flow:** Pages import arrays/objects directly from `src/data/*.js` and render them. No fetching, no loading spinners for content that ships in the bundle.
- **Routing mode:** Use React Router's **declarative mode** (`<BrowserRouter>`, `<Routes>`, `<Route>`) imported from `"react-router"`. Do not use `createBrowserRouter`/data mode or the framework/Vite-plugin mode — this app has no loaders, actions, or server rendering needs.
- **Styling:** Tailwind utility classes only. No CSS Modules, no styled-components, no inline `style={{}}` except for the one dynamic case called out in Section 6 (typing animation width). No component UI kit (no MUI, Chakra, shadcn, Ant Design, Bootstrap) — every visual element is handbuilt from Tailwind utilities per the Design System in Section 3.

---

## 3. Design System

Save the content of this entire section as **`/DESIGN_SYSTEM.md`** at the project root during setup. Every page and component built afterward must be checked against it. If a future instruction conflicts with it, the Design System wins unless a human explicitly overrides it.

### Creative direction: "Terminal Notebook"

The reference points are a code editor and a lab notebook, not a generic SaaS landing page or a dark-mode dev-tool clone. Concretely: a light, high-contrast paper background (not the cream/terracotta AI-default, not a near-black-with-neon-green screen), hairline rules instead of heavy shadows, and a recurring monospace "commit log" motif — every event and blog post gets a small `#id` tag and a colored status dot, like a `git log --oneline` line — that ties the whole site back to the club's actual subject matter.

### Color palette

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAFAF8` | Page background |
| `paper-raised` | `#FFFFFF` | Card / raised surface background |
| `ink` | `#16181D` | Primary text, headings |
| `ink-muted` | `#52565E` | Secondary text, captions, metadata |
| `indigo` | `#3730A3` | Primary accent — links, primary buttons, active nav state, focus rings |
| `signal` | `#15803D` | "Upcoming" / success status only — dots and badge text, never a large fill |
| `amber` | `#B45309` | Tags, hover highlights |
| `rule` | `#E4E4E7` | Borders, dividers, card outlines |

Do not introduce additional colors outside this table. Do not use gradients anywhere.
you can also use the design system saved at the root of the project because it was generated from the logo of the club. 
### Typography

| Role | Font | Where it's used |
|---|---|---|
| Display | `Bricolage Grotesque` | Hero headline, section H2s, card titles — bold/semibold only |
| Body | `IBM Plex Sans` | Paragraphs, nav, buttons, form inputs |
| Mono | `JetBrains Mono` | Dates, tags, status badges, the `#id` commit-style tags, footer copyright line |

Load all three from Google Fonts via `<link rel="preconnect">` + `<link rel="stylesheet">` tags in `index.html`'s `<head>` — do not use `@import` inside CSS (slower) and do not self-host font files for v1.

**Type scale:**
- Hero H1: `text-5xl md:text-7xl font-display font-bold tracking-tight`
- Section H2: `text-3xl md:text-4xl font-display font-semibold`
- Card title H3: `text-xl font-display font-semibold`
- Body: `text-base font-body leading-relaxed text-ink`
- Meta/caption: `text-sm font-mono text-ink-muted uppercase tracking-wide`

### Layout & spacing
- Max content width: `max-w-6xl`, centered, `px-6` on mobile / `px-8` on desktop.
- Section vertical rhythm: `py-16` mobile, `py-24 md:py-28` desktop. Use this consistently — do not invent one-off section padding per page.
- Card padding: `p-6`. Grid gaps: `gap-6` to `gap-8`.

### Shape & elevation
- Border radius: `rounded-md` (cards, inputs, images), `rounded` (buttons, badges). **Never** `rounded-full` or `rounded-2xl`/`3xl` on cards or buttons — that reads as generic template UI.
- Elevation comes from a `1px solid` `rule`-colored border first, and only a `shadow-sm` at rest. On hover, cards get `shadow-md` plus `-translate-y-0.5`, 150ms transition.

### Motion
- Respect `prefers-reduced-motion`: disable the hero typing animation and hover-lift transforms for users who set it; show final text/state immediately instead.
- Micro-interactions only: 150ms color/border transitions on links and buttons, the card hover-lift described above, and one signature moment — a typing/terminal-cursor effect in the hero subheadline (see Section 6, Home page). No scroll-triggered reveals, no parallax, no page-transition animation. Restraint is intentional here — one animated moment, not many.

### Component patterns
- **Primary button:** `bg-indigo text-white rounded px-5 py-2.5 font-body font-medium` → hover: darker indigo + `-translate-y-0.5`; focus: `ring-2 ring-indigo ring-offset-2`.
- **Secondary/outline button:** `border border-ink text-ink bg-transparent rounded px-5 py-2.5` → hover: `bg-ink text-paper`.
- **Card:** `bg-paper-raised border border-rule rounded-md p-6` → hover per Elevation above.
- **Status badge:** `inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-2 py-1 rounded border` — `signal`-colored border/text for "upcoming"/"published", `ink-muted`-colored for "past"/"archived".
- **Commit-style meta tag** (the signature element): a small `font-mono text-xs text-ink-muted` string rendering `#{id}` followed by a colored status dot (`signal` = upcoming/published, `rule`-gray = past/archived), placed above the title on `EventCard` and `BlogPostCard`.

### Accessibility baseline (non-negotiable)
- Every interactive element has a visible focus ring — never remove `outline` without replacing it with the `ring-2 ring-indigo ring-offset-2` pattern above.
- Color contrast: minimum 4.5:1 for body text, 3:1 for large text/UI components. The palette above was chosen to clear this — do not lighten `ink-muted` or `signal` further.
- Every image has a real, descriptive `alt` attribute — the data files in Section 5 include an `alt` field for exactly this reason. Never leave `alt=""` except for purely decorative icons.
- Semantic HTML throughout: one `<h1>` per page, `<nav>`, `<main>`, `<footer>` landmarks, real `<button>`/`<a>` elements (never a `<div onClick>`).
- Mobile-first responsive design, tested at `375px`, `768px`, `1024px`, `1440px`. Nav collapses to a hamburger menu below `md` (768px).

---

## 4. File Tree Structure

Scaffold exactly this structure. Do not add extra top-level folders (no `utils/`, `hooks/`, `context/`, `lib/`, `services/`) unless a specific page requirement below can't be met without one.

```
club-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── images/
│   │       ├── events/
│   │       ├── team/
│   │       └── blog/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── SectionHeading.jsx
│   │   │   ├── Container.jsx
│   │   │   ├── StatusMeta.jsx
│   │   │   └── TypingHeadline.jsx
│   │   └── shared/
│   │       ├── EventCard.jsx
│   │       ├── TeamMemberCard.jsx
│   │       ├── BlogPostCard.jsx
│   │       └── ContactForm.jsx
│   ├── data/
│   │   ├── siteConfig.js
│   │   ├── events.js
│   │   ├── team.js
│   │   └── posts.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Events.jsx
│   │   ├── EventDetail.jsx
│   │   ├── Team.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── DESIGN_SYSTEM.md
├── .gitignore
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## 5. Data Structure (No Database)

There is no database. All content lives in plain JS files under `src/data/`, imported directly by pages. Below is the exact shape for each file, with real sample entries to seed the site — extend the pattern with 2–4 more realistic entries per file (workshops, hackathons, git/web-dev/AI topics). **Do not use Lorem Ipsum** — write plausible, specific placeholder copy in the same voice as the samples below.

### `src/data/siteConfig.js`
```js
export const siteConfig = {
  clubName: "[CLUB_NAME]",
  tagline: "Code. Build. Ship.",
  description:
    "A student-run community of builders and curious minds who learn by making things together.",
  email: "[CLUB_EMAIL]@college.edu",
  foundingYear: 2019,
  socials: {
    github: "https://github.com/[CLUB_HANDLE]",
    instagram: "https://instagram.com/[CLUB_HANDLE]",
    linkedin: "https://linkedin.com/company/[CLUB_HANDLE]",
    discord: "https://discord.gg/[INVITE_CODE]",
  },
};
```

### `src/data/events.js`
```js
export const events = [
  {
    id: "intro-to-git-workshop",
    title: "Intro to Git & GitHub Workshop",
    date: "2026-09-12",
    time: "5:00 PM",
    location: "CS Building, Room 204",
    status: "upcoming", // "upcoming" | "past"
    description:
      "A hands-on session on version control basics for first-year students.",
    longDescription:
      "We'll cover repositories, commits, branches, and pull requests using real examples, then pair up to fix a small bug in a shared practice repo. Laptops required, no prior Git experience needed.",
    tags: ["Workshop", "Beginner-Friendly"],
    image: "/src/assets/images/events/git-workshop.jpg",
    alt: "Students at laptops during a Git workshop",
    registrationLink: "https://forms.gle/[FORM_ID]",
  },
  {
    id: "fall-hackathon-2026",
    title: "Fall Hackathon: 24 Hours",
    date: "2026-10-24",
    time: "6:00 PM",
    location: "Innovation Lab",
    status: "upcoming",
    description: "Our flagship 24-hour build event, open to all majors.",
    longDescription:
      "Teams of up to 4 build anything they want in 24 hours, then demo to a panel of judges from local startups. Food, mentors, and prizes provided.",
    tags: ["Hackathon", "Flagship"],
    image: "/src/assets/images/events/hackathon.jpg",
    alt: "Students collaborating around laptops at a hackathon",
    registrationLink: "https://forms.gle/[FORM_ID]",
  },
  {
    id: "spring-hackathon-2026",
    title: "Spring Hackathon Recap",
    date: "2026-03-14",
    time: "6:00 PM",
    location: "Innovation Lab",
    status: "past",
    description: "12 teams, 24 hours, 1 winner — our biggest turnout yet.",
    longDescription:
      "Recap of our spring hackathon: what teams built, who won, and photos from the weekend.",
    tags: ["Hackathon", "Recap"],
    image: "/src/assets/images/events/spring-hackathon.jpg",
    alt: "Winning team holding a trophy at the spring hackathon",
    registrationLink: null,
  },
];
```

### `src/data/team.js`
```js
export const team = [
  {
    id: "president",
    name: "[MEMBER_NAME]",
    role: "President",
    year: "3rd Year, CSE",
    bio: "Leads club direction and partnerships. Into distributed systems and bad puns.",
    image: "/src/assets/images/team/president.jpg",
    alt: "Portrait of the club president",
    socials: { github: "https://github.com/[HANDLE]", linkedin: "https://linkedin.com/in/[HANDLE]" },
  },
  {
    id: "vice-president",
    name: "[MEMBER_NAME]",
    role: "Vice President",
    year: "3rd Year, IT",
    bio: "Runs weekly workshops and onboarding for new members.",
    image: "/src/assets/images/team/vice-president.jpg",
    alt: "Portrait of the club vice president",
    socials: { github: "https://github.com/[HANDLE]", linkedin: "https://linkedin.com/in/[HANDLE]" },
  },
  {
    id: "technical-lead",
    name: "[MEMBER_NAME]",
    role: "Technical Lead",
    year: "2nd Year, CSE",
    bio: "Maintains club projects and mentors the hackathon teams.",
    image: "/src/assets/images/team/technical-lead.jpg",
    alt: "Portrait of the technical lead",
    socials: { github: "https://github.com/[HANDLE]", linkedin: "https://linkedin.com/in/[HANDLE]" },
  },
  {
    id: "events-coordinator",
    name: "[MEMBER_NAME]",
    role: "Events Coordinator",
    year: "2nd Year, ECE",
    bio: "Books rooms, wrangles logistics, keeps the hackathons fed.",
    image: "/src/assets/images/team/events-coordinator.jpg",
    alt: "Portrait of the events coordinator",
    socials: { github: "https://github.com/[HANDLE]", linkedin: "https://linkedin.com/in/[HANDLE]" },
  },
];
```

### `src/data/posts.js`
```js
export const posts = [
  {
    id: "getting-started-with-git",
    title: "Getting Started with Git: A Beginner's Guide",
    author: "[MEMBER_NAME]",
    date: "2026-08-20",
    status: "published", // "published" | "archived"
    excerpt: "The five Git commands you'll actually use in your first month.",
    content:
      "## Why Git\n\nMost of what trips people up with Git isn't the tool, it's the mental model...\n\n## The five commands\n\n1. `git status`\n2. `git add`\n3. `git commit`\n4. `git push`\n5. `git pull`\n\n...", 
    tags: ["Git", "Beginner"],
    coverImage: "/src/assets/images/blog/git-guide.jpg",
    alt: "Terminal window showing a git log",
  },
  {
    id: "hackathon-recap-fall-2025",
    title: "Our Hackathon Recap: 24 Hours, 12 Teams, 1 Winner",
    author: "[MEMBER_NAME]",
    date: "2026-03-16",
    status: "published",
    excerpt: "What twelve teams built in twenty-four hours, and what we'd change next time.",
    content:
      "## The turnout\n\nTwelve teams, up from eight last semester...\n\n## What won\n\n...",
    tags: ["Hackathon", "Recap"],
    coverImage: "/src/assets/images/blog/hackathon-recap.jpg",
    alt: "Students presenting a project on stage",
  },
];
```

`content` fields are Markdown strings, rendered with `react-markdown` wrapped in a `prose` (Tailwind Typography) container — see Section 6, BlogPost page.

---

## 6. Page-by-Page & Component-by-Component Requirements

### Global: `Navbar`
- Sticky top, `bg-paper/90 backdrop-blur border-b border-rule`.
- Left: club name (`font-display font-semibold`), links to `/`.
- Right (desktop, `md:` and up): links to Home, About, Events, Team, Blog, Contact — active route gets `text-indigo` + underline.
- Right (mobile, below `md`): hamburger icon (`lucide-react` `Menu`/`X`) toggling a full-width dropdown with the same links, stacked.
- Far right: "Join Us" button (primary style), links to `/contact`.

### Global: `Footer`
- Club name + one-line tagline from `siteConfig`.
- Column of quick links (same as nav).
- Row of social icons (`lucide-react`: `Github`, `Instagram`, `Linkedin`, and a generic `MessageCircle` for Discord), each linking to `siteConfig.socials`.
- Bottom line, `font-mono text-sm text-ink-muted`: `© {new Date().getFullYear()} [CLUB_NAME]. Built by club members.` — the year must be computed, never hardcoded.

### `Home.jsx`
1. **Hero:** Large headline with club name/tagline (`TypingHeadline` component types out the tagline character-by-character once on mount, respecting `prefers-reduced-motion` by rendering the final text immediately if set). Sub-paragraph with `siteConfig.description`. Two CTAs: primary "Join the Club" → `/contact`, secondary "View Events" → `/events`.
2. **Stats bar:** 3 small stat cards computed from data — member count (`team.length`), events hosted (`events.length`), founding year (`siteConfig.foundingYear`). Do not hardcode these numbers.
3. **Upcoming events preview:** Filter `events` where `status === "upcoming"`, show up to 3 as `EventCard`s, "View All Events →" link to `/events`. If none are upcoming, show a friendly empty state instead of an empty grid.
4. **About preview:** Short 2–3 sentence mission blurb + "Learn more →" link to `/about`.
5. **Latest posts preview:** Latest 2 posts (sorted by `date` descending) as `BlogPostCard`s, "Read the blog →" link to `/blog`.
6. **Closing CTA banner:** "Ready to build with us?" + primary button to `/contact`.

### `About.jsx`
1. Mission/vision statement (2–3 paragraphs).
2. "What we do" grid: 3–4 activity cards (e.g., Workshops, Hackathons, Open-Source Projects, Peer Mentorship) — icon (`lucide-react`) + short description each.
3. "Why join" benefits list: 4 short bullet points (e.g., hands-on projects, mentorship, hackathon squad, industry connections) — suggested copy, replace with real specifics.
4. Founding blurb using `siteConfig.foundingYear`.

### `Events.jsx`
- Tab/toggle: **Upcoming** (default) / **Past**, filtering `events` by `status`.
- Grid of `EventCard`s for the active tab, sorted by `date` (ascending for upcoming, descending for past).
- Empty state per tab: "No upcoming events right now — check back soon!" / "No past events yet."

**`EventCard`:** `StatusMeta` (`#{id}` + colored dot) → title (`h3`) → formatted date + time + location (`font-mono text-sm text-ink-muted`, use `Intl.DateTimeFormat` for the date, e.g. "Sep 12, 2026" — never hand-parse or hardcode month names) → short `description` → tag `Badge`s → "View Details →" linking to `/events/{id}`.

### `EventDetail.jsx` (route: `/events/:id`)
- Read `id` via `useParams()`, `find()` the matching event in `events`.
- If not found: render the same friendly message as `NotFound.jsx` inline (don't hard-redirect).
- If found: title, full formatted date/time/location, `longDescription`, tag `Badge`s, and — only if `registrationLink` is not `null` — a primary "Register" button linking out.
- "← Back to Events" link to `/events`.

### `Team.jsx`
- Grid of `TeamMemberCard`s from `team`, in the array's given order (do not re-sort alphabetically — the order encodes role seniority).

**`TeamMemberCard`:** photo (`rounded-md`, object-cover, falls back to a simple initials avatar if `image` fails to load) → name (`h3`) → role (`text-indigo font-medium`) → year (`font-mono text-sm text-ink-muted`) → `bio` → small row of social icon links.

### `Blog.jsx`
- List/grid of `BlogPostCard`s from `posts` where `status === "published"`, sorted by `date` descending.
- `OPTIONAL`: tag-based filter chips above the grid. Skip in the first pass if it adds friction.

**`BlogPostCard`:** cover image (optional, only if `coverImage` present) → `StatusMeta` (`#{id}` + dot) → title (`h3`) → author + formatted date (`font-mono text-sm text-ink-muted`) → `excerpt` → tag `Badge`s → "Read more →" linking to `/blog/{id}`.

### `BlogPost.jsx` (route: `/blog/:id`)
- Read `id` via `useParams()`, `find()` in `posts`. Not-found handling same pattern as `EventDetail`.
- Title, author, formatted date, tag `Badge`s, cover image if present.
- Body: `content` markdown string rendered via `react-markdown`, wrapped in a `<div className="prose prose-neutral max-w-none">` (Tailwind Typography) so headings/lists/code blocks inherit sane styles without manual overrides.
- "← Back to Blog" link.

### `Contact.jsx`
- `ContactForm` component: fields — Name (text), Email (email), Subject (`select`: "Membership Inquiry", "Event Question", "Sponsorship / Partnership", "General Question"), Message (textarea).
- On submit: `fetch("https://formspree.io/f/[FORMSPREE_FORM_ID]", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name, email, subject, message }) })`.
- Show an inline success message ("Thanks — we'll get back to you soon.") or inline error message in the UI. **Never use `alert()`/`confirm()`.**
- Disable the submit button and show a loading label while the request is in flight.
- Sidebar/secondary block: `mailto:` link using `siteConfig.email`, social icons, and a placeholder line for meeting location/time (e.g., "We meet Thursdays, 5 PM, CS Building Room 204" — replace with real info).

### `NotFound.jsx` (catch-all route `*`)
- Centered message in the site's voice, e.g. "404 — this route threw an uncaught exception." Primary button "← Back home" to `/`.

---

## 7. Execution Order

Follow these phases in order. Do not skip ahead to page content before routing and the design tokens are working — verify each phase before moving to the next.

### Step 0 — Gather missing details
Ask the human for: club name, one-line tagline, contact email, social handles (GitHub/Instagram/LinkedIn/Discord), meeting time/location, and a Formspree form ID (free, sign up at formspree.io). If any are unavailable, keep the `[BRACKETED_PLACEHOLDER]` values from Section 5 and flag clearly in your response that they still need replacing.

### Phase 1 — Initialize
```bash
npm create vite@latest club-website -- --template react
cd club-website
npm install
npm install tailwindcss @tailwindcss/vite
npm install react-router
npm install lucide-react
npm install react-markdown
npm install -D @tailwindcss/typography
```
1. Edit `vite.config.js` — add both `react()` and `tailwindcss()` to the `plugins` array.
2. Replace the entire contents of `src/index.css` with:
   ```css
   @import "tailwindcss";
   @plugin "@tailwindcss/typography";

   @theme {
     --color-paper: #FAFAF8;
     --color-paper-raised: #FFFFFF;
     --color-ink: #16181D;
     --color-ink-muted: #52565E;
     --color-indigo: #3730A3;
     --color-signal: #15803D;
     --color-amber: #B45309;
     --color-rule: #E4E4E7;

     --font-display: "Bricolage Grotesque", sans-serif;
     --font-body: "IBM Plex Sans", sans-serif;
     --font-mono: "JetBrains Mono", monospace;
   }
   ```
3. Delete Vite's default boilerplate: the counter demo in `App.jsx`, `App.css`, and the sample assets it references.
4. Add Google Fonts `<link>` tags (preconnect + stylesheet, for Bricolage Grotesque, IBM Plex Sans, JetBrains Mono) to `index.html`'s `<head>`, plus a real `<title>` and meta description using `[CLUB_NAME]`.
5. Create `DESIGN_SYSTEM.md` at the project root with the full content of Section 3 above.
6. Create `vercel.json` at the project root:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
7. Scaffold every folder and empty file from the Section 4 file tree.

### Phase 2 — Data layer
8. Write `src/data/siteConfig.js`, `events.js`, `team.js`, `posts.js` exactly per Section 5, extended with the additional realistic entries described there.

### Phase 3 — Routing & layout
9. Build `Layout.jsx` (`Navbar` + `<Outlet />` + `Footer`).
10. Build `Navbar.jsx` and `Footer.jsx` per Section 6.
11. Wire `App.jsx` with `BrowserRouter`/`Routes`/`Route` (imported from `"react-router"`) for every page in the file tree, nested under `Layout`. Stub each page with just a heading at first.
12. Run `npm run dev` and click through every route before writing real page content — confirm no 404s and the layout renders on all of them.

### Phase 4 — UI primitives
13. Build `Button`, `Card`, `Badge`, `SectionHeading`, `Container`, `StatusMeta`, `TypingHeadline` in `components/ui/` exactly per the Design System component patterns in Section 3.

### Phase 5 — Pages, in this order
14. `Home.jsx`
15. `About.jsx`
16. `Events.jsx` + `EventCard` + `EventDetail.jsx`
17. `Team.jsx` + `TeamMemberCard`
18. `Blog.jsx` + `BlogPostCard` + `BlogPost.jsx`
19. `Contact.jsx` + `ContactForm`
20. `NotFound.jsx`

### Phase 6 — Polish
21. Responsive pass at `375px`, `768px`, `1024px`, `1440px`.
22. Accessibility pass against Section 3's baseline: focus rings, alt text, semantic landmarks, contrast.
23. Confirm `prefers-reduced-motion` disables the hero typing animation and hover-lift transforms.
24. Run `npm run build` locally — fix any errors before deploying. Run `npm run preview` and click through the production build once.

### Phase 7 — Deploy
25. Push to GitHub.
26. Import the repo in Vercel — it will auto-detect the Vite framework preset. No manual build-command changes needed.
27. Deploy, then manually visit a non-root route directly (e.g., `your-site.vercel.app/events`) and hard-refresh to confirm `vercel.json`'s rewrite is working and it doesn't 404.

---

## Strict Constraints — Do Not

- Do not use TypeScript, a UI kit (MUI/Chakra/shadcn/Ant Design/Bootstrap), or a state management library (Redux/Zustand/Recoil/MobX).
- Do not install or import from `react-router-dom` — the package is `react-router` (v8+).
- Do not create a `tailwind.config.js` or `postcss.config.js` — Tailwind v4's CSS-first config via `@theme` in `index.css` is the only configuration.
- Do not stand up a backend, API route, or database (Express, MongoDB, Postgres, Firebase, Supabase) — content is static, forms go straight to Formspree.
- Do not add authentication, login, or an admin dashboard.
- Do not add pages beyond Home/About/Events/Team/Blog/Contact/404 (no Gallery, Sponsors, or Project-Showcase pages — these were considered and cut for v1).
- Do not hardcode event/team/post content directly in JSX — everything dynamic comes from `src/data/*.js`.
- Do not use Lorem Ipsum — use realistic club-appropriate placeholder copy.
- Do not use `alert()`/`confirm()` anywhere — all feedback is inline UI state.
- Do not set up a testing framework (Vitest/Jest/RTL) unless separately asked — out of scope for v1.
- Do not deploy to or configure anything for Netlify/AWS/GitHub Pages — Vercel only.
- Do not introduce colors, fonts, or border-radius values outside Section 3's Design System.
