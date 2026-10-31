import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Centralized fallback URL matching src/config/site.ts
const DEFAULT_SITE_URL = 'https://dkp-innovation-preview.vercel.app';

const rawSiteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
const baseUrl = rawSiteUrl.trim().replace(/\/+$/, '');
const allowIndexing = process.env.VITE_ALLOW_INDEXING !== 'false';

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/gallery', changefreq: 'monthly', priority: '0.7' },
  { path: '/foundation', changefreq: 'monthly', priority: '0.7' },
  { path: '/careers', changefreq: 'weekly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
];

const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate sitemap.xml without fabricated lastmod dates
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path === '/' ? '/' : route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml.trim() + '\n', 'utf8');
console.log(`✓ sitemap.xml successfully generated for ${baseUrl} (7 canonical routes)`);

// 2. Generate robots.txt referencing the sitemap
const robotsTxt = allowIndexing
  ? `# Robots.txt for DKP Innovations
# Verification and Crawler Directives

User-agent: *
Allow: /

# Sitemap Reference
Sitemap: ${baseUrl}/sitemap.xml
`
  : `# Robots.txt for DKP Innovations (Indexing Disabled via VITE_ALLOW_INDEXING=false)
User-agent: *
Disallow: /
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt.trim() + '\n', 'utf8');
console.log(`✓ robots.txt successfully generated (Allow: /, Sitemap: ${baseUrl}/sitemap.xml)`);
