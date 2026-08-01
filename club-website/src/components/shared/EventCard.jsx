import { Link } from "react-router";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import Card from "../ui/Card";
import StatusMeta from "../ui/StatusMeta";
import Badge from "../ui/Badge";
import { formatDate } from "../../utils/dates";

/**
 * EventCard — displays a summary of an event with commit-log meta.
 * Uses timezone-safe formatDate utility (no UTC shift).
 */
export default function EventCard({ event }) {
  const { id, title, date, time, location, status, description, tags } = event;

  const formattedDate = formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col h-full">
      <StatusMeta id={id} status={status} />

      <h3 className="text-xl font-display font-semibold text-ink mb-3 leading-snug">
        {title}
      </h3>

      <div className="flex flex-col gap-1 mb-4">
        <p className="flex items-center gap-1.5 font-mono text-sm text-ink-muted">
          <Clock size={13} aria-hidden="true" />
          {formattedDate} · {time}
        </p>
        <p className="flex items-center gap-1.5 font-mono text-sm text-ink-muted">
          <MapPin size={13} aria-hidden="true" />
          {location}
        </p>
      </div>

      <p className="text-base font-body text-ink-muted leading-relaxed mb-4 flex-1">
        {description}
      </p>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      <Link
        to={`/events/${id}`}
      className="inline-flex items-center gap-1 font-body text-sm font-medium text-indigo hover:text-[--color-indigo-hover] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
      >
        View Details
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="group-hover:translate-x-0.5 transition-transform duration-150"
        />
      </Link>
    </Card>
  );
}
