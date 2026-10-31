import { getSiteUrl } from './site';
import { branchLocations } from '../data/branchesData';
import { serviceCategories } from '../data/servicesData';
import { OFFICIAL_SOCIAL_LINKS } from '../data/socialLinks';

/**
 * Centralized Schema.org JSON-LD structured data utilities for DKP Innovations.
 * All schemas strictly use verified business data without fabricated reviews, ratings, or claims.
 */

export interface SchemaGraph {
  '@context': string;
  '@graph': object[];
}

/**
 * Builds the canonical Organization entity schema.
 */
export const getOrganizationSchema = (siteUrl: string = getSiteUrl()) => ({
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'DKP Innovations',
  alternateName: ['DKP Innovation'],
  url: `${siteUrl}/`,
  logo: `${siteUrl}/images/logo/logo.webp`,
  image: `${siteUrl}/images/logo/logo.webp`,
  description:
    'DKP Innovations is a premier digital strategy, creative production, IT solutions, and brand architecture company based in Bengaluru, Karnataka, India.',
  telephone: '+91 63637 25910',
  email: 'dkpinnovations20251@gmail.com',
  sameAs: [
    OFFICIAL_SOCIAL_LINKS.instagram.url,
    OFFICIAL_SOCIAL_LINKS.facebook.url,
    'https://www.justdial.com/Bangalore/DKP-Innovations-Bhima-Jyothi-Lic-Colony-Basaveshwar-Nagar-Basaveshwara-Nagar/080PXX80-XX80-250225114407-V2V9_BZDET',
    'https://maps.app.goo.gl/t6bt9Nm2izZSm2rM7?g_st=aw',
  ],
  founder: {
    '@type': 'Person',
    '@id': `${siteUrl}/#founder`,
    name: 'Puttaraju KV',
    jobTitle: 'Founder & CEO',
    worksFor: {
      '@id': `${siteUrl}/#organization`,
    },
    image: `${siteUrl}/images/founder-img/founder.webp`,
    description:
      'Founder & CEO of DKP Innovations, business coach, and digital solutions expert passionate about empowering businesses through Google services and strategic digital solutions.',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91 63637 25910',
      contactType: 'customer service',
      email: 'dkpinnovations20251@gmail.com',
      areaServed: 'IN',
      availableLanguage: ['en', 'kn', 'hi'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress:
      'Unit No 2201A, 22nd Floor, World Trade Center, Brigade Gateway, Rajajinagar',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560055',
    addressCountry: 'IN',
  },
});

/**
 * Builds the canonical WebSite entity schema.
 */
export const getWebSiteSchema = (siteUrl: string = getSiteUrl()) => ({
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: 'DKP Innovations',
  description:
    'Digital Strategy, Brand Architecture, IT Solutions & Creative Production in Bengaluru, India.',
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
  inLanguage: 'en-US',
});

/**
 * Builds LocalBusiness schemas for verified physical branch locations.
 */
export const getLocalBusinessSchemas = (siteUrl: string = getSiteUrl()) => {
  return branchLocations.map((branch) => {
    // Determine address fields without fabricating missing postal codes
    const isWtc = branch.id === 'branch-1-wtc';
    const isKengeri = branch.id === 'branch-3-kengeri';

    const address: Record<string, string> = {
      '@type': 'PostalAddress',
      streetAddress: branch.address.split(', Bengaluru')[0] || branch.address,
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    };

    if (isWtc) {
      address.postalCode = '560055';
    } else if (isKengeri) {
      address.postalCode = '560056';
    }

    return {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': `${siteUrl}/#${branch.id}`,
      name: `DKP Innovations — ${branch.name}`,
      url: `${siteUrl}/contact#${branch.id}`,
      image: `${siteUrl}/images/logo/logo.webp`,
      telephone: branch.phone,
      email: branch.email,
      priceRange: '$$',
      address,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: branch.lat,
        longitude: branch.lon,
      },
      hasMap: branch.directionsUrl,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '09:30',
          closes: '18:30',
        },
      ],
      parentOrganization: {
        '@id': `${siteUrl}/#organization`,
      },
    };
  });
};

/**
 * Builds standard BreadcrumbList schema for subpages.
 */
export const getBreadcrumbSchema = (
  siteUrl: string,
  crumbs: { name: string; path: string }[]
) => ({
  '@type': 'BreadcrumbList',
  '@id': `${siteUrl}${crumbs[crumbs.length - 1]?.path || ''}/#breadcrumb`,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/`,
    },
    ...crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  ],
});

/**
 * Builds Service and OfferCatalog schema for the /services route.
 */
export const getServicesCatalogSchema = (siteUrl: string = getSiteUrl()) => ({
  '@type': 'OfferCatalog',
  '@id': `${siteUrl}/services/#offer-catalog`,
  name: 'DKP Innovations Specialized Capabilities & Services',
  url: `${siteUrl}/services`,
  numberOfItems: 19,
  itemListElement: serviceCategories.map((category) => ({
    '@type': 'OfferCatalog',
    name: category.title,
    description: category.description,
    itemListElement: category.services.map((service) => ({
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@id': `${siteUrl}/#organization`,
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      category: category.title,
    })),
  })),
});

/**
 * Builds VideoObject schemas for authentic documentary videos on /foundation.
 */
export const getFoundationVideoSchemas = (siteUrl: string = getSiteUrl()) => [
  {
    '@type': 'VideoObject',
    '@id': `${siteUrl}/foundation/#video-relief-drive`,
    name: 'On-Ground Essential Support & Relief',
    description:
      'Footage from our grassroots distribution effort, delivering direct provisions and critical everyday supplies to families facing economic vulnerability.',
    thumbnailUrl: `${siteUrl}/images/foundation/video11-poster.webp`,
    contentUrl: `${siteUrl}/videos/video11.mp4`,
    uploadDate: '2026-10-29T12:41:00+05:30',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
  },
  {
    '@type': 'VideoObject',
    '@id': `${siteUrl}/foundation/#video-social-engagement`,
    name: 'Social Empowerment & Youth Interaction',
    description:
      'Moments reflecting community togetherness, engaging local families and young participants in supportive welfare and encouragement initiatives.',
    thumbnailUrl: `${siteUrl}/images/foundation/video22-poster.webp`,
    contentUrl: `${siteUrl}/videos/video22.mp4`,
    uploadDate: '2026-10-29T12:41:00+05:30',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
  },
];

/**
 * Resolves the complete JSON-LD Schema graph for any requested route.
 */
export const getStructuredDataForRoute = (
  route: string,
  siteUrl: string = getSiteUrl()
): SchemaGraph => {
  const normalized = route.replace(/^\//, '').toLowerCase() || 'home';
  const orgSchema = getOrganizationSchema(siteUrl);
  const websiteSchema = getWebSiteSchema(siteUrl);
  const branchSchemas = getLocalBusinessSchemas(siteUrl);

  switch (normalized) {
    case 'about':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          orgSchema,
          websiteSchema,
          {
            '@type': 'AboutPage',
            '@id': `${siteUrl}/about/#webpage`,
            url: `${siteUrl}/about`,
            name: 'About DKP Innovations | Our Team & Vision',
            description:
              'Learn about DKP Innovations, founder Puttaraju KV, and our 6+ years of experience delivering brand architecture and digital strategy in Bengaluru.',
            isPartOf: {
              '@id': `${siteUrl}/#website`,
            },
            mainEntity: {
              '@id': `${siteUrl}/#organization`,
            },
          },
          getBreadcrumbSchema(siteUrl, [{ name: 'Who We Are', path: '/about' }]),
        ],
      };

    case 'services':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          orgSchema,
          websiteSchema,
          getServicesCatalogSchema(siteUrl),
          getBreadcrumbSchema(siteUrl, [{ name: 'What We Do', path: '/services' }]),
        ],
      };

    case 'gallery':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          orgSchema,
          websiteSchema,
          {
            '@type': 'CollectionPage',
            '@id': `${siteUrl}/gallery/#webpage`,
            url: `${siteUrl}/gallery`,
            name: 'Studio & Creative Production Gallery | DKP Innovations',
            description:
              'Tour DKP Innovations\' Bengaluru studios, creative workstations, chroma green screen production suites, and tech growth labs.',
            isPartOf: {
              '@id': `${siteUrl}/#website`,
            },
          },
          getBreadcrumbSchema(siteUrl, [{ name: 'Gallery', path: '/gallery' }]),
        ],
      };

    case 'foundation':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          orgSchema,
          websiteSchema,
          ...getFoundationVideoSchemas(siteUrl),
          {
            '@type': 'WebPage',
            '@id': `${siteUrl}/foundation/#webpage`,
            url: `${siteUrl}/foundation`,
            name: 'DKP Foundation | Community Welfare Initiatives | DKP Innovations',
            description:
              'DKP Foundation is a community welfare initiative by DKP Innovations, supporting grassroots family relief, educational enablement, and social responsibility across Karnataka, India.',
            isPartOf: {
              '@id': `${siteUrl}/#website`,
            },
            about: {
              '@id': `${siteUrl}/#organization`,
            },
          },
          getBreadcrumbSchema(siteUrl, [
            { name: 'DKP Foundation', path: '/foundation' },
          ]),
        ],
      };

    case 'careers':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          orgSchema,
          websiteSchema,
          {
            '@type': 'WebPage',
            '@id': `${siteUrl}/careers/#webpage`,
            url: `${siteUrl}/careers`,
            name: 'Careers at DKP Innovations | Join Our Team',
            description:
              'Explore career opportunities, skill growth, and active positions across software engineering, digital media, and creative strategy at DKP Innovations.',
            isPartOf: {
              '@id': `${siteUrl}/#website`,
            },
          },
          getBreadcrumbSchema(siteUrl, [{ name: 'Careers', path: '/careers' }]),
        ],
      };

    case 'contact':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          orgSchema,
          websiteSchema,
          ...branchSchemas,
          {
            '@type': 'ContactPage',
            '@id': `${siteUrl}/contact/#webpage`,
            url: `${siteUrl}/contact`,
            name: 'Contact DKP Innovations | Bengaluru Offices',
            description:
              'Contact DKP Innovations for project consultations and digital strategy. Visit our 3 Bengaluru locations at World Trade Center Rajajinagar, Basaveshwar Nagar, and Kengeri.',
            isPartOf: {
              '@id': `${siteUrl}/#website`,
            },
            mainEntity: {
              '@id': `${siteUrl}/#branch-1-wtc`,
            },
          },
          getBreadcrumbSchema(siteUrl, [
            { name: 'Contact Us', path: '/contact' },
          ]),
        ],
      };

    case 'not-found':
    case '404':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          orgSchema,
          websiteSchema,
          getBreadcrumbSchema(siteUrl, [{ name: 'Page Not Found', path: '/404' }]),
        ],
      };

    case 'home':
    default:
      return {
        '@context': 'https://schema.org',
        '@graph': [orgSchema, websiteSchema, ...branchSchemas],
      };
  }
};
