import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { useData } from "../../context/DataContext";

export default function PageTitle() {
  const { pathname } = useLocation();
  const { id } = useParams() ?? {};
  const { siteConfig, events } = useData();

  useEffect(() => {
    const club = siteConfig.clubName;
    let title = `${club} - ${siteConfig.tagline}`;

    if (pathname === "/about") {
      title = `About - ${club}`;
    } else if (pathname === "/events") {
      title = `Events - ${club}`;
    } else if (pathname.startsWith("/events/") && id) {
      const event = events.find((item) => item.id === id);
      title = event ? `${event.title} - ${club}` : `Event Not Found - ${club}`;
    } else if (pathname === "/team") {
      title = `Team - ${club}`;
    } else if (pathname === "/contact") {
      title = `Contact - ${club}`;
    } else if (pathname !== "/") {
      title = `404 - ${club}`;
    }

    document.title = title;
  }, [events, id, pathname, siteConfig.clubName, siteConfig.tagline]);

  return null;
}
