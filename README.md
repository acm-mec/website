<<<<<<< HEAD
# ⚡ ACM MEC — Official Website

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v8.0-CA4245?logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)

Welcome to the official repository for the **ACM MEC (Association for Computing Machinery — Model Engineering College Student Chapter)** website.

This project is a modern, high-performance, single-page application (SPA) built for technical student engagement, workshop organization, event showcases, hackathon announcements, team listings, and student-authored technical articles.

---

## 🎯 Key Features

- **💻 Dynamic Hero & Monospace Aesthetics:** Inspired by modern developer tools ("Terminal Notebook" & Cyber-Metallic ACM branding).
- **🌗 Theme Toggle (Light / Dark Mode):** Context-driven theme switcher supporting both dark cyber-metallic and light paper aesthetics.
- **📅 Events Hub:** Showcase of upcoming workshops, hackathons, and archived past events with status indicators (`Upcoming`, `Completed`, `Registration Open`).
- **👥 Core Team Showcase:** Dedicated directory showcasing executive committee members, roles, and social media handles.
- **✍️ Markdown Technical Blog:** Student-written technical articles rendered via `react-markdown` with syntax highlighting support.
- **📫 Contact & Community Hub:** Formspree-powered contact form with immediate validation and social link directory.
- **📱 Fully Responsive:** Adaptive layouts optimized for mobile, tablet, and ultra-wide displays.
- **🚀 Zero-Backend Architecture:** Content managed directly via structured ES modules—no databases, CMS setup, or API latency.

---

## 🏗️ Tech Stack & Architecture

| Layer | Technology | Description |
|---|---|---|
| **Build Engine** | [Vite 8](https://vitejs.dev/) | Next-generation frontend tooling with lightning-fast HMR |
| **Framework** | [React 19](https://react.dev/) | Modular component architecture using functional React |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | CSS-first utility design system defined via `@theme` tokens in `index.css` |
| **Routing** | [React Router v8](https://reactrouter.com/) | Declarative mode routing (`BrowserRouter`, `Routes`, `Route`) |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent stroke-based SVG icons |
| **Markdown Parser** | `react-markdown` + `@tailwindcss/typography` | High-fidelity Markdown rendering for blog posts |
| **Linting & Quality** | [Oxlint](https://oxc.rs/) | High-speed JavaScript static code analysis |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) | Automatic continuous deployment with SPA route rewriting (`vercel.json`) |

---

## 📂 Repository Layout

```
.
├── LICENSE                      # MIT Open Source License
├── PRD.md                       # Comprehensive Product Requirements Document
├── PROJECT_BRIEF.MD             # Project brief and quick architectural notes
├── README.md                    # Root project documentation (you are here)
├── CONTRIBUTING.md              # Contributor guidelines and workflow
├── .editorconfig                # Cross-editor formatting configurations
├── .gitattributes               # Git line-ending normalization rules
├── .gitignore                   # Root ignore rules (node_modules, dist, envs)
├── acm_design_system.md         # Branding color tokens & design guidelines
├── acm_logo.png                 # Official 3D ACM MEC Chapter logo asset
└── club-website/                # Primary React + Vite Application Workspace
    ├── vercel.json              # Vercel SPA route rewrite rules
    ├── vite.config.js           # Vite build configuration
    ├── package.json             # NPM dependencies & build scripts
    ├── public/                  # Static assets and favicon
    └── src/
        ├── assets/              # Web application images & media
        ├── components/          # Reusable UI, shared, & layout components
        │   ├── layout/          # Navbar, Footer, Layout wrapper
        │   ├── shared/          # EventCard, TeamMemberCard, BlogPostCard
        │   └── ui/              # Button, Card, Badge, ThemeToggle, TypingHeadline
        ├── context/             # ThemeContext (Light / Dark mode provider)
        ├── data/                # ⚡ Static Data Configuration Files (Edit here!)
        │   ├── siteConfig.js    # Club metadata & social links
        │   ├── events.js        # Event schedule & listings
        │   ├── team.js          # Core team & executive committee profiles
        │   └── posts.js         # Technical blog posts (Markdown)
        ├── pages/               # Top-level route pages (Home, About, Events, Team, Blog, Contact)
        └── utils/               # Helper utilities (date formatters, tags)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v20.19.0` or `v22.12.0` (or higher)
- **npm**: `v10.0.0` or higher

### 1. Clone & Navigate
```bash
git clone https://github.com/acm-mec/website.git
cd website/club-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## ⚙️ Available NPM Scripts

Inside the `club-website/` directory, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Launches Vite local development server with Hot Module Replacement (HMR) |
| `npm run build` | Bundles production-optimized static assets into `dist/` |
| `npm run lint` | Runs `oxlint` static code analysis for quality and error checking |
| `npm run preview` | Serves the production build locally for verification before deployment |

---

## 🛠️ How to Edit Content & Club Information

Updating site content does **not** require editing React components or writing HTML! All club details and content are managed in single-purpose JavaScript data files inside `club-website/src/data/`:

### 1. Editing Club Details & Social Links
Open `club-website/src/data/siteConfig.js`:
```javascript
export const siteConfig = {
  clubName: "ACM MEC",
  tagline: "Innovate. Code. Create.",
  description: "The official Student Chapter of ACM at Model Engineering College.",
  email: "acm@mec.ac.in",
  socials: {
    github: "https://github.com/acm-mec",
    linkedin: "https://linkedin.com/company/acm-mec",
    instagram: "https://instagram.com/acm_mec",
  }
};
```

### 2. Adding / Editing Events
Open `club-website/src/data/events.js` and add a new object:
```javascript
{
  id: "hacknight-2026",
  title: "ACM Annual HackNight",
  date: "2026-09-15",
  category: "Hackathon",
  status: "Upcoming",
  description: "24-hour hackathon focused on building open-source developer tools.",
  location: "Main Auditorium / Hybrid"
}
```

### 3. Adding Team Members
Open `club-website/src/data/team.js` to update executive board or team profiles.

### 4. Adding Blog Posts
Open `club-website/src/data/posts.js` and append your article (written in standard Markdown syntax).

---

## 🎨 Design System

The application uses custom design tokens specified under `@theme` in `src/index.css`:
- **Dark Mode Background (`acm-bg`):** Deep Space Blue (`#070D17`)
- **Card Surfaces (`acm-card`):** Shadow Slate (`#121E30`)
- **Accent Cyan (`acm-blue`):** Electric Cyan (`#2DB7E5`)
- **Glow Highlight (`acm-glow`):** Cyan Glow (`#66EAFF`)
- **Typography:** `Inter` (sans-serif) for body/headings and `Fira Code` / `JetBrains Mono` for code snippets.

---

## 🚢 Deployment to Vercel

The application is optimized for Vercel deployment:
1. Push your changes to GitHub.
2. Import the repository in Vercel and select `club-website` as the root directory.
3. Vercel automatically detects Vite.
4. The included `vercel.json` ensures client-side routing works for all deep URLs (`/events/1`, `/blog/react-guide`, etc.):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 🤝 Contributing

We welcome pull requests from community members and student developers! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
=======
# Website
>>>>>>> 6eb1bde19c9a910f7c04ae4c5f2a2e2a16d0b9cf
