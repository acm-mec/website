import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { siteConfig } from "../../data/siteConfig";
import { events } from "../../data/events";

/**
 * PageTitle — sets the document.title dynamically per route.
 * Pattern: "[Page] — [ClubName]" or "[ClubName] — [Tagline]" for home.
 */
export default function PageTitle() {
  const { pathname } = useLocation();
  const { id } = useParams() ?? {};

  useEffect(() => {
    const club = siteConfig.clubName;
    let title = `${club} — ${siteConfig.tagline}`;

    if (pathname === "/about") {
      title = `About — ${club}`;
    } else if (pathname === "/events") {
      title = `Events — ${club}`;
    } else if (pathname.startsWith("/events/") && id) {
      const event = events.find((e) => e.id === id);
      title = event ? `${event.title} — ${club}` : `Event Not Found — ${club}`;
    } else if (pathname === "/team") {
      title = `Team — ${club}`;
    } else if (pathname === "/contact") {
      title = `Contact — ${club}`;
    } else if (pathname !== "/") {
      title = `404 — ${club}`;
    }

    document.title = title;
  }, [pathname, id]);

  return null;
}
