import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Card from "../ui/Card";
import StatusMeta from "../ui/StatusMeta";
import Badge from "../ui/Badge";
import CardPlaceholder from "../ui/CardPlaceholder";
import { formatDate } from "../../utils/dates";

/**
 * BlogPostCard — cover image (optional, falls back to CardPlaceholder) +
 * commit-log meta + title + author/date + excerpt + tags + read link.
 * Uses timezone-safe formatDate utility.
 */
export default function BlogPostCard({ post }) {
  const { id, title, author, date, status, excerpt, tags, coverImage, alt } = post;

  const formattedDate = formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col h-full p-0 overflow-hidden">
      {/* Cover image or placeholder */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={alt || title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <CardPlaceholder variant="blog" className="rounded-none border-0 border-b border-rule" />
      )}

      <div className="p-6 flex flex-col flex-1">
        <StatusMeta id={id} status={status} />

        <h3 className="text-xl font-display font-semibold text-ink mb-2 leading-snug">
          {title}
        </h3>

        <p className="font-mono text-xs text-ink-muted mb-3 uppercase tracking-wide">
          {author} · {formattedDate}
        </p>

        <p className="text-base font-body text-ink-muted leading-relaxed mb-4 flex-1">
          {excerpt}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        <Link
          to={`/blog/${id}`}
          className="inline-flex items-center gap-1 font-body text-sm font-medium text-indigo hover:text-[--color-indigo-hover] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
        >
          Read more
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="group-hover:translate-x-0.5 transition-transform duration-150"
          />
        </Link>
      </div>
    </Card>
  );
}
