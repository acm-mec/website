import rawContent from "./SITE_CONTENT.md?raw";

function getSectionBlock(text, headerPattern) {
  if (!text) return "";
  const regex = new RegExp(`(?:^|\\n)##\\s+${headerPattern}[^\\n]*\\n([\\s\\S]*?)(?=(?:\\n##\\s+|$))`, "i");
  const match = text.match(regex);
  return match ? match[1] : "";
}

function getSubBlock(text, headerPattern) {
  if (!text) return "";
  const regex = new RegExp(`(?:^|\\n)(?:###|####)\\s+${headerPattern}[^\\n]*\\n([\\s\\S]*?)(?=(?:\\n(?:###|####)\\s+|$))`, "i");
  const match = text.match(regex);
  return match ? match[1] : "";
}

function extractValue(text, keyPattern, defaultValue = "") {
  if (!text) return defaultValue;
  const regex = new RegExp(`- \\*\\*${keyPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*\\*:\\s*\`([^\`]+)\``, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : defaultValue;
}

// Extract block text per section (matching "## N. Section Header")
const sec1Global = getSectionBlock(rawContent, "1\\. Global Site Configuration");
const sec2Home = getSectionBlock(rawContent, "2\\. Home Page Content");
const sec3About = getSectionBlock(rawContent, "3\\. About Page Content");
const sec4Contact = getSectionBlock(rawContent, "4\\. Contact Page Content");
const sec5Events = getSectionBlock(rawContent, "5\\. Events Page Content");
const sec6Team = getSectionBlock(rawContent, "6\\. Team Page Content");

// Home subsections
const homeHero = getSubBlock(sec2Home, "Hero Section");
const homeStats = getSubBlock(sec2Home, "Stats Bar");
const homeUpcoming = getSubBlock(sec2Home, "Upcoming Events Section");
const homeAboutPrev = getSubBlock(sec2Home, "About Preview Section");
const homeCTA = getSubBlock(sec2Home, "Call to Action");

// About subsections
const aboutHeader = getSubBlock(sec3About, "Header Section");
const aboutPillarsSec = getSubBlock(sec3About, "What We Do");
const pillar1 = getSubBlock(sec3About, "Pillar 1: Workshops");
const pillar2 = getSubBlock(sec3About, "Pillar 2: Hackathons");
const pillar3 = getSubBlock(sec3About, "Pillar 3: Open-Source Projects");
const pillar4 = getSubBlock(sec3About, "Pillar 4: Peer Mentorship");
const aboutWhyJoin = getSubBlock(sec3About, "Why Join Section");
const aboutFounding = getSubBlock(sec3About, "Founding History Card");

// Contact subsections
const contactHeader = getSubBlock(sec4Contact, "Header Section");
const contactEmailCard = getSubBlock(sec4Contact, "Email Card");
const contactSocialsCard = getSubBlock(sec4Contact, "Socials Card");

// Events subsections
const eventsHeader = getSubBlock(sec5Events, "Header Section");
const eventsEmpty = getSubBlock(sec5Events, "Empty State Messages");

// Team subsections
const teamHeader = getSubBlock(sec6Team, "Header Section");

export const siteConfig = {
  // Section 1
  clubName: extractValue(sec1Global, "Club Name", "ACM MEC"),
  tagline: extractValue(sec1Global, "Tagline", "Compute.Create.Connect"),
  description: extractValue(
    sec1Global,
    "Description",
    "A student run community of builders and curious minds who learn by making things together. We run workshops, hackathons, and open-source projects — all powered by people who like to build."
  ),
  email: extractValue(sec1Global, "Contact Email", "acmstudentchapter.mec@gmail.com"),
  foundingYear: parseInt(extractValue(sec1Global, "Founding Year", "2026"), 10) || 2026,
  socials: {
    github: extractValue(sec1Global, "GitHub URL", "https://github.com/acm-mec"),
    instagram: extractValue(sec1Global, "Instagram URL", "https://instagram.com/acm.mec"),
    linkedin: extractValue(sec1Global, "LinkedIn URL", "https://linkedin.com/company/acm-mec"),
    discord: extractValue(sec1Global, "Discord Invite URL", "https://discord.gg/acmmec"),
  },

  // Section 2: Home
  home: {
    hero: {
      badgeCollegeName: extractValue(homeHero, "Badge College Name", "Model Engineering College"),
      primaryButton: extractValue(homeHero, "Primary Action Button", "Join the Club"),
      secondaryButton: extractValue(homeHero, "Secondary Action Button", "View Events"),
    },
    stats: {
      membersLabel: extractValue(homeStats, "Members Stat Label", "Active Members"),
      eventsLabel: extractValue(homeStats, "Events Stat Label", "Events Hosted"),
      yearsLabel: extractValue(homeStats, "Years Stat Label", "Years Running"),
    },
    upcomingEvents: {
      title: extractValue(homeUpcoming, "Section Title", "Upcoming Events"),
      subtitle: extractValue(homeUpcoming, "Section Subtitle", "What we're running next. All are open to any student."),
      emptyText: extractValue(homeUpcoming, "Empty State Text", "No upcoming events right now — check back soon."),
      viewAllText: extractValue(homeUpcoming, "View All Link Text", "View All Events"),
    },
    aboutPreview: {
      badge: extractValue(homeAboutPrev, "Category Badge", "About the Club"),
      heading: extractValue(homeAboutPrev, "Section Heading", "We build things. Together."),
      paragraph1: extractValue(homeAboutPrev, "Paragraph 1"),
      paragraph2: extractValue(homeAboutPrev, "Paragraph 2"),
      learnMoreText: extractValue(homeAboutPrev, "Learn More Link Text", "Learn more about us"),
    },
    cta: {
      heading: extractValue(homeCTA, "Banner Heading", "Ready to build with us?"),
      subtitle: extractValue(homeCTA, "Banner Subtitle", "Join a community that ships things. We'd love to have you."),
      buttonText: extractValue(homeCTA, "Banner Button Text", "Get in Touch"),
    },
  },

  // Section 3: About
  about: {
    header: {
      badge: extractValue(aboutHeader, "Category Label", "About"),
      heading: extractValue(aboutHeader, "Main Heading", "Who we are"),
      paragraph1: extractValue(aboutHeader, "Paragraph 1"),
      paragraph2: extractValue(aboutHeader, "Paragraph 2"),
      paragraph3: extractValue(aboutHeader, "Paragraph 3"),
    },
    pillarsSection: {
      title: extractValue(aboutPillarsSec, "Section Title", "What we do"),
      subtitle: extractValue(aboutPillarsSec, "Section Subtitle", "Four pillars that form the backbone of everything we run."),
    },
    pillars: [
      {
        id: "workshops",
        title: extractValue(pillar1, "Title", "Workshops"),
        description: extractValue(pillar1, "Description"),
      },
      {
        id: "hackathons",
        title: extractValue(pillar2, "Title", "Hackathons"),
        description: extractValue(pillar2, "Description"),
      },
      {
        id: "projects",
        title: extractValue(pillar3, "Title", "Open-Source Projects"),
        description: extractValue(pillar3, "Description"),
      },
      {
        id: "mentorship",
        title: extractValue(pillar4, "Title", "Peer Mentorship"),
        description: extractValue(pillar4, "Description"),
      },
    ],
    whyJoin: {
      title: extractValue(aboutWhyJoin, "Section Title", "Why join?"),
      subtitle: extractValue(aboutWhyJoin, "Section Subtitle", "The practical case for spending time here."),
      benefits: [
        extractValue(aboutWhyJoin, "Benefit 1"),
        extractValue(aboutWhyJoin, "Benefit 2"),
        extractValue(aboutWhyJoin, "Benefit 3"),
        extractValue(aboutWhyJoin, "Benefit 4"),
      ].filter(Boolean),
    },
    founding: {
      header: extractValue(aboutFounding, "Card Header", "Established 2026"),
      description: extractValue(aboutFounding, "Card Description"),
    },
  },

  // Section 4: Contact
  contact: {
    header: {
      badge: extractValue(contactHeader, "Category Label", "Contact"),
      heading: extractValue(contactHeader, "Main Heading", "Get in touch"),
      description: extractValue(contactHeader, "Description"),
    },
    emailCard: {
      heading: extractValue(contactEmailCard, "Card Heading", "Email us"),
      description: extractValue(contactEmailCard, "Card Description"),
    },
    socialsCard: {
      heading: extractValue(contactSocialsCard, "Card Heading", "Find us online"),
    },
  },

  // Section 5: Events
  eventsPage: {
    header: {
      badge: extractValue(eventsHeader, "Category Label", "Events"),
      heading: extractValue(eventsHeader, "Main Heading", "What's happening"),
    },
    emptyMessages: {
      all: extractValue(eventsEmpty, "All Tab Empty", "No events yet. Check back soon!"),
      upcoming: extractValue(eventsEmpty, "Upcoming Tab Empty", "No upcoming events right now — check back soon!"),
      past: extractValue(eventsEmpty, "Past Tab Empty", "No past events yet. Stay tuned."),
    },
  },

  // Section 6: Team
  teamPage: {
    header: {
      badge: extractValue(teamHeader, "Category Label", "Team"),
      heading: extractValue(teamHeader, "Main Heading", "The people behind it"),
      description: extractValue(teamHeader, "Description"),
    },
  },
};

