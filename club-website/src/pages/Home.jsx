import { Link } from "react-router";
import { ArrowRight, Users, Calendar, Clock3 } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { events } from "../data/events";
import { team } from "../data/team";
import { posts } from "../data/posts";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import TypingHeadline from "../components/ui/TypingHeadline";
import EventCard from "../components/shared/EventCard";
import BlogPostCard from "../components/shared/BlogPostCard";

const upcomingEvents = events
  .filter((e) => e.status === "upcoming")
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 3);

const latestPosts = posts
  .filter((p) => p.status === "published")
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 2);

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

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-32 bg-paper border-b border-rule">
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-sm text-ink-muted uppercase tracking-widest mb-4">
              {siteConfig.clubName} / {new Date().getFullYear()}
            </p>
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
                className="flex items-center gap-4 p-4 rounded-md border border-rule"
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

      {/* ── Latest posts ── */}
      <section className="py-16 md:py-24 bg-paper border-b border-rule">
        <Container>
          <SectionHeading
            title="From the Blog"
            subtitle="Written by members, for members — and anyone else who finds it useful."
          />
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-rule rounded-md bg-paper-raised">
              <p className="font-mono text-sm text-ink-muted">
                No posts yet — the first one is always the hardest.
              </p>
            </div>
          )}
          <div className="mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-indigo hover:text-[--color-indigo-hover] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
            >
              Read the blog
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
      <section className="py-16 md:py-24 bg-indigo">
        <Container>
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-paper tracking-tight mb-4">
              Ready to build with us?
            </h2>
            <p className="text-base font-body text-paper/80 leading-relaxed mb-8">
              Join a community that ships things. We'd love to have you.
            </p>
            <Button
              as={Link}
              to="/contact"
              className="bg-paper-raised text-ink hover:bg-paper"
            >
              Get in Touch
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
