import { useEffect } from "react";

// Updates the page <title> and meta description dynamically per route.
// SPAs don't get this automatically — index.html's tags are static and
// otherwise identical on every page, which is bad for SEO and social
// sharing. Modern search engines execute JS and read these updates.
export function useDocumentHead(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [title, description]);
}
