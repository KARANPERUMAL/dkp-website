import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const routes = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'gallery', path: '/gallery' },
  { key: 'foundation', path: '/foundation' },
  { key: 'careers', path: '/careers' },
  { key: 'contact', path: '/contact' },
  { key: 'not-found', path: '/404' },
];

/**
 * Replaces or injects a meta/link tag attribute cleanly without duplicating.
 */
function replaceTag(html, regex, replacement) {
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }
  return html.replace('</head>', `  ${replacement}\n</head>`);
}

async function prerender() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  console.log('\nStarting Static Prerendering for DKP Innovations...');
  console.log('Loading configuration modules via Vite ssrLoadModule...');

  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { getSeoForRoute } = await vite.ssrLoadModule('/src/config/seo.ts');
  const { getStructuredDataForRoute } = await vite.ssrLoadModule('/src/config/structuredData.ts');

  await vite.close();

  for (const { key, path: routePath } of routes) {
    const is404 = key === 'not-found';
    const seo = getSeoForRoute(key);
    const schema = getStructuredDataForRoute(key);

    let html = templateHtml;

    // 1. Document Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>`);

    // 2. Primary Meta Description
    html = replaceTag(
      html,
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${seo.description}" />`
    );

    // 3. Self-Referential Canonical Link
    html = replaceTag(
      html,
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${seo.canonical}" />`
    );

    // 4. Open Graph Social Metadata
    html = replaceTag(
      html,
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${seo.ogTitle}" />`
    );
    html = replaceTag(
      html,
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${seo.ogDescription}" />`
    );
    html = replaceTag(
      html,
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${seo.canonical}" />`
    );
    html = replaceTag(
      html,
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${seo.ogImage}" />`
    );
    html = replaceTag(
      html,
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="${seo.ogType}" />`
    );

    // 5. Twitter Card Metadata
    html = replaceTag(
      html,
      /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:card" content="${seo.twitterCard}" />`
    );
    html = replaceTag(
      html,
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${seo.twitterTitle}" />`
    );
    html = replaceTag(
      html,
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${seo.twitterDescription}" />`
    );
    html = replaceTag(
      html,
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${seo.twitterImage}" />`
    );

    // 5.1 Route-specific LCP Image Preload
    let lcpPreloadTag = '';
    if (key === 'gallery') {
      lcpPreloadTag = '  <link rel="preload" as="image" href="/images/gallery/3.webp" type="image/webp" fetchpriority="high" />\n';
    } else if (key === 'about') {
      lcpPreloadTag = '  <link rel="preload" as="image" href="/images/founder-img/founder.webp" type="image/webp" fetchpriority="high" />\n';
    } else if (key === 'foundation') {
      lcpPreloadTag = '  <link rel="preload" as="image" href="/images/foundation/video11-poster.webp" type="image/webp" fetchpriority="high" />\n';
    }
    if (lcpPreloadTag) {
      html = html.replace('</head>', `${lcpPreloadTag}</head>`);
    }

    // 6. Robots Directive
    if (is404) {
      html = replaceTag(
        html,
        /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="robots" content="noindex, follow" />`
      );
    } else {
      html = replaceTag(
        html,
        /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="robots" content="index, follow" />`
      );
    }

    // 7. Schema.org JSON-LD Structured Data Graph
    const jsonLdString = JSON.stringify(schema, null, 2);
    html = html.replace(
      /<script\s+id="dkp-schema-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script id="dkp-schema-jsonld" type="application/ld+json">\n${jsonLdString}\n    </script>`
    );

    // 8. 404 Fallback HTML for non-JS clients
    if (is404) {
      const fallback404 = `<div id="root"><div style="min-height:100vh;background-color:#004D86;color:#ffffff;display:flex;align-items:center;justify-content:center;text-align:center;font-family:system-ui,-apple-system,sans-serif;padding:2rem;"><div style="max-width:540px;"><p style="color:#FFD60A;font-weight:700;font-size:1.125rem;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:0.5rem;">Error 404</p><h1 style="font-size:3rem;font-weight:900;margin:0 0 1rem;line-height:1.1;">Page Not Found</h1><p style="color:#CBD5E1;font-size:1.125rem;line-height:1.6;margin-bottom:2rem;">The page you are looking for doesn't exist or has been moved. Explore our core services or return to the homepage.</p><a href="/" style="display:inline-block;background-color:#FFD60A;color:#002244;font-weight:700;padding:0.875rem 1.75rem;border-radius:0.75rem;text-decoration:none;">Return to Home</a></div></div></div>`;
      html = html.replace(/<div id="root"><\/div>/i, fallback404);
    }

    // 9. Write Output Files
    if (routePath === '/') {
      fs.writeFileSync(indexHtmlPath, html, 'utf8');
      console.log(`✓ Prerendered [${key}] -> dist/index.html (Canonical: ${seo.canonical})`);
    } else if (is404) {
      const dest404 = path.join(distDir, '404.html');
      fs.writeFileSync(dest404, html, 'utf8');
      console.log(`✓ Prerendered [${key}] -> dist/404.html (noindex, follow)`);
    } else {
      const routeDir = path.join(distDir, routePath.replace(/^\//, ''));
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      const dirIndexFile = path.join(routeDir, 'index.html');
      const flatFile = path.join(distDir, `${routePath.replace(/^\//, '')}.html`);

      fs.writeFileSync(dirIndexFile, html, 'utf8');
      fs.writeFileSync(flatFile, html, 'utf8');

      console.log(`✓ Prerendered [${key}] -> dist/${routePath.replace(/^\//, '')}/index.html & .html (Canonical: ${seo.canonical})`);
    }
  }

  console.log('✓ All 7 canonical routes + 404 successfully prerendered into dist/\n');
}

prerender().catch((err) => {
  console.error('Prerendering failed:', err);
  process.exit(1);
});
