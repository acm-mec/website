import { Link, useParams } from "react-router";
import { ArrowLeft, MapPin, Clock, ExternalLink } from "lucide-react";
import { events } from "../data/events";
import Container from "../components/ui/Container";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import StatusMeta from "../components/ui/StatusMeta";
import { formatDate } from "../utils/dates";

export default function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <section className="py-24">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
              404
            </p>
            <h1 className="text-3xl font-display font-semibold text-ink mb-4">
              Event not found
            </h1>
            <p className="text-base font-body text-ink-muted mb-8">
              This event doesn't exist — it may have been removed or the URL is wrong.
            </p>
            <Button as={Link} to="/events" variant="secondary">
              ← Back to Events
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const { title, date, time, location, status, longDescription, tags, registrationLink } = event;

  const formattedDate = formatDate(date, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 font-body text-sm text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded mb-8 group"
        >
          <ArrowLeft
            size={14}
            aria-hidden="true"
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Back to Events
        </Link>

        <div className="max-w-2xl">
          <StatusMeta id={id} status={status} />

          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink tracking-tight leading-tight mb-6">
            {title}
          </h1>

          <div className="flex flex-col gap-2 mb-6 p-4 bg-paper-raised border border-rule rounded-md">
            <p className="flex items-center gap-2 font-mono text-sm text-ink-muted">
              <Clock size={14} aria-hidden="true" />
              {formattedDate} · {time}
            </p>
            <p className="flex items-center gap-2 font-mono text-sm text-ink-muted">
              <MapPin size={14} aria-hidden="true" />
              {location}
            </p>
          </div>

          <p className="text-base font-body text-ink leading-relaxed mb-6">
            {longDescription}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}

          {registrationLink && (
            <Button
              as="a"
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="gap-2"
            >
              Register
              <ExternalLink size={14} aria-hidden="true" />
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
