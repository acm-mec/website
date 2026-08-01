import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import TeamMemberCard from "../components/shared/TeamMemberCard";

export default function Team() {
  const { team } = useData();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
          Team
        </p>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-4">
          The people behind it
        </h1>
        <p className="text-base font-body text-ink-muted leading-relaxed mb-12 max-w-xl">
          A small core team runs the club. Every member here also mentors and
          builds alongside you — there's no hierarchy beyond shared
          responsibility.
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
