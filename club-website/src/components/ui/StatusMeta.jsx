/**
 * StatusMeta — commit-log style "#id · status-dot" line.
 * Renders: #event-id  ●  UPCOMING (or PAST / PUBLISHED / ARCHIVED)
 *
 * status: "upcoming" | "past" | "published" | "archived"
 */
export default function StatusMeta({ id, status }) {
  const isActive = status === "upcoming" || status === "published";

  const dotColor = isActive ? "text-signal" : "text-ink-muted";
  const labelColor = isActive ? "text-signal" : "text-ink-muted";

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-ink-muted uppercase tracking-wide mb-2">
      <span>#{id}</span>
      <span className="text-rule">·</span>
      <span className={`flex items-center gap-1 ${labelColor}`}>
        <span className={`inline-block w-1.5 h-1.5 rounded-full bg-current ${dotColor}`} aria-hidden="true" />
        {status}
      </span>
    </div>
  );
}
