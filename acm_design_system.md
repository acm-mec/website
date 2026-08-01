# ACM MEC Web Design System

## 1. Project Vibe & Aesthetic

The ACM MEC website should reflect the core values of the club: modern, tech-forward, and professional. The design is heavily inspired by the official "cyber-metallic" 3D cube logo.

  

*   **Theme:** Dark mode by default (sleek, developer-focused).

*   **Style:** Minimalist, high contrast, subtle glassmorphism, and neon-cyan accents.

*   **Primary Audience:** Tech-savvy college students, freshers looking to join, and industry professionals/sponsors.

  

---

  

## 2. Color Palette

These colors are extracted directly from the ACM MEC 3D logo (`image_60c557.jpg`) and map directly to the custom Tailwind configuration.

  

| Color Name | Hex Code | Usage | Tailwind Class |

| :--- | :--- | :--- | :--- |

| **Deep Space Blue** | `#070D17` | Main body background. Gives a rich, dark navy/black base. | `bg-acm-bg` |

| **Shadow Slate** | `#121E30` | Background for cards (Events, Team) and dropdown menus. | `bg-acm-card` |

| **Electric Cyan** | `#2DB7E5` | Primary brand color. Use for main buttons, links, and active states. | `text-acm-blue` / `bg-acm-blue` |

| **Cyan Glow** | `#66EAFF` | Highlight color. Use for hover effects, glowing borders, or text accents. | `text-acm-glow` / `bg-acm-glow` |

| **Metallic Silver** | `#C2C9D1` | Primary paragraph text. Reduces eye strain compared to pure white. | `text-acm-silver` |

| **Pure White** | `#FFFFFF` | Use sparingly for massive `h1` and `h2` headings to ensure they pop. | `text-white` |

  

---

  

## 3. Typography

For a coding club, typography should be clean and highly legible, favoring sans-serif or monospace for accents.

  

*   **Primary Font:** `Inter` (or Tailwind default `sans`). Used for all body text, cards, and UI elements.

*   **Heading Font:** `Inter` (Bold/ExtraBold). Used for section titles.

*   **Code/Accent Font:** `Fira Code` or `JetBrains Mono` (Optional). Use for small badges, code snippets, or tech stack tags (e.g., `[NEXT.JS]`).

  

### Text Sizing Guide (Tailwind)

*   **Hero Title (`h1`):** `text-5xl md:text-7xl font-extrabold tracking-tight`

*   **Section Title (`h2`):** `text-3xl md:text-4xl font-bold`

*   **Card Title (`h3`):** `text-xl font-semibold`

*   **Body Text (`p`):** `text-base md:text-lg text-acm-silver leading-relaxed`

  

---

  

## 4. UI Components & Styling Rules

  

### Buttons

*   **Primary (e.g., "Join Us"):** Solid cyan background, dark text, rounded corners.

    *   *Classes:* `bg-acm-blue text-acm-bg font-bold py-3 px-6 rounded-lg hover:bg-acm-glow transition-colors`

*   **Secondary (e.g., "View Events"):** Transparent background, cyan border, cyan text.

    *   *Classes:* `border-2 border-acm-blue text-acm-blue font-bold py-3 px-6 rounded-lg hover:bg-acm-blue hover:text-acm-bg transition-colors`

  

### Cards (Events & Team)

Cards should pop slightly off the deep background using the `acm-card` color and a very subtle border.

*   *Container Classes:* `bg-acm-card border border-gray-800 rounded-xl p-6 shadow-lg hover:border-acm-blue transition-colors`

  

### Navigation Bar

The navbar should stick to the top of the screen and use a glassmorphism effect so the background slightly blurs behind it.

*   *Container Classes:* `sticky top-0 z-50 bg-acm-bg/80 backdrop-blur-md border-b border-gray-800`

  

---

  

## 5. Tailwind Configuration

  

To implement this design system, ensure your `tailwind.config.cjs` (or `tailwind.config.ts`) includes the following extended theme:

  

```javascript

module.exports = {

  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  theme: {

    extend: {

      colors: {

        acm: {

          bg: '#070D17',

          card: '#121E30',

          blue: '#2DB7E5',

          glow: '#66EAFF',

          silver: '#C2C9D1',

        }

      },

      fontFamily: {

        sans: ['Inter', 'sans-serif'],

        mono: ['Fira Code', 'monospace'],

      }

    }

  },

  plugins: [],

}

```