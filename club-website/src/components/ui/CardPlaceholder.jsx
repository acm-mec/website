/**
 * CardPlaceholder — a subtle SVG code-pattern placeholder for cards
 * that have no cover image (events, blog posts).
 *
 * variant: "event" | "blog"
 */
export default function CardPlaceholder({ variant = "blog", className = "" }) {
  const lines =
    variant === "event"
      ? [
          "$ git log --oneline",
          "a3f9c12 upcoming event scheduled",
          "d82bc01 venue confirmed",
          "4e1a087 registration opened",
          "9f23cd4 initial planning",
        ]
      : [
          "## getting started",
          "",
          "```bash",
          "git clone <repo>",
          "npm install",
          "npm run dev",
          "```",
        ];

  return (
    <div
      className={`w-full h-44 rounded-md bg-paper border border-rule flex items-center justify-center overflow-hidden relative ${className}`}
      aria-hidden="true"
    >
      {/* Faint grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${variant}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E4E4E7" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${variant})`} />
      </svg>

      {/* Faux code lines */}
      <div className="relative z-10 px-5 py-4 w-full font-mono text-xs text-ink-muted leading-relaxed opacity-60 select-none">
        {lines.map((line, i) => (
          <p key={i} className="truncate">
            {line || "\u00A0"}
          </p>
        ))}
      </div>
    </div>
  );
}
