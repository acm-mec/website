import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import TeamMemberCard from "../components/shared/TeamMemberCard";

export default function Team() {
  const { siteConfig, team } = useData();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
          {siteConfig.teamPage?.header?.badge || "Team"}
        </p>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-4">
          {siteConfig.teamPage?.header?.heading || "The people behind it"}
        </h1>
        <p className="text-base font-body text-ink-muted leading-relaxed mb-12 max-w-xl">
          {siteConfig.teamPage?.header?.description ||
            "Our core team stays lean by design. Everyone mentors, everyone builds, learning from each other as much as leading."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </Container>
    </section>
  );
}

