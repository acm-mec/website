/**
 * SectionHeading — standardized H2 with optional subtitle.
 * align: "left" | "center"
 */
export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
}) {
  const alignClass = align === "center" ? "text-center" : "";
  return (
    <div className={`mb-10 ${alignClass} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base font-body text-ink-muted leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
