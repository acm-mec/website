# ACM MEC Website Content & Configuration

> 📖 **DOCUMENTATION & EDITING GUIDE**
>
> This single Markdown file contains all text content, page headings, button labels, descriptions, and site-wide configuration settings for the **ACM MEC Website**.
>
> ### ✏️ How to Edit
> - Edit the text values enclosed in backticks `` `like this` `` or inside bullet points.
> - Each section clearly documents **where the text appears on the website** and **what purpose it serves**.
>
> ⚠️ **Note on Events & Team Data**:
> As per project requirements, individual event listings (`src/data/events.js`) and core team member profiles (`src/data/team.js`) remain in their respective data files.

---

## 1. Global Site Configuration
> **Belongs To**: Global Site Header, Footer, Browser Title & `src/data/siteConfig.js`  
> **Documentation**: Core identity details used across all pages of the website.

- **Club Name**: `ACM MEC`
  - *Where it belongs*: Navigation bar logo, hero badge, page footer, browser title.
  - *Documentation*: The official display name of the student chapter.

- **Tagline**: `Code. Build. Ship.`
  - *Where it belongs*: Home page hero typing animation headline, footer tagline.
  - *Documentation*: Short 3-word club motto.

- **Description**: `A student run community of builders and curious minds who learn by making things together. We run workshops, hackathons, and open-source projects — all powered by people who like to build.`
  - *Where it belongs*: Home hero paragraph, footer description, search engine meta description.
  - *Documentation*: High-level summary of the club's mission and purpose.

- **Contact Email**: `acmstudentchapter.mec@gmail.com`
  - *Where it belongs*: Contact page email link, footer contact link, mailto actions.
  - *Documentation*: Primary contact email address for membership and general inquiries.

- **Founding Year**: `2026`
  - *Where it belongs*: Home page stats bar ("Est. 2026"), About page history section.
  - *Documentation*: Four-digit founding year used to auto-calculate years running.

### Global Social Links
> **Belongs To**: Navbar, Footer, and Contact Page social icon buttons.  
> **Documentation**: Full HTTPS URLs to the club's official social media platforms.

- **GitHub URL**: `https://github.com/acm-mec`
- **Instagram URL**: `https://instagram.com/acm.mec`
- **LinkedIn URL**: `https://linkedin.com/company/acm-mec`
- **Discord Invite URL**: `https://discord.gg/acmmec`

---

## 2. Home Page Content (`/`)
> **Belongs To**: `src/pages/Home.jsx`  
> **Documentation**: Text elements rendered on the main landing page.

### Hero Section
> **Belongs To**: Top landing hero banner (`src/pages/Home.jsx` -> Hero Section)

- **Badge College Name**: `Model Engineering College`
  - *Where it belongs*: Text inside top hero pill badge next to the club name (`ACM MEC · Model Engineering College`).
  - *Documentation*: College affiliation label.

- **Primary Action Button**: `Join the Club`
  - *Where it belongs*: Main CTA button in hero linking to `/contact`.
  - *Documentation*: Label for joining the club.

- **Secondary Action Button**: `View Events`
  - *Where it belongs*: Secondary CTA button in hero linking to `/events`.
  - *Documentation*: Label for exploring upcoming events.

### Stats Bar
> **Belongs To**: 3-column stats bar below hero (`src/pages/Home.jsx` -> Stats Bar)

- **Members Stat Label**: `Active Members`
  - *Where it belongs*: Label below the active team count.
- **Events Stat Label**: `Events Hosted`
  - *Where it belongs*: Label below the total events count.
- **Years Stat Label**: `Years Running`
  - *Where it belongs*: Label below the founding year stat.

### Upcoming Events Section
> **Belongs To**: Events preview grid (`src/pages/Home.jsx` -> Upcoming Events Section)

- **Section Title**: `Upcoming Events`
  - *Where it belongs*: Main section heading.
- **Section Subtitle**: `What we're running next. All are open to any student.`
  - *Where it belongs*: Explanatory text below section heading.
- **Empty State Text**: `No upcoming events right now — check back soon.`
  - *Where it belongs*: Displayed when no upcoming events exist.
- **View All Link Text**: `View All Events`
  - *Where it belongs*: Bottom link leading to `/events`.

### About Preview Section
> **Belongs To**: Mid-page club summary (`src/pages/Home.jsx` -> About Preview Section)

- **Category Badge**: `About the Club`
  - *Where it belongs*: Small uppercase tag above section title.
- **Section Heading**: `We build things. Together.`
  - *Where it belongs*: Main heading for the About preview.
- **Paragraph 1**: `ACM MEC is a technical club at the intersection of curiosity and execution. We believe the best way to learn computing is to build something real — whether that's a 24-hour hackathon project, an open-source contribution, or a workshop that finally makes Git click.`
  - *Where it belongs*: First paragraph of the preview.
- **Paragraph 2**: `We're open to everyone. You don't need a CS background, a GitHub profile, or a startup idea. You just need to show up.`
  - *Where it belongs*: Second paragraph of the preview.
- **Learn More Link Text**: `Learn more about us`
  - *Where it belongs*: Link text leading to `/about`.

### Call to Action (CTA) Banner
> **Belongs To**: Bottom banner on Home page (`src/pages/Home.jsx` -> CTA Banner)

- **Banner Heading**: `Ready to build with us?`
  - *Where it belongs*: Prominent white heading inside indigo banner.
- **Banner Subtitle**: `Join a community that ships things. We'd love to have you.`
  - *Where it belongs*: Subtitle inside indigo banner.
- **Banner Button Text**: `Get in Touch`
  - *Where it belongs*: Button text linking to `/contact`.

---

## 3. About Page Content (`/about`)
> **Belongs To**: `src/pages/About.jsx`  
> **Documentation**: Copy and pillar details on the About page.

### Header Section
> **Belongs To**: Top header of About page (`src/pages/About.jsx` -> Page Header)

- **Category Label**: `About`
  - *Where it belongs*: Small top tag above main heading.
- **Main Heading**: `Who we are`
  - *Where it belongs*: H1 title of About page.
- **Paragraph 1**: `ACM MEC is the technical computing club at our college, affiliated with the Association for Computing Machinery — the world's largest educational computing society. We've been running since 2026, growing from a small group of students who wanted to build things together into a community that spans every department.`
  - *Where it belongs*: First overview paragraph.
- **Paragraph 2**: `Our focus is deliberate: we don't try to cover everything. Instead, we go deep on software development — version control, web technologies, systems thinking, machine learning applications, and the craft of building software that actually works. Every workshop, event, and project is designed to bridge the gap between what you learn in a lecture hall and what you need to build something real.`
  - *Where it belongs*: Second overview paragraph explaining core focus.
- **Paragraph 3**: `Membership is open to any student at the college. We've had members from CSE, IT, ECE, Mechanical, and even Civil. The only prerequisite is curiosity.`
  - *Where it belongs*: Third overview paragraph regarding membership eligibility.

### What We Do (Four Pillars)
> **Belongs To**: 4-card pillar grid (`src/pages/About.jsx` -> What We Do)

- **Section Title**: `What we do`
  - *Where it belongs*: H2 section title.
- **Section Subtitle**: `Four pillars that form the backbone of everything we run.`
  - *Where it belongs*: Subtitle line under section title.

#### Pillar 1: Workshops
- **Title**: `Workshops`
  - *Where it belongs*: Card 1 title.
- **Description**: `Hands-on sessions on everything from Git basics to deploying ML models. Led by members, for members — no jargon, just working code.`
  - *Where it belongs*: Card 1 description.

#### Pillar 2: Hackathons
- **Title**: `Hackathons`
  - *Where it belongs*: Card 2 title.
- **Description**: `Semester-flagship 24-hour build events open to all majors. Teams, mentors, food, and real prizes. The best project demos we've seen started as bad ideas at 2 AM.`
  - *Where it belongs*: Card 2 description.

#### Pillar 3: Open-Source Projects
- **Title**: `Open-Source Projects`
  - *Where it belongs*: Card 3 title.
- **Description**: `Club-maintained repositories where members build real tools together. Contribution is open to all — a great way to get comfortable with collaboration workflows.`
  - *Where it belongs*: Card 3 description.

#### Pillar 4: Peer Mentorship
- **Title**: `Peer Mentorship`
  - *Where it belongs*: Card 4 title.
- **Description**: `Senior members pair with juniors for study sessions, code reviews, and project feedback. If you're stuck, there's always someone who's been stuck in the same place.`
  - *Where it belongs*: Card 4 description.

### Why Join Section
> **Belongs To**: Benefits list on About page (`src/pages/About.jsx` -> Why Join)

- **Section Title**: `Why join?`
  - *Where it belongs*: H2 section title.
- **Section Subtitle**: `The practical case for spending time here.`
  - *Where it belongs*: Subtitle line under section title.
- **Benefit 1**: `Build a portfolio of real shipped projects — not just coursework.`
- **Benefit 2**: `Get a ready-made hackathon team and mentorship before the event starts.`
- **Benefit 3**: `Develop collaboration skills through actual open-source workflows.`
- **Benefit 4**: `Access a network of alumni in software, research, and startups.`

### Founding History Card
> **Belongs To**: Side callout card on About page (`src/pages/About.jsx` -> Founding Blurb)

- **Card Header**: `Established 2026`
  - *Where it belongs*: Top label inside founding card.
- **Card Description**: `The club was founded in 2026 by a group of students who felt that the gap between classroom theory and practical software development was too wide and too consequential to ignore. The founding principle — that the best way to learn to build software is to build software — still drives everything we do today.`
  - *Where it belongs*: Main story paragraph inside founding card.

---

## 4. Contact Page Content (`/contact`)
> **Belongs To**: `src/pages/Contact.jsx`  
> **Documentation**: Contact page headings and card copy.

### Header Section
> **Belongs To**: Top area of Contact page (`src/pages/Contact.jsx` -> Page Header)

- **Category Label**: `Contact`
  - *Where it belongs*: Small uppercase tag above heading.
- **Main Heading**: `Get in touch`
  - *Where it belongs*: H1 title of Contact page.
- **Description**: `Whether you want to join, collaborate, or just ask a question — we're easy to reach. Pick whatever channel works best for you.`
  - *Where it belongs*: Subtitle paragraph under main heading.

### Email Card
> **Belongs To**: Email action box (`src/pages/Contact.jsx` -> Email Card)

- **Card Heading**: `Email us`
  - *Where it belongs*: H2 title inside email card.
- **Card Description**: `The best way to reach us for membership inquiries, event questions, or partnership opportunities.`
  - *Where it belongs*: Paragraph description inside email card.

### Socials Card
> **Belongs To**: Social links box (`src/pages/Contact.jsx` -> Socials Card)

- **Card Heading**: `Find us online`
  - *Where it belongs*: H2 title inside socials card.

---

## 5. Events Page Content (`/events`)
> **Belongs To**: `src/pages/Events.jsx`  
> **Documentation**: Events page general copy and tab empty state messages. (Note: Individual event items remain in `src/data/events.js`).

### Header Section
> **Belongs To**: Top header on Events page (`src/pages/Events.jsx` -> Header)

- **Category Label**: `Events`
  - *Where it belongs*: Small uppercase tag above heading.
- **Main Heading**: `What's happening`
  - *Where it belongs*: H1 title of Events page.

### Empty State Messages
> **Belongs To**: Message shown when a tab filter returns no events (`src/pages/Events.jsx` -> Tab Panel)

- **All Tab Empty**: `No events yet. Check back soon!`
- **Upcoming Tab Empty**: `No upcoming events right now — check back soon!`
- **Past Tab Empty**: `No past events yet. Stay tuned.`

---

## 6. Team Page Content (`/team`)
> **Belongs To**: `src/pages/Team.jsx`  
> **Documentation**: Team page header copy. (Note: Individual team member profiles remain in `src/data/team.js`).

### Header Section
> **Belongs To**: Top header on Team page (`src/pages/Team.jsx` -> Header)

- **Category Label**: `Team`
  - *Where it belongs*: Small uppercase tag above heading.
- **Main Heading**: `The people behind it`
  - *Where it belongs*: H1 title of Team page.
- **Description**: `A small core team runs the club. Every member here also mentors and builds alongside you — there's no hierarchy beyond shared responsibility.`
  - *Where it belongs*: Description paragraph under main heading.
