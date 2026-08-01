import { Link } from "react-router";
import { siteConfig } from "../../data/siteConfig";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  DiscordIcon,
} from "../ui/SocialIcons";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const socialIcons = [
  { key: "github", Icon: GitHubIcon, label: "GitHub" },
  { key: "instagram", Icon: InstagramIcon, label: "Instagram" },
  { key: "linkedin", Icon: LinkedInIcon, label: "LinkedIn" },
  { key: "discord", Icon: DiscordIcon, label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-paper mt-auto">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-display font-semibold text-lg text-ink">
              {siteConfig.clubName}
            </p>
            <p className="mt-1.5 text-sm font-body text-ink-muted leading-relaxed">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 text-sm font-body text-ink-muted leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-ink-muted mb-4">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm font-body text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-ink-muted mb-4">
              Find Us
            </p>
            <div className="flex items-center gap-4">
              {socialIcons.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  href={siteConfig.socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <div className="mt-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm font-body text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-rule">
          <p className="font-mono text-sm text-ink-muted">
            © {new Date().getFullYear()} {siteConfig.clubName}. Built by club
            members.
          </p>
        </div>
      </div>
    </footer>
  );
}
