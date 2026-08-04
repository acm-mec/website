import { Code2, Zap, GitBranch, Users, CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";

const pillarIcons = [Code2, Zap, GitBranch, Users];

const defaultBenefits = [
  "Build a portfolio of real shipped projects — not just coursework.",
  "Get a ready-made hackathon team and mentorship before the event starts.",
  "Develop collaboration skills through actual open-source workflows.",
  "Access a network of alumni in software, research, and startups.",
];

export default function About() {
  const { siteConfig } = useData();

  const pillars = siteConfig.about?.pillars?.length
    ? siteConfig.about.pillars.map((p, idx) => ({
        ...p,
        icon: pillarIcons[idx % pillarIcons.length],
      }))
    : [
        {
          icon: Code2,
          title: "Workshops",
          description: "Hands-on sessions...",
        },
        {
          icon: Zap,
          title: "Hackathons",
          description: "Semester-flagship...",
        },
        {
          icon: GitBranch,
          title: "Open-Source Projects",
          description: "Club-maintained...",
        },
        {
          icon: Users,
          title: "Peer Mentorship",
          description: "Senior members...",
        },
      ];

  const benefits = siteConfig.about?.whyJoin?.benefits?.length
    ? siteConfig.about.whyJoin.benefits
    : defaultBenefits;

  return (
    <>
      {/* ── Page header ── */}
      <section className="py-16 md:py-24 border-b border-rule bg-transparent">
        <Container>
          <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
            {siteConfig.about?.header?.badge || "About"}
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-6 max-w-2xl">
            {siteConfig.about?.header?.heading || "Who we are"}
          </h1>
          <div className="max-w-2xl space-y-4">
            {siteConfig.about?.header?.paragraph1 && (
              <p className="text-base font-body text-ink-muted leading-relaxed">
                {siteConfig.about.header.paragraph1}
              </p>
            )}
            {siteConfig.about?.header?.paragraph2 && (
              <p className="text-base font-body text-ink-muted leading-relaxed">
                {siteConfig.about.header.paragraph2}
              </p>
            )}
            {siteConfig.about?.header?.paragraph3 && (
              <p className="text-base font-body text-ink-muted leading-relaxed">
                {siteConfig.about.header.paragraph3}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ── What we do ── */}
      <section className="py-16 md:py-24 bg-paper-raised/60 backdrop-blur-sm border-b border-rule">
        <Container>
          <SectionHeading
            title={siteConfig.about?.pillarsSection?.title || "What we do"}
            subtitle={siteConfig.about?.pillarsSection?.subtitle || "Four pillars that form the backbone of everything we run."}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-paper/70 backdrop-blur-sm border border-rule rounded-md p-6 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo transition-all duration-150"
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
      <section className="py-16 md:py-24 bg-transparent border-b border-rule">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading
                title={siteConfig.about?.whyJoin?.title || "Why join?"}
                subtitle={siteConfig.about?.whyJoin?.subtitle || "The practical case for spending time here."}
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
            <div className="bg-paper-raised/70 backdrop-blur-sm border border-rule rounded-md p-6">
              <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-3">
                {siteConfig.about?.founding?.header || `Established ${siteConfig.foundingYear}`}
              </p>
              <p className="text-base font-body text-ink-muted leading-relaxed">
                {siteConfig.about?.founding?.description || `The club was founded in ${siteConfig.foundingYear}...`}
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

