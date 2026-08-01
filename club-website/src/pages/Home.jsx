import { Link } from "react-router";
import { ArrowRight, Users, Calendar, Clock3 } from "lucide-react";
import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import TypingHeadline from "../components/ui/TypingHeadline";
import EventCard from "../components/shared/EventCard";

export default function Home() {
  const { siteConfig, events, team } = useData();

  const upcomingEvents = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const stats = [
    {
      icon: Users,
      value: team.length + "+",
      label: "Active Members",
    },
    {
      icon: Calendar,
      value: events.length + "+",
      label: "Events Hosted",
    },
    {
      icon: Clock3,
      value: `Est. ${siteConfig.foundingYear}`,
      label: "Years Running",
    },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 md:py-32 bg-paper border-b border-rule overflow-hidden">
        {/* Subtle grid pattern background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25 dark:opacity-15 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-rule" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Ambient radial glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-96 h-96 bg-indigo/10 dark:bg-indigo/20 blur-3xl rounded-full pointer-events-none"
        />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-raised border border-rule mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                {siteConfig.clubName} · Model Engineering College
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-4">
              <TypingHeadline text={siteConfig.tagline} speed={60} />
            </h1>
            <p className="text-lg md:text-xl font-body text-ink-muted leading-relaxed mb-8 max-w-xl">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to="/contact" variant="primary">
                Join the Club
              </Button>
              <Button as={Link} to="/events" variant="secondary">
                View Events
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-12 bg-paper-raised border-b border-rule">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4 rounded-md border border-rule hover:border-indigo transition-colors duration-150"
              >
                <div className="w-10 h-10 rounded bg-indigo/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-indigo" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-ink">
                    {value}
                  </p>
                  <p className="font-mono text-xs text-ink-muted uppercase tracking-wide">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Upcoming events preview ── */}
      <section className="py-16 md:py-24 bg-paper border-b border-rule">
        <Container>
          <SectionHeading
            title="Upcoming Events"
            subtitle="What we're running next. All are open to any student."
          />
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-rule rounded-md bg-paper-raised">
              <p className="font-mono text-sm text-ink-muted">
                No upcoming events right now — check back soon.
              </p>
            </div>
          )}
          <div className="mt-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-indigo hover:text-[--color-indigo-hover] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
            >
              View All Events
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── About preview ── */}
      <section className="py-16 md:py-24 bg-paper-raised border-b border-rule">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
              About the Club
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink tracking-tight mb-4">
              We build things. Together.
            </h2>
            <p className="text-base font-body text-ink-muted leading-relaxed mb-3">
              ACM MEC is a technical club at the intersection of curiosity and execution. We believe the best way to learn computing is to build something real — whether that's a 24-hour hackathon project, an open-source contribution, or a workshop that finally makes Git click.
            </p>
            <p className="text-base font-body text-ink-muted leading-relaxed mb-6">
              We're open to everyone. You don't need a CS background, a GitHub profile, or a startup idea. You just need to show up.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-indigo hover:text-[--color-indigo-hover] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
            >
              Learn more about us
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-16 md:py-24 bg-indigo text-white dark:text-[#070D17]">
        <Container>
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Ready to build with us?
            </h2>
            <p className="text-base font-body opacity-90 leading-relaxed mb-8">
              Join a community that ships things. We'd love to have you.
            </p>
            <Button
              as={Link}
              to="/contact"
              variant="secondary"
              className="!bg-white !text-[#16181D] hover:!bg-gray-100 dark:!bg-[#070D17] dark:!text-white dark:hover:!bg-[#121E30] dark:!border-[#070D17] font-semibold border-none shadow-md"
            >
              Get in Touch
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
