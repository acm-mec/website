import { useState } from "react";
import { UserIcon, Globe } from "lucide-react";
import {
  GitHubIcon,
  LinkedInIcon,
  InstagramIcon,
  WhatsAppIcon,
  TwitterIcon,
} from "../ui/SocialIcons";

const SOCIAL_PLATFORMS = [
  { key: "github", label: "GitHub", Icon: GitHubIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon },
  { key: "twitter", label: "Twitter", Icon: TwitterIcon },
  { key: "website", label: "Website", Icon: Globe },
];

/**
 * TeamMemberCard — photo (with initials fallback) + name + role + year + bio + socials.
 * Shows a user-icon placeholder when name is still a bracketed placeholder.
 */
export default function TeamMemberCard({ member }) {
  const { name, role, year, image, socials } = member;
  const [imgError, setImgError] = useState(false);

  // Detect bracketed placeholder like "[MEMBER_NAME]"
  const isPlaceholder = /^\[.*\]$/.test(name.trim());

  // Build initials from real names only
  const initials = !isPlaceholder
    ? name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  const showImage = image && !imgError;

  // Filter active, non-empty, non-placeholder social links
  const activeSocials = SOCIAL_PLATFORMS.filter(({ key }) => {
    const val = socials?.[key];
    return Boolean(val && typeof val === "string" && val.trim() !== "" && !val.includes("placeholder"));
  });

  return (
    <div className="bg-paper-raised border border-rule rounded-md p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between h-full">
      <div>
        {/* Member Photo Header */}
        <div className="w-full aspect-[4/3] max-h-56 rounded-md overflow-hidden bg-indigo/10 border border-rule relative mb-4 flex items-center justify-center">
          {showImage ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : initials ? (
            <span className="font-display font-bold text-3xl text-indigo">
              {initials}
            </span>
          ) : (
            <UserIcon
              size={40}
              className="text-indigo/40"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Member Info */}
        <h3 className="text-xl font-display font-semibold text-ink leading-tight mb-1">
          {isPlaceholder ? (
            <span className="font-mono text-base text-ink-muted">
              [Name TBD]
            </span>
          ) : (
            name
          )}
        </h3>
        <p className="text-sm font-body font-semibold text-indigo mb-1">{role}</p>
        <p className="font-mono text-xs text-ink-muted mb-2">{year}</p>
      </div>

      {/* Dynamic social links */}
      {activeSocials.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-3 border-t border-rule mt-2">
          {activeSocials.map(({ key, label, Icon }) => (
            <a
              key={key}
              href={socials[key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on ${label}`}
              className="p-2 text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
