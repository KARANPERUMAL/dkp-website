import { useEffect } from 'react';
import { getSeoForRoute, type SupportedPage } from '../config/seo';
import { getStructuredDataForRoute } from '../config/structuredData';

/**
 * Helper to update or insert a <meta> tag by name or property attribute.
 * Prevents tag duplication by querying existing elements before inserting.
 */
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or insert a <link> tag by rel attribute.
 */
function setLinkTag(rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Helper to update or insert the route-specific JSON-LD Schema script.
 */
function setJsonLdScript(data: object): void {
  if (typeof document === 'undefined') return;
  let script = document.querySelector<HTMLScriptElement>('script#dkp-schema-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'dkp-schema-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

/**
 * React 19 compatible hook for dynamic route metadata and Schema.org synchronization.
 * Updates document.title, meta description, canonical URL, Open Graph, Twitter, and JSON-LD structured data.
 */
export function usePageSeo(route: SupportedPage | string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const seo = getSeoForRoute(route);

    // 1. Synchronize Document Title
    document.title = seo.title;

    // 2. Primary Meta Description
    setMetaTag('name', 'description', seo.description);

    // 3. Self-Referential Canonical Link
    setLinkTag('canonical', seo.canonical);

    // 4. Open Graph Social Metadata
    setMetaTag('property', 'og:title', seo.ogTitle);
    setMetaTag('property', 'og:description', seo.ogDescription);
    setMetaTag('property', 'og:url', seo.canonical);
    setMetaTag('property', 'og:image', seo.ogImage);
    setMetaTag('property', 'og:type', seo.ogType);
    setMetaTag('property', 'og:site_name', 'DKP Innovations');

    // 5. Twitter Card Metadata
    setMetaTag('name', 'twitter:card', seo.twitterCard);
    setMetaTag('name', 'twitter:title', seo.twitterTitle);
    setMetaTag('name', 'twitter:description', seo.twitterDescription);
    setMetaTag('name', 'twitter:image', seo.twitterImage);

    // 6. Schema.org JSON-LD Structured Data Graph
    const schemaGraph = getStructuredDataForRoute(route);
    setJsonLdScript(schemaGraph);
  }, [route]);
}
