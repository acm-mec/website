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
