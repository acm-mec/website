import { Link } from "react-router";
import { ArrowRight, Users, Calendar, Clock3, Sparkles } from "lucide-react";
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
      label: siteConfig.home?.stats?.membersLabel || "Active Members",
    },
    {
      icon: Calendar,
      value: events.length + "+",
      label: siteConfig.home?.stats?.eventsLabel || "Events Hosted",
    },
    {
      icon: Clock3,
      value: `Est. ${siteConfig.foundingYear}`,
      label: siteConfig.home?.stats?.yearsLabel || "Years Running",
    },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 md:py-32 bg-transparent border-b border-rule overflow-hidden">
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
            <h1 className="text-5xl md:text-7xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-4">
              <TypingHeadline text={siteConfig.tagline} speed={60} />
            </h1>
            <p className="text-lg md:text-xl font-body text-ink-muted leading-relaxed mb-8 max-w-xl">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to="/contact" variant="primary">
                {siteConfig.home?.hero?.primaryButton || "Join the Club"}
              </Button>
              <Button as={Link} to="/events" variant="secondary">
                {siteConfig.home?.hero?.secondaryButton || "View Events"}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-12 bg-paper-raised/40 border-b border-rule">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4 rounded-md border border-rule hover:border-indigo transition-colors duration-150 bg-paper/40"
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
      <section className="py-16 md:py-24 bg-transparent border-b border-rule">
        <Container>
          <SectionHeading
            title={siteConfig.home?.upcomingEvents?.title || "Upcoming Events"}
            subtitle={siteConfig.home?.upcomingEvents?.subtitle || "What we're running next. All are open to any student."}
          />
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-rule rounded-md bg-paper-raised/50">
              <p className="font-mono text-sm text-ink-muted">
                {siteConfig.home?.upcomingEvents?.emptyText || "No upcoming events right now — check back soon."}
              </p>
            </div>
          )}
          <div className="mt-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-indigo hover:text-[--color-indigo-hover] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
            >
              {siteConfig.home?.upcomingEvents?.viewAllText || "View All Events"}
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
      <section className="py-16 md:py-24 bg-paper-raised/40 border-b border-rule">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
              {siteConfig.home?.aboutPreview?.badge || "About the Club"}
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink tracking-tight mb-4">
              {siteConfig.home?.aboutPreview?.heading || "We build things. Together."}
            </h2>
            {siteConfig.home?.aboutPreview?.paragraph1 && (
              <p className="text-base font-body text-ink-muted leading-relaxed mb-3">
                {siteConfig.home.aboutPreview.paragraph1}
              </p>
            )}
            {siteConfig.home?.aboutPreview?.paragraph2 && (
              <p className="text-base font-body text-ink-muted leading-relaxed mb-6">
                {siteConfig.home.aboutPreview.paragraph2}
              </p>
            )}
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-indigo hover:text-[--color-indigo-hover] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
            >
              {siteConfig.home?.aboutPreview?.learnMoreText || "Learn more about us"}
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
      <section className="py-16 md:py-24 bg-transparent border-t border-rule relative overflow-hidden">
        <Container>
          <div className="relative rounded-2xl p-8 md:p-14 overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl">
            {/* Ambient background glow accents */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/25 blur-3xl rounded-full pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"
            />

            {/* Grid overlay */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="cta-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 font-mono text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-6">
                <Sparkles size={14} className="text-cyan-300 animate-pulse" />
                Join the Community
              </span>

              <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-[1.15] mb-5">
                {siteConfig.home?.cta?.heading || "Ready to build with us?"}
              </h2>

              <p className="text-base md:text-lg font-body text-slate-300 leading-relaxed mb-8 max-w-xl">
                {siteConfig.home?.cta?.subtitle || "Join a community that ships things. We'd love to have you."}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-body font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-150 group"
                >
                  <span>{siteConfig.home?.cta?.buttonText || "Get in Touch"}</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-150"
                  />
                </Link>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white/10 hover:bg-white/15 text-white border border-white/20 font-body font-medium text-sm backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-150"
                >
                  Explore Events
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

