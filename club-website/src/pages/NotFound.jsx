import { Link } from "react-router";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-32">
      <Container>
        <div className="text-center max-w-md mx-auto">
          <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
            404
          </p>
          <h1 className="text-5xl font-display font-bold text-ink tracking-tight mb-4">
            Uncaught exception
          </h1>
          <p className="text-base font-body text-ink-muted leading-relaxed mb-8">
            This route threw a 404 — the page you're looking for doesn't exist
            (or was moved without a redirect). Happens to the best of us.
          </p>
          <Button as={Link} to="/" variant="primary">
            ← Back home
          </Button>
        </div>
      </Container>
    </section>
  );
}
