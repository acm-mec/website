# ACM MEC Website — Design System

## Creative Direction: "Terminal Notebook"

The reference points are a code editor and a lab notebook. A light, high-contrast paper background, hairline rules instead of heavy shadows, and a recurring monospace "commit log" motif — every event and blog post gets a small `#id` tag and a colored status dot, like a `git log --oneline` line.

---

## Color Palette

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAFAF8` | Page background |
| `paper-raised` | `#FFFFFF` | Card / raised surface background |
| `ink` | `#16181D` | Primary text, headings |
| `ink-muted` | `#52565E` | Secondary text, captions, metadata |
| `indigo` | `#3730A3` | Primary accent — links, primary buttons, active nav state, focus rings |
| `signal` | `#15803D` | "Upcoming" / success status only — dots and badge text, never a large fill |
| `amber` | `#2DB7E5` | Tags, hover highlights (club brand Electric Cyan from logo) |
| `rule` | `#E4E4E7` | Borders, dividers, card outlines |

Do not introduce additional colors outside this table. Do not use gradients anywhere.

---

## Typography

| Role | Font | Where it's used |
|---|---|---|
| Display | `Bricolage Grotesque` | Hero headline, section H2s, card titles — bold/semibold only |
| Body | `IBM Plex Sans` | Paragraphs, nav, buttons, form inputs |
| Mono | `JetBrains Mono` | Dates, tags, status badges, the `#id` commit-style tags, footer copyright |

**Type scale:**
- Hero H1: `text-5xl md:text-7xl font-display font-bold tracking-tight`
- Section H2: `text-3xl md:text-4xl font-display font-semibold`
- Card title H3: `text-xl font-display font-semibold`
- Body: `text-base font-body leading-relaxed text-ink`
- Meta/caption: `text-sm font-mono text-ink-muted uppercase tracking-wide`

---

## Layout & Spacing

- Max content width: `max-w-6xl`, centered, `px-6` on mobile / `px-8` on desktop.
- Section vertical rhythm: `py-16` mobile, `py-24 md:py-28` desktop.
- Card padding: `p-6`. Grid gaps: `gap-6` to `gap-8`.

---

## Shape & Elevation

- Border radius: `rounded-md` (cards, inputs, images), `rounded` (buttons, badges). **Never** `rounded-full` or `rounded-2xl`/`3xl`.
- Elevation: `1px solid` `rule`-colored border first, `shadow-sm` at rest. On hover: `shadow-md` + `-translate-y-0.5`, 150ms transition.

---

## Motion

- Respect `prefers-reduced-motion`: disable hero typing animation and hover-lift transforms.
- Micro-interactions only: 150ms color/border transitions, card hover-lift, typing animation in hero.
- No scroll-triggered reveals, no parallax, no page transitions.

---

## Component Patterns

- **Primary button:** `bg-indigo text-white rounded px-5 py-2.5 font-body font-medium` → hover: darker indigo + `-translate-y-0.5`; focus: `ring-2 ring-indigo ring-offset-2`.
- **Secondary/outline button:** `border border-ink text-ink bg-transparent rounded px-5 py-2.5` → hover: `bg-ink text-paper`.
- **Card:** `bg-paper-raised border border-rule rounded-md p-6` → hover-lift.
- **Status badge:** `inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-2 py-1 rounded border`.
- **Commit-style meta tag:** `font-mono text-xs text-ink-muted` string rendering `#{id}` + colored status dot.

---

## Accessibility Baseline

- Every interactive element has a visible focus ring: `ring-2 ring-indigo ring-offset-2`.
- Color contrast: minimum 4.5:1 body text, 3:1 large text.
- Every image has a real, descriptive `alt`.
- Semantic HTML: one `<h1>` per page, `<nav>`, `<main>`, `<footer>` landmarks.
- Mobile-first, tested at 375px, 768px, 1024px, 1440px.
