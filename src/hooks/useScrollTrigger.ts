import { useEffect, useState } from "react";

const STORAGE_KEY = "interquark_newsletter_shown";

// Fires once when the user scrolls past a given percentage of the
// page, and only once per browser (won't nag on every visit).
export function useScrollTrigger(percent = 40) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function handleScroll() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrolledPercent = (window.scrollY / scrollableHeight) * 100;
      if (scrolledPercent >= percent) {
        setTriggered(true);
        sessionStorage.setItem(STORAGE_KEY, "true");
        window.removeEventListener("scroll", handleScroll);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [percent]);

  return triggered;
}
