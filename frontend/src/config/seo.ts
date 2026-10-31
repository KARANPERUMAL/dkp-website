import { getSiteUrl, getCanonicalUrl } from './site';

export interface RouteSeoMetadata {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'article';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export type SupportedPage =
  | 'home'
  | 'about'
  | 'services'
  | 'gallery'
  | 'foundation'
  | 'careers'
  | 'contact';

/**
 * Centralized, authoritative SEO and social metadata for all seven DKP Innovations routes.
 * Derived using verified company data and naturally relevant keywords.
 */
export const getSeoForRoute = (route: SupportedPage | string): RouteSeoMetadata => {
  const siteUrl = getSiteUrl();
  const defaultImage = `${siteUrl}/images/logo/logo.png`;
  const founderImage = `${siteUrl}/images/founder-img/founder.png`;
  const studioImage = `${siteUrl}/images/gallery/3.jpeg`;

  const normalized = route.replace(/^\//, '').toLowerCase() || 'home';

  switch (normalized) {
    case 'about':
      return {
        path: '/about',
        title: 'About DKP Innovations | Our Team & Vision',
        description:
          'Learn about DKP Innovations, founder Puttaraju KV, and our 6+ years of experience delivering brand architecture, digital strategy, and scalable growth solutions in Bengaluru.',
        canonical: getCanonicalUrl('/about'),
        ogType: 'website',
        ogTitle: 'About DKP Innovations | Our Team & Vision',
        ogDescription:
          'Learn about DKP Innovations, founder Puttaraju KV, and our 6+ years of experience delivering brand architecture, digital strategy, and scalable growth solutions in Bengaluru.',
        ogImage: founderImage,
        twitterCard: 'summary_large_image',
        twitterTitle: 'About DKP Innovations | Our Team & Vision',
        twitterDescription:
          'Learn about DKP Innovations, founder Puttaraju KV, and our 6+ years of experience delivering brand architecture, digital strategy, and scalable growth solutions in Bengaluru.',
        twitterImage: founderImage,
      };

    case 'services':
      return {
        path: '/services',
        title: 'Digital Marketing & IT Solutions | DKP Innovations',
        description:
          'Explore DKP Innovations\' 19 specialized capabilities across IT & Web Engineering, Lead Generation, Branding & PR, Commercial Ad Shoots, and Corporate Compliance in Bengaluru.',
        canonical: getCanonicalUrl('/services'),
        ogType: 'website',
        ogTitle: 'Digital Marketing & IT Solutions | DKP Innovations',
        ogDescription:
          'Explore DKP Innovations\' 19 specialized capabilities across IT & Web Engineering, Lead Generation, Branding & PR, Commercial Ad Shoots, and Corporate Compliance in Bengaluru.',
        ogImage: defaultImage,
        twitterCard: 'summary_large_image',
        twitterTitle: 'Digital Marketing & IT Solutions | DKP Innovations',
        twitterDescription:
          'Explore DKP Innovations\' 19 specialized capabilities across IT & Web Engineering, Lead Generation, Branding & PR, Commercial Ad Shoots, and Corporate Compliance in Bengaluru.',
        twitterImage: defaultImage,
      };

    case 'gallery':
      return {
        path: '/gallery',
        title: 'Studio & Creative Production Gallery | DKP Innovations',
        description:
          'Tour DKP Innovations\' Bengaluru studios, creative workstations, chroma green screen production suites, and tech growth labs where creative design meets engineering.',
        canonical: getCanonicalUrl('/gallery'),
        ogType: 'website',
        ogTitle: 'Studio & Creative Production Gallery | DKP Innovations',
        ogDescription:
          'Tour DKP Innovations\' Bengaluru studios, creative workstations, chroma green screen production suites, and tech growth labs where creative design meets engineering.',
        ogImage: studioImage,
        twitterCard: 'summary_large_image',
        twitterTitle: 'Studio & Creative Production Gallery | DKP Innovations',
        twitterDescription:
          'Tour DKP Innovations\' Bengaluru studios, creative workstations, chroma green screen production suites, and tech growth labs where creative design meets engineering.',
        twitterImage: studioImage,
      };

    case 'foundation':
      return {
        path: '/foundation',
        title: 'DKP Foundation | Community Welfare Initiatives | DKP Innovations',
        description:
          'DKP Foundation is a community welfare initiative by DKP Innovations, supporting grassroots family relief, educational enablement, and social responsibility across Karnataka, India.',
        canonical: getCanonicalUrl('/foundation'),
        ogType: 'website',
        ogTitle: 'DKP Foundation | Community Welfare Initiatives | DKP Innovations',
        ogDescription:
          'DKP Foundation is a community welfare initiative by DKP Innovations, supporting grassroots family relief, educational enablement, and social responsibility across Karnataka, India.',
        ogImage: defaultImage,
        twitterCard: 'summary_large_image',
        twitterTitle: 'DKP Foundation | Community Welfare Initiatives | DKP Innovations',
        twitterDescription:
          'DKP Foundation is a community welfare initiative by DKP Innovations, supporting grassroots family relief, educational enablement, and social responsibility across Karnataka, India.',
        twitterImage: defaultImage,
      };

    case 'careers':
      return {
        path: '/careers',
        title: 'Careers at DKP Innovations | Join Our Team',
        description:
          'Build your career at DKP Innovations in Bengaluru. Explore career opportunities, skill growth, and open positions across software engineering, digital media, and creative strategy.',
        canonical: getCanonicalUrl('/careers'),
        ogType: 'website',
        ogTitle: 'Careers at DKP Innovations | Join Our Team',
        ogDescription:
          'Build your career at DKP Innovations in Bengaluru. Explore career opportunities, skill growth, and open positions across software engineering, digital media, and creative strategy.',
        ogImage: defaultImage,
        twitterCard: 'summary_large_image',
        twitterTitle: 'Careers at DKP Innovations | Join Our Team',
        twitterDescription:
          'Build your career at DKP Innovations in Bengaluru. Explore career opportunities, skill growth, and open positions across software engineering, digital media, and creative strategy.',
        twitterImage: defaultImage,
      };

    case 'contact':
      return {
        path: '/contact',
        title: 'Contact DKP Innovations | Bengaluru Offices',
        description:
          'Contact DKP Innovations for project consultations and digital strategy. Visit our 3 Bengaluru locations at World Trade Center Rajajinagar, Basaveshwar Nagar, and Kengeri.',
        canonical: getCanonicalUrl('/contact'),
        ogType: 'website',
        ogTitle: 'Contact DKP Innovations | Bengaluru Offices',
        ogDescription:
          'Contact DKP Innovations for project consultations and digital strategy. Visit our 3 Bengaluru locations at World Trade Center Rajajinagar, Basaveshwar Nagar, and Kengeri.',
        ogImage: defaultImage,
        twitterCard: 'summary_large_image',
        twitterTitle: 'Contact DKP Innovations | Bengaluru Offices',
        twitterDescription:
          'Contact DKP Innovations for project consultations and digital strategy. Visit our 3 Bengaluru locations at World Trade Center Rajajinagar, Basaveshwar Nagar, and Kengeri.',
        twitterImage: defaultImage,
      };

    case 'home':
    default:
      return {
        path: '/',
        title: 'Digital Strategy, Branding & Creative Production | DKP Innovations',
        description:
          'DKP Innovations is a premier digital strategy, creative production, and brand architecture company in Bengaluru, delivering high-impact web development, ad shoots, and data-backed digital marketing.',
        canonical: getCanonicalUrl('/'),
        ogType: 'website',
        ogTitle: 'Digital Strategy, Branding & Creative Production | DKP Innovations',
        ogDescription:
          'DKP Innovations is a premier digital strategy, creative production, and brand architecture company in Bengaluru, delivering high-impact web development, ad shoots, and data-backed digital marketing.',
        ogImage: defaultImage,
        twitterCard: 'summary_large_image',
        twitterTitle: 'Digital Strategy, Branding & Creative Production | DKP Innovations',
        twitterDescription:
          'DKP Innovations is a premier digital strategy, creative production, and brand architecture company in Bengaluru, delivering high-impact web development, ad shoots, and data-backed digital marketing.',
        twitterImage: defaultImage,
      };
  }
};
