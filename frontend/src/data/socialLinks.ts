import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
  type Icon as TablerIcon,
} from '@tabler/icons-react';

export interface SocialLinkItem {
  id: 'instagram' | 'facebook' | 'whatsapp';
  name: string;
  url: string;
  ariaLabel: string;
  shortLabel: string;
  icon: TablerIcon;
}

export const OFFICIAL_SOCIAL_LINKS = {
  instagram: {
    id: 'instagram' as const,
    name: 'Instagram',
    url: 'https://www.instagram.com/dkp_innovations?utm_source=qr&exln=MXJuZDlpM2E4NWYyYw==',
    ariaLabel: 'Follow DKP Innovations on Instagram',
    shortLabel: '@dkp_innovations',
    icon: IconBrandInstagram,
  },
  facebook: {
    id: 'facebook' as const,
    name: 'Facebook',
    url: 'https://www.facebook.com/share/19FGJfcPCo/',
    ariaLabel: 'Visit DKP Innovations on Facebook',
    shortLabel: 'DKP Innovations',
    icon: IconBrandFacebook,
  },
  whatsapp: {
    id: 'whatsapp' as const,
    name: 'WhatsApp',
    url: 'https://wa.me/6363725910',
    ariaLabel: 'Contact DKP Innovations on WhatsApp',
    shortLabel: '+91 63637 25910',
    icon: IconBrandWhatsapp,
  },
} as const;

export const socialLinksList: SocialLinkItem[] = [
  OFFICIAL_SOCIAL_LINKS.instagram,
  OFFICIAL_SOCIAL_LINKS.facebook,
  OFFICIAL_SOCIAL_LINKS.whatsapp,
];
