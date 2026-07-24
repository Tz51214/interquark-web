// Prerenders public marketing pages to static HTML after `vite build`.
// Portal/dashboard/checkout routes are intentionally excluded — they're
// behind auth and don't benefit from SEO or prerendering.

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import handler from 'serve-handler';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const PORT = 4173;

const ROUTES = [
  '/',
  '/about',
  '/help',
  '/careers',
  '/guide',
  '/terms',
  '/privacy',
  '/saas-development',
  '/custom-software-development',
  '/ai-development',
  '/web-application-development',
  '/mvp-development',
];

async function main() {
  // Serve the built `dist` folder locally so Puppeteer can load real pages
  const server = createServer((req, res) => handler(req, res, { public: DIST_DIR }));
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await puppeteer.launch();

  for (const route of ROUTES) {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;
    console.log(`Rendering ${route} ...`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Give react-helmet-async a beat to finish setting <title>/<meta>
    await new Promise((r) => setTimeout(r, 1500));

    const html = await page.content();

    const outPath =
      route === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, route, 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);

    console.log(`  -> wrote ${outPath}`);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Prerendering complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
