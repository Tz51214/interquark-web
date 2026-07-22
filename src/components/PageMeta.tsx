import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description: string;
  path: string; // e.g. "/about", "/services/wp-01" — used to build canonical URL
}

// Centralizes per-page title, description, Open Graph, Twitter card,
// and canonical URL — replaces the earlier custom useDocumentHead hook
// with react-helmet-async, which handles this more robustly (correct
// cleanup on unmount, SSR-ready if that's ever needed later).
export default function PageMeta({ title, description, path }: PageMetaProps) {
  const url = `https://www.interquark.co.uk${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
