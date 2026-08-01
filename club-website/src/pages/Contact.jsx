import { useState } from "react";
import { siteConfig } from "../data/siteConfig";
import Container from "../components/ui/Container";
import { Mail, Copy, Check } from "lucide-react";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  DiscordIcon,
} from "../components/ui/SocialIcons";

const socialLinks = [
  {
    key: "github",
    Icon: GitHubIcon,
    label: "GitHub",
    handle: "@" + siteConfig.socials.github.split("/").pop(),
  },
  {
    key: "instagram",
    Icon: InstagramIcon,
    label: "Instagram",
    handle: "@" + siteConfig.socials.instagram.split("/").pop(),
  },
  {
    key: "linkedin",
    Icon: LinkedInIcon,
    label: "LinkedIn",
    handle: siteConfig.clubName + " on LinkedIn",
  },
  {
    key: "discord",
    Icon: DiscordIcon,
    label: "Discord",
    handle: "Join our server",
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select + copy for non-secure contexts
      const el = document.createElement("textarea");
      el.value = siteConfig.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
          Contact
        </p>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-4">
          Get in touch
        </h1>
        <p className="text-base font-body text-ink-muted leading-relaxed mb-12 max-w-xl">
          Whether you want to join, collaborate, or just ask a question — we're
          easy to reach. Pick whatever channel works best for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          {/* Email block */}
          <div className="bg-paper-raised border border-rule rounded-md p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="w-10 h-10 rounded bg-indigo/10 flex items-center justify-center mb-4">
              <Mail size={20} className="text-indigo" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-display font-semibold text-ink mb-2">
              Email us
            </h2>
            <p className="text-base font-body text-ink-muted leading-relaxed mb-4">
              The best way to reach us for membership inquiries, event
              questions, or partnership opportunities.
            </p>

            {/* Email address + copy button */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-sm text-indigo hover:text-[--color-indigo-hover] underline underline-offset-4 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded"
              >
                {siteConfig.email}
              </a>
              <button
                onClick={handleCopy}
                aria-label={copied ? "Email copied!" : "Copy email address"}
                title={copied ? "Copied!" : "Copy email"}
                className="inline-flex items-center gap-1 text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded p-0.5"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-signal" aria-hidden="true" />
                    <span className="font-mono text-xs text-signal">Copied!</span>
                  </>
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Socials block */}
          <div className="bg-paper-raised border border-rule rounded-md p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <h2 className="text-xl font-display font-semibold text-ink mb-5">
              Find us online
            </h2>
            <ul className="flex flex-col gap-4">
              {socialLinks.map(({ key, Icon, label, handle }) => (
                <li key={key}>
                  <a
                    href={siteConfig.socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${siteConfig.clubName} on ${label}`}
                    className="flex items-center gap-3 text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="flex flex-col">
                      <span className="font-body text-sm font-medium group-hover:text-indigo transition-colors duration-150">
                        {label}
                      </span>
                      <span className="font-mono text-xs text-ink-muted">
                        {handle}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
