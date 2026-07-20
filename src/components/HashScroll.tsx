import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router's <Link> doesn't scroll to a hash target on its own —
// this listens for hash changes and scrolls to the matching element,
// waiting briefly for the target page to finish rendering first.
export default function HashScroll() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");

    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    return () => clearTimeout(timeout);
  }, [hash, pathname]);

  return null;
}
