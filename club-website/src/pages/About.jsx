import { Code2, Zap, GitBranch, Users, CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";

const activities = [
  {
    icon: Code2,
    title: "Workshops",
    description:
      "Hands-on sessions on everything from Git basics to deploying ML models. Led by members, for members — no jargon, just working code.",
  },
  {
    icon: Zap,
    title: "Hackathons",
    description:
      "Semester-flagship 24-hour build events open to all majors. Teams, mentors, food, and real prizes. The best project demos we've seen started as bad ideas at 2 AM.",
  },
  {
    icon: GitBranch,
    title: "Open-Source Projects",
    description:
      "Club-maintained repositories where members build real tools together. Contribution is open to all — a great way to get comfortable with collaboration workflows.",
  },
  {
    icon: Users,
    title: "Peer Mentorship",
    description:
      "Senior members pair with juniors for study sessions, code reviews, and project feedback. If you're stuck, there's always someone who's been stuck in the same place.",
  },
];

const benefits = [
  "Build a portfolio of real shipped projects — not just coursework.",
  "Get a ready-made hackathon team and mentorship before the event starts.",
  "Develop collaboration skills through actual open-source workflows.",
  "Access a network of alumni in software, research, and startups.",
];

export default function About() {
  const { siteConfig } = useData();

  return (
    <>
      {/* ── Page header ── */}
      <section className="py-16 md:py-24 border-b border-rule bg-paper">
        <Container>
          <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
            About
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-6 max-w-2xl">
            Who we are
          </h1>
          <div className="max-w-2xl space-y-4">
            <p className="text-base font-body text-ink-muted leading-relaxed">
              {siteConfig.clubName} is the technical computing club at our college, affiliated with the Association for Computing Machinery — the world's largest educational computing society. We've been running since {siteConfig.foundingYear}, growing from a small group of students who wanted to build things together into a community that spans every department.
            </p>
            <p className="text-base font-body text-ink-muted leading-relaxed">
              Our focus is deliberate: we don't try to cover everything. Instead, we go deep on software development — version control, web technologies, systems thinking, machine learning applications, and the craft of building software that actually works. Every workshop, event, and project is designed to bridge the gap between what you learn in a lecture hall and what you need to build something real.
            </p>
            <p className="text-base font-body text-ink-muted leading-relaxed">
              Membership is open to any student at the college. We've had members from CSE, IT, ECE, Mechanical, and even Civil. The only prerequisite is curiosity.
            </p>
          </div>
        </Container>
      </section>

      {/* ── What we do ── */}
      <section className="py-16 md:py-24 bg-paper-raised border-b border-rule">
        <Container>
          <SectionHeading
            title="What we do"
            subtitle="Four pillars that form the backbone of everything we run."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-paper border border-rule rounded-md p-6 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo transition-all duration-150"
              >
                <div className="w-10 h-10 rounded bg-indigo/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-semibold text-ink mb-2">
                  {title}
                </h3>
                <p className="text-base font-body text-ink-muted leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why join ── */}
      <section className="py-16 md:py-24 bg-paper border-b border-rule">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading
                title="Why join?"
                subtitle="The practical case for spending time here."
              />
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-signal flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-base font-body text-ink-muted leading-relaxed">
                      {benefit}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Founding blurb */}
            <div className="bg-paper-raised border border-rule rounded-md p-6">
              <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-3">
                Established {siteConfig.foundingYear}
              </p>
              <p className="text-base font-body text-ink-muted leading-relaxed">
                The club was founded in {siteConfig.foundingYear} by a group of students who felt that the gap between classroom theory and practical software development was too wide and too consequential to ignore. The founding principle — that the best way to learn to build software is to build software — still drives everything we do today.
              </p>
              <div className="mt-4 pt-4 border-t border-rule">
                <p className="font-mono text-xs text-ink-muted">
                  {new Date().getFullYear() - siteConfig.foundingYear} years and counting.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
