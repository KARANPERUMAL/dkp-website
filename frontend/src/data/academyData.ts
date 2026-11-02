import { type DepartmentOption } from './careersData';

export type ApplicationClassification = 'internship' | 'general' | 'job';

export interface InternshipDomain {
  id: string;
  name: string;
  category: 'Technical' | 'Digital Marketing';
  department: DepartmentOption;
  shortDescription: string;
  image: string;
  alt: string;
  careerPositionTitle: string;
}

export interface TargetAudience {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

/**
 * Authoritative internship domains derived directly from DKP Innovations' active service capabilities.
 * Updated domain categorization and image assignment following enterprise reclassification guidelines.
 */
export const internshipDomains: InternshipDomain[] = [
  // =========================================================================
  // Technical Category
  // Includes: Frontend, Java Backend, Java Full Stack
  // =========================================================================
  {
    id: 'frontend',
    name: 'Frontend',
    category: 'Technical',
    department: 'IT & Digital Solutions',
    shortDescription:
      'Build responsive, accessible, and high-performance user interfaces using modern web standards and component-driven architecture.',
    image: '/images/services/technology-solutions/website-design-and-development.webp',
    alt: 'Frontend development internship at DKP Academy',
    careerPositionTitle: 'Internship — Frontend',
  },
  {
    id: 'java-backend',
    name: 'Java Backend',
    category: 'Technical',
    department: 'IT & Digital Solutions',
    shortDescription:
      'Learn backend engineering concepts including REST API design, relational databases, data validation, and server-side business logic.',
    image: '/images/services/technology-solutions/title-card.webp',
    alt: 'Java backend engineering internship at DKP Academy',
    careerPositionTitle: 'Internship — Java Backend',
  },
  {
    id: 'java-full-stack',
    name: 'Java Full Stack',
    category: 'Technical',
    department: 'IT & Digital Solutions',
    shortDescription:
      'Master end-to-end web engineering combining modern responsive React user interfaces with production-grade Java Spring Boot services.',
    image: '/images/services/technology-solutions/social-media-optimization-and-strategy.webp',
    alt: 'Java full stack development internship at DKP Academy',
    careerPositionTitle: 'Internship — Java Full Stack',
  },

  // =========================================================================
  // Digital Marketing Category
  // Includes: Digital Marketing, Brand Identity & Business Growth, UI/UX, Video, SEO, Social Media
  // =========================================================================
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    category: 'Digital Marketing',
    department: 'Digital Marketing & Lead Generation',
    shortDescription:
      'Understand how businesses generate qualified customer inquiries through Google services, landing page optimization, and digital outreach.',
    // Swapped: now displays former Brand Identity image
    image: '/images/services/branding-pr-and-influencer-marketing/title-card.webp',
    alt: 'Digital marketing internship at DKP Academy',
    careerPositionTitle: 'Internship — Digital Marketing',
  },
  {
    id: 'brand-identity-business-growth',
    name: 'Brand Identity & Business Growth',
    category: 'Digital Marketing',
    department: 'Branding, PR & Influencer Marketing',
    shortDescription:
      'Design cohesive visual assets including logo systems, marketing collateral, social graphics, and corporate typography palettes.',
    // Swapped: now displays former Digital Marketing image
    image: '/images/services/digital-marketing-and-lead-generation/lead-generation-for-business.webp',
    alt: 'Brand identity and business growth internship at DKP Academy',
    careerPositionTitle: 'Internship — Brand Identity & Business Growth',
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX & Digital Product Design',
    category: 'Digital Marketing',
    department: 'Branding, PR & Influencer Marketing',
    shortDescription:
      'Transform requirements into intuitive user journeys, wireframes, interactive prototypes, and scalable digital design systems.',
    image: '/images/services/branding-pr-and-influencer-marketing/brand-identity-and-logo-design.webp',
    alt: 'UI/UX digital product design internship at DKP Academy',
    careerPositionTitle: 'Internship — UI/UX & Digital Product Design',
  },
  {
    id: 'creative-production',
    name: 'Commercial Video & Creative Production',
    category: 'Digital Marketing',
    department: 'Creative Production & Advertising',
    shortDescription:
      'Gain exposure to professional studio environments, camera workflows, lighting setups, audio capture, and video post-production.',
    image: '/images/services/creative-production-and-advertising/corporate-photography-and-videography.webp',
    alt: 'Commercial video and creative production internship at DKP Academy',
    careerPositionTitle: 'Internship — Commercial Video & Creative Production',
  },

  // =========================================================================
  // Digital Marketing Category (Remaining Domains)
  // Includes: Search Engine Optimization (SEO), Social Media & Performance Marketing
  // =========================================================================
  {
    id: 'search-engine-optimization',
    name: 'Search Engine Optimization (SEO)',
    category: 'Digital Marketing',
    department: 'Digital Marketing & Lead Generation',
    shortDescription:
      'Learn data-driven organic search strategies, technical SEO fundamentals, keyword research, on-page optimization, and SERP analytics.',
    image: '/images/services/technology-solutions/seo-expert-advanced-strategy.webp',
    alt: 'Search engine optimization internship at DKP Academy',
    careerPositionTitle: 'Internship — Search Engine Optimization (SEO)',
  },
  {
    id: 'social-media-marketing',
    name: 'Social Media & Performance Marketing',
    category: 'Digital Marketing',
    department: 'Digital Marketing & Lead Generation',
    shortDescription:
      'Explore multi-channel social media strategy, organic community building, ad campaign architecture, and audience engagement metrics.',
    image: '/images/services/digital-marketing-and-lead-generation/meta-ads-expert-strategy.webp',
    alt: 'Social media and performance marketing internship at DKP Academy',
    careerPositionTitle: 'Internship — Social Media & Performance Marketing',
  },
];

/**
 * Audience profiles for DKP Academy.
 */
export const targetAudienceList: TargetAudience[] = [
  {
    id: 'college-students',
    title: 'College & University Students',
    description:
      'Students currently enrolled in undergraduate or postgraduate degree programs looking to supplement classroom theory with real-world exposure.',
    iconName: 'GraduationCap',
  },
  {
    id: 'tech-aspirants',
    title: 'Aspiring Technologists & Engineers',
    description:
      'Students passionate about software development, modern frontend frameworks, backend architecture, and production web engineering.',
    iconName: 'Code2',
  },
  {
    id: 'creative-thinkers',
    title: 'Designers & Creative Thinkers',
    description:
      'Individuals eager to explore digital product design, visual branding, typography, commercial videography, and creative studio production.',
    iconName: 'Palette',
  },
  {
    id: 'marketing-enthusiasts',
    title: 'Digital Marketers & Growth Enthusiasts',
    description:
      'Students interested in search engine optimization, performance marketing, social media campaigns, and data-backed digital brand growth.',
    iconName: 'TrendingUp',
  },
];

/**
 * Robust domain lookup helpers supporting both new and legacy identifiers and position titles.
 */
export function findInternshipDomainById(domainId: string): InternshipDomain | undefined {
  if (!domainId) return undefined;
  const normalized = domainId.trim().toLowerCase();

  // Backward compatibility alias map
  if (normalized === 'web-development' || normalized === 'frontend') {
    return internshipDomains.find((d) => d.id === 'frontend');
  }
  if (normalized === 'backend-engineering' || normalized === 'java-backend') {
    return internshipDomains.find((d) => d.id === 'java-backend');
  }
  if (normalized === 'java-full-stack') {
    return internshipDomains.find((d) => d.id === 'java-full-stack');
  }
  if (normalized === 'digital-lead-generation' || normalized === 'digital-marketing') {
    return internshipDomains.find((d) => d.id === 'digital-marketing');
  }
  if (
    normalized === 'brand-identity-graphic-design' ||
    normalized === 'brand-identity-business-growth'
  ) {
    return internshipDomains.find((d) => d.id === 'brand-identity-business-growth');
  }

  return internshipDomains.find((d) => d.id.toLowerCase() === normalized);
}

export function findInternshipDomainByPosition(positionTitle: string): InternshipDomain | undefined {
  if (!positionTitle) return undefined;
  const normalized = positionTitle.trim().toLowerCase();

  // Exact match on careerPositionTitle
  const exact = internshipDomains.find((d) => d.careerPositionTitle.toLowerCase() === normalized);
  if (exact) return exact;

  // Exact match on domain name
  const nameMatch = internshipDomains.find((d) => d.name.toLowerCase() === normalized);
  if (nameMatch) return nameMatch;

  // Alias title matches
  if (normalized.includes('web & frontend') || normalized.includes('frontend')) {
    return internshipDomains.find((d) => d.id === 'frontend');
  }
  if (normalized.includes('backend & java') || normalized.includes('java backend')) {
    return internshipDomains.find((d) => d.id === 'java-backend');
  }
  if (normalized.includes('java full stack')) {
    return internshipDomains.find((d) => d.id === 'java-full-stack');
  }
  if (normalized.includes('brand identity')) {
    return internshipDomains.find((d) => d.id === 'brand-identity-business-growth');
  }
  if (normalized.includes('digital lead generation') || normalized.includes('digital marketing')) {
    return internshipDomains.find((d) => d.id === 'digital-marketing');
  }

  return undefined;
}

export function isInternshipPosition(positionTitle: string): boolean {
  if (!positionTitle) return false;
  const normalized = positionTitle.trim().toLowerCase();
  return normalized.startsWith('internship') || Boolean(findInternshipDomainByPosition(positionTitle));
}
