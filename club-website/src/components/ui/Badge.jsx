/**
 * Badge — inline tag chip.
 * variant: "default" (amber/cyan accent) | "muted" (ink-muted)
 */
export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:
      "border-amber text-amber bg-amber/10",
    muted:
      "border-rule text-ink-muted bg-paper",
  };

  return (
    <span
      className={`inline-flex items-center font-mono text-xs uppercase tracking-wide px-2 py-0.5 rounded border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
