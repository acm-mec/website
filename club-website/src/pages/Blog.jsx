import { useState, useMemo } from "react";
import { posts } from "../data/posts";
import Container from "../components/ui/Container";
import BlogPostCard from "../components/shared/BlogPostCard";

const publishedPosts = posts
  .filter((p) => p.status === "published")
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Collect all unique tags across published posts
const allTags = ["All", ...new Set(publishedPosts.flatMap((p) => p.tags))];

export default function Blog() {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(
    () =>
      activeTag === "All"
        ? publishedPosts
        : publishedPosts.filter((p) => p.tags.includes(activeTag)),
    [activeTag]
  );

  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
          Blog / Resources
        </p>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-4">
          Written by members
        </h1>
        <p className="text-base font-body text-ink-muted leading-relaxed mb-10 max-w-xl">
          Guides, recaps, and practical write-ups from people in the club.
          Useful for members and anyone else who finds them via search.
        </p>

        {/* Tag filter chips */}
        {allTags.length > 1 && (
          <div
            role="group"
            aria-label="Filter posts by tag"
            className="flex flex-wrap gap-2 mb-10"
          >
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                aria-pressed={activeTag === tag}
                className={`px-3 py-1 rounded font-mono text-xs uppercase tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 border ${
                  activeTag === tag
                    ? "bg-indigo text-white border-indigo"
                    : "bg-paper-raised text-ink-muted border-rule hover:border-indigo hover:text-indigo"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-rule rounded-md bg-paper-raised">
            <p className="font-mono text-sm text-ink-muted">
              No posts tagged "{activeTag}" yet.
            </p>
            <button
              onClick={() => setActiveTag("All")}
              className="mt-3 font-mono text-xs text-indigo hover:underline focus:outline-none focus:ring-2 focus:ring-indigo rounded"
            >
              Clear filter
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
