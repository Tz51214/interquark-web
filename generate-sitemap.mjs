import fs from "fs";

const DOMAIN = "https://www.interquark.co.uk";

// Static pages — priority and change frequency chosen by page importance.
const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/showcase", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/subscribe", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/help", changefreq: "monthly", priority: "0.6" },
  { path: "/careers", changefreq: "monthly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/saas-development", changefreq: "monthly", priority: "0.8" },
  { path: "/custom-software-development", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-development", changefreq: "monthly", priority: "0.8" },
  { path: "/web-application-development", changefreq: "monthly", priority: "0.8" },
  { path: "/mvp-development", changefreq: "monthly", priority: "0.8" },
];

// Extract every service id + whether it's flagship, directly from the
// real catalog data — so the sitemap can never drift out of sync with
// what services actually exist.
const catalogSrc = fs.readFileSync("src/data/catalog.ts", "utf-8");
const itemBlocks = catalogSrc.split(/\{\s*\n\s*id:/).slice(1);

const services = itemBlocks.map((block) => {
  const idMatch = block.match(/^\s*"([^"]+)"/);
  const isFlagship = /badge:\s*"flagship"/.test(block.split(/\n\s*\},?\s*\n\s*\{/)[0] || block);
  return { id: idMatch ? idMatch[1] : null, flagship: isFlagship };
}).filter((s) => s.id);

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const page of staticPages) {
  xml += `  <url>\n    <loc>${DOMAIN}${page.path}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
}

for (const service of services) {
  const priority = service.flagship ? "0.9" : "0.7";
  xml += `  <url>\n    <loc>${DOMAIN}/services/${service.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync("public/sitemap.xml", xml);
console.log(`Sitemap generated: ${staticPages.length} static pages + ${services.length} services`);
