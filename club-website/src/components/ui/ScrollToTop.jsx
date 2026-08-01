import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop — resets scroll position to top on every route change.
 * Place this inside <BrowserRouter> so it has access to location.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
