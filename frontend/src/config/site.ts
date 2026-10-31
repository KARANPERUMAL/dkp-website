/**
 * Centralized Site and SEO Configuration for DKP Innovations.
 *
 * All canonical URLs, sitemaps, robots directives, and structured data
 * resolve their origin through this configuration.
 *
 * When DKP Innovations purchases its custom domain, update VITE_SITE_URL
 * in the environment variables (or DEFAULT_SITE_URL below).
 */

// Temporary production base URL on Vercel until a custom domain is attached
export const DEFAULT_SITE_URL = 'https://dkp-innovation-preview.vercel.app';

/**
 * Resolves the canonical base URL of the site without a trailing slash.
 * Prioritizes import.meta.env.VITE_SITE_URL, falling back to the current Vercel preview URL.
 */
export const getSiteUrl = (): string => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_SITE_URL;
};

export const SITE_CONFIG = {
  name: 'DKP Innovations',
  legalName: 'DKP Innovations',
  defaultTitle: 'DKP Innovation — Digital Strategy, Brand Architecture & Creative Production',
  defaultDescription:
    'DKP Innovations is a full-service digital strategy, creative production, IT solutions, and brand architecture company based in Bengaluru, India.',
  siteUrl: getSiteUrl(),
  canonicalRoutes: [
    '/',
    '/about',
    '/services',
    '/gallery',
    '/foundation',
    '/careers',
    '/contact',
  ] as const,
  /**
   * Configurable indexing control.
   * Default is true (indexable). Set VITE_ALLOW_INDEXING=false to disallow crawlers on staging/previews.
   */
  allowIndexing:
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_ALLOW_INDEXING !== 'false'
      : true,
} as const;

export type CanonicalRoute = (typeof SITE_CONFIG.canonicalRoutes)[number];

/**
 * Builds a clean canonical URL for a given route.
 * @param path Relative path (e.g., '/services' or '')
 * @returns Fully qualified canonical URL (e.g., 'https://dkp-innovation-preview.vercel.app/services')
 */
export const getCanonicalUrl = (path: string = ''): string => {
  const base = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') {
    return `${base}/`;
  }
  return `${base}${cleanPath}`;
};
