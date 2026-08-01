import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

// Since this is a single-page app, the browser never actually
// reloads on internal navigation — GA4/Ads "page load"-based
// conversions would never fire otherwise. This sends a real page_view
// event on every client-side route change so those still work
// correctly, alongside normal analytics accuracy generally.
export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}
