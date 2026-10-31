import { serviceCategories } from './servicesData';
import type { TeamCardItem } from '@/components/ui-animation/team-stack';

const ctaLabels: Record<string, string> = {
  'technology-solutions': 'Explore IT',
  'digital-marketing-and-lead-generation': 'Explore Growth',
  'branding-pr-and-influencer-marketing': 'Explore Branding',
  'creative-production-and-advertising': 'Explore Production',
  'business-registration-and-corporate-compliance': 'Explore Compliance',
};

// Authoritative DKP Innovation service data representing the five core capabilities in exact order
export const defaultDkpServices: TeamCardItem[] = serviceCategories.map((cat, idx) => ({
  name: cat.title,
  role: cat.subtitle,
  description: cat.description,
  imageSrc: cat.titleCardImage,
  imageAlt: `${cat.title} - ${cat.subtitle}`,
  isFeatured: idx === 0,
  ctaLabel: ctaLabels[cat.id] || 'Explore Service',
  ctaHref: '#services',
  slug: cat.id,
}));
