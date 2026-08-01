import { Link, useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { posts } from "../data/posts";
import Container from "../components/ui/Container";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/dates";

export default function BlogPost() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <section className="py-24">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
              404
            </p>
            <h1 className="text-3xl font-display font-semibold text-ink mb-4">
              Post not found
            </h1>
            <p className="text-base font-body text-ink-muted mb-8">
              This post doesn't exist — it may have been removed or the URL is wrong.
            </p>
            <Button as={Link} to="/blog" variant="secondary">
              ← Back to Blog
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const { title, author, date, tags, content, coverImage, alt } = post;

  const formattedDate = formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-body text-sm text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded mb-8 group"
        >
          <ArrowLeft
            size={14}
            aria-hidden="true"
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Back to Blog
        </Link>

        <article className="max-w-2xl">
          {coverImage && (
            <img
              src={coverImage}
              alt={alt || title}
              className="w-full h-60 object-cover rounded-md mb-8"
            />
          )}

          <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-3">
            {author} · {formattedDate}
          </p>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink tracking-tight leading-tight mb-6">
            {title}
          </h1>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}

          <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-ink prose-p:text-ink-muted prose-p:font-body prose-a:text-indigo prose-code:text-indigo prose-code:bg-rule prose-code:rounded prose-code:px-1 prose-code:font-mono prose-pre:bg-ink prose-pre:text-paper-raised">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </article>
      </Container>
    </section>
  );
}
