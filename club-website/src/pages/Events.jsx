import { useState, useRef, useCallback } from "react";
import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import EventCard from "../components/shared/EventCard";

const TABS = ["all", "upcoming", "past"];

export default function Events() {
  const { events } = useData();
  const [activeTab, setActiveTab] = useState("all");
  const tabRefs = useRef([]);

  // Arrow key navigation for tab list (WAI-ARIA tablist pattern)
  const handleKeyDown = useCallback(
    (e, index) => {
      let nextIndex = null;
      if (e.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
      if (e.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
      if (e.key === "Home") nextIndex = 0;
      if (e.key === "End") nextIndex = TABS.length - 1;

      if (nextIndex !== null) {
        e.preventDefault();
        setActiveTab(TABS[nextIndex]);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    []
  );

  const filtered = events
    .filter((e) => activeTab === "all" || e.status === activeTab)
    .sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return activeTab === "upcoming" ? da - db : db - da;
    });

  const emptyMessages = {
    all: "No events yet. Check back soon!",
    upcoming: "No upcoming events right now — check back soon!",
    past: "No past events yet. Stay tuned.",
  };

  return (
    <section className="py-16 md:py-24">
      <Container>
        {/* Header */}
        <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-4">
          Events
        </p>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-ink tracking-tight leading-[1.08] mb-8">
          What's happening
        </h1>

        {/* Tab toggle with keyboard arrow navigation */}
        <div
          role="tablist"
          aria-label="Filter events by status"
          className="flex gap-1 p-1 bg-paper-raised border border-rule rounded-md w-fit mb-10"
        >
          {TABS.map((tab, i) => (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`px-4 py-1.5 rounded font-body text-sm font-medium transition-all duration-150 capitalize focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 ${
                activeTab === tab
                  ? "bg-indigo text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-rule rounded-md bg-paper-raised">
              <p className="font-mono text-sm text-ink-muted">
                {emptyMessages[activeTab]}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
