import rawContent from "./SITE_CONTENT.md?raw";

function extractValue(md, keyPattern, defaultValue) {
  const regex = new RegExp(`- \\*\\*${keyPattern}\\*\\*:\\s*\`([^\`]+)\``, "i");
  const match = md.match(regex);
  return match ? match[1].trim() : defaultValue;
}

export const siteConfig = {
  clubName: extractValue(rawContent, "Club Name", "ACM MEC"),
  tagline: extractValue(rawContent, "Tagline", "Code. Build. Ship."),
  description: extractValue(
    rawContent,
    "Description",
    "A student-run community of builders and curious minds who learn by making things together. We run workshops, hackathons, and open-source projects — all powered by people who like to build."
  ),
  email: extractValue(rawContent, "Contact Email", "acmmec@college.edu"),
  foundingYear: parseInt(extractValue(rawContent, "Founding Year", "2026"), 10) || 2026,
  socials: {
    github: extractValue(rawContent, "GitHub URL", "https://github.com/acm-mec"),
    instagram: extractValue(rawContent, "Instagram URL", "https://instagram.com/acm_mec"),
    linkedin: extractValue(rawContent, "LinkedIn URL", "https://linkedin.com/company/acm-mec"),
    discord: extractValue(rawContent, "Discord Invite URL", "https://discord.gg/acmmec"),
  },
};
