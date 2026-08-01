# Contributing to ACM MEC Website

Thank you for your interest in contributing to the **ACM MEC Website**! We welcome contributions from members, students, and open-source enthusiasts.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) `v20.19+` or `v22.12+`
- `npm` `v10+`
- `git`

### Setup Instructions
1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/acm-mec/website.git
   cd website/club-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to view the application with Hot Module Replacement (HMR).

---

## 📝 How to Update Content

You do not need to alter component logic or backend code to update club information! All content lives in centralized configuration files under `club-website/src/data/`:

| What you want to edit | Target File | Notes |
|---|---|---|
| Club Name, Tagline, Social Links, Email | `src/data/siteConfig.js` | Modifies global site footer, hero, contact info |
| Upcoming & Past Events | `src/data/events.js` | Add/edit event objects with title, date, status |
| Executive Team Members | `src/data/team.js` | Add/edit team member profiles, roles, photos |
| Blog Posts & Technical Articles | `src/data/posts.js` | Content formatted in Markdown (`react-markdown`) |

---

## 🛠️ Code Conventions & Quality Standards

- **Framework & Libraries:** React 19 + Vite 8 + React Router 8 (declarative mode) + Tailwind CSS v4.
- **JavaScript (no TypeScript):** Write clean ES6+ JavaScript.
- **Styling:** Use Tailwind CSS utility classes defined under `@theme` in `src/index.css`. Avoid inline styles or third-party UI libraries.
- **Linting:** Run `npm run lint` before committing to check for code quality issues using Oxlint.
- **Build Check:** Always run `npm run build` to verify production compilation before opening a Pull Request.

---

## 🔀 Pull Request Process

1. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes with descriptive commit messages:
   ```bash
   git commit -m "feat(events): add annual hackathon 2026 event listing"
   ```
3. Push to your branch and open a Pull Request against the `main` branch.
4. Ensure your PR description clearly states what was added or modified.

---

## 📄 License
By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
