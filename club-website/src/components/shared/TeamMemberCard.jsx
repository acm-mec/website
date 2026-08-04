import { useState } from "react";
import { UserIcon } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "../ui/SocialIcons";

/**
 * TeamMemberCard — photo (with initials fallback) + name + role + year + bio + socials.
 * Shows a user-icon placeholder when name is still a bracketed placeholder.
 */
export default function TeamMemberCard({ member }) {
  const { name, role, year, bio, image, socials } = member;
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

  return (
    <div className="bg-paper-raised border border-rule rounded-md p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-4">
      {/* Avatar + name row */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-md overflow-hidden bg-indigo/10 border border-rule flex-shrink-0 flex items-center justify-center">
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
            <span className="font-display font-semibold text-lg text-indigo">
              {initials}
            </span>
          ) : (
            <UserIcon
              size={22}
              className="text-indigo/50"
              aria-hidden="true"
            />
          )}
        </div>

        <div>
          <h3 className="text-xl font-display font-semibold text-ink leading-tight">
            {isPlaceholder ? (
              <span className="font-mono text-base text-ink-muted">
                [Name TBD]
              </span>
            ) : (
              name
            )}
          </h3>
          <p className="text-sm font-body font-medium text-indigo">{role}</p>
        </div>
      </div>

      <p className="font-mono text-sm text-ink-muted">{year}</p>
      <p className="text-base font-body text-ink-muted leading-relaxed flex-1">
        {bio}
      </p>

      {/* Social links */}
      {socials && (
        <div className="flex items-center gap-1 pt-1">
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on GitHub`}
              className="p-2 text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
            >
              <GitHubIcon size={17} />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on LinkedIn`}
              className="p-2 text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
            >
              <LinkedInIcon size={17} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
