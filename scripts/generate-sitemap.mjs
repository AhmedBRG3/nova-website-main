// Generates dist/sitemap.xml from the CMS content files.
// Runs after `vite build` (see package.json "build").
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://novaadv.com';
const dir = new URL('../content/work/', import.meta.url);
const slugs = readdirSync(dir).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8')).slug);

const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: '/', priority: '1.0' }, ...slugs.map((s) => ({ loc: `/work/${s}`, priority: '0.7' }))];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('../dist/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
