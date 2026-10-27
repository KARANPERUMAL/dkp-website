export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  alt: string;
  highlights: string[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  titleCardImage: string;
  titleCardAlt: string;
  services: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  // Category 1 — IT & Digital Solutions
  {
    id: 'technology-solutions',
    slug: 'technology-solutions',
    title: 'IT & Digital Solutions',
    subtitle: 'Scalable Engineering, Enterprise Architecture & Search Dominance',
    description:
      'We architect high-performance websites, scalable e-commerce infrastructure, and search dominance systems designed to transform casual visitors into long-term brand advocates.',
    titleCardImage: '/images/services/technology-solutions/title-card.jpg',
    titleCardAlt: 'IT & Digital Solutions overview and engineering capabilities at DKP Innovation',
    services: [
      {
        id: 'seo-expert-advanced-strategy',
        name: 'SEO Expert — Advanced Strategy',
        category: 'IT & Digital Solutions',
        image: '/images/services/technology-solutions/seo-expert-advanced-strategy.jpg',
        alt: 'Advanced search engine optimization strategy and analytics dashboard',
        description:
          'Data-backed organic positioning, deep technical SEO audits, semantic keyword mapping, and search authority architecture that keeps your business at the top of competitive search results.',
        highlights: [
          'Technical site architecture & Core Web Vitals optimization',
          'Semantic content clustering & entity search authority',
          'Competitive SERP gap analysis & link velocity strategy',
          'Conversion-oriented local & global organic search growth',
        ],
      },
      {
        id: 'ecommerce-website-solutions',
        name: 'E-Commerce Website Solutions',
        category: 'IT & Digital Solutions',
        image: '/images/services/technology-solutions/e-commerce-website-solutions.jpg',
        alt: 'High-conversion e-commerce platform and online store architecture',
        description:
          'High-conversion online storefronts engineered with secure checkout pipelines, real-time inventory synchronization, frictionless payment integrations, and speed-optimized product pages.',
        highlights: [
          'Custom Shopify, WooCommerce, and headless e-commerce builds',
          'Frictionless multi-currency & UPI payment gateway integrations',
          'Automated inventory, logistics & CRM workflow synchronization',
          'High-converting checkout funnel UX & abandoned cart recovery',
        ],
      },
      {
        id: 'website-design-development',
        name: 'Website Design & Development',
        category: 'IT & Digital Solutions',
        image: '/images/services/technology-solutions/website-design-and-development.jpg',
        alt: 'Modern responsive website design and frontend development layout',
        description:
          'Bespoke, high-performance web experiences engineered with modern frameworks, pixel-perfect responsive layouts, micro-interactions, and conversion-focused design systems.',
        highlights: [
          'React, TypeScript & Tailwind CSS modern frontend engineering',
          'Mobile-first responsive design across all screen viewports',
          'Lightning-fast load performance (<1s initial paint)',
          'Modular component architecture ready for future scaling',
        ],
      },
      {
        id: 'social-media-optimization-strategy',
        name: 'Social Media Optimization & Strategy',
        category: 'IT & Digital Solutions',
        image: '/images/services/technology-solutions/social-media-optimization-and-strategy.jpg',
        alt: 'Social media profile optimization and organic engagement growth strategy',
        description:
          'Holistic channel architecture, profile SEO optimization, strategic content scheduling, and audience retention workflows that turn brand channels into compounding growth engines.',
        highlights: [
          'Multi-channel visual identity & bio search optimization',
          'Algorithm-friendly content scheduling & format distribution',
          'Community engagement frameworks & reputation monitoring',
          'Performance metrics, attribution modeling & monthly insights',
        ],
      },
    ],
  },

  // Category 2 — Digital Marketing & Lead Generation
  {
    id: 'digital-marketing-and-lead-generation',
    slug: 'digital-marketing-and-lead-generation',
    title: 'Digital Marketing & Lead Generation',
    subtitle: 'High-Intent Acquisition, Paid Performance & Search Dominance',
    description:
      'We engineer systematic marketing engines that capture existing demand, generate qualified sales opportunities, and scale client revenue across every digital touchpoint.',
    titleCardImage: '/images/services/digital-marketing-and-lead-generation/title-card.jpg',
    titleCardAlt: 'Digital Marketing & Lead Generation strategy banner',
    services: [
      {
        id: 'influencer-marketing',
        name: 'Influencer Marketing',
        category: 'Digital Marketing & Lead Generation',
        image: '/images/services/digital-marketing-and-lead-generation/influencer-marketing.jpg',
        alt: 'Influencer marketing campaign collaboration and creator reach',
        description:
          'Strategic creator partnerships, contract negotiations, verified demographic targeting, and creative briefs that deliver authentic brand endorsements with measurable conversion lift.',
        highlights: [
          'Vetted creator discovery across micro, macro & niche tiers',
          'End-to-end contract execution & usage rights licensing',
          'Data-driven engagement rate & audience authenticity checks',
          'Affiliate tracking, custom landing pages & attribution analytics',
        ],
      },
      {
        id: 'google-promotions-google-presence',
        name: 'Google Promotions & Google Presence',
        category: 'Digital Marketing & Lead Generation',
        image: '/images/services/digital-marketing-and-lead-generation/google-promotions-and-google-presence.jpg',
        alt: 'Google Ads PPC campaign and Google Business Profile management',
        description:
          'Targeted Google Search, Performance Max, and Local Services ad campaigns combined with continuous Google Business Profile optimization to capture high-intent commercial buyers.',
        highlights: [
          'High-intent search keyword bidding & negative match sculpting',
          'Google Business Profile rankings & local 3-pack dominance',
          'Performance Max asset creation & automated smart bidding',
          'Landing page conversion rate optimization (CRO) alignment',
        ],
      },
      {
        id: 'lead-generation-business',
        name: 'Lead Generation for Business',
        category: 'Digital Marketing & Lead Generation',
        image: '/images/services/digital-marketing-and-lead-generation/lead-generation-for-business.jpg',
        alt: 'B2B and B2C lead generation funnel and qualification workflow',
        description:
          'Full-funnel customer acquisition pipelines combining intent-driven landing pages, automated lead qualification, and CRM routing to supply sales teams with hot prospects.',
        highlights: [
          'Custom high-converting lead capture funnels & interactive forms',
          'Automated email/SMS lead nurturing & instant sales alerts',
          'Audience segmentation, retargeting & prospect scoring',
          'Strict quality filters to eliminate invalid or low-intent queries',
        ],
      },
      {
        id: 'meta-ads-expert-strategy',
        name: 'Meta Ads Expert Strategy',
        category: 'Digital Marketing & Lead Generation',
        image: '/images/services/digital-marketing-and-lead-generation/meta-ads-expert-strategy.jpg',
        alt: 'Targeted Meta Facebook and Instagram advertising strategy',
        description:
          'Precision-targeted Facebook and Instagram ad campaigns powered by audience modeling, creative hook testing, dynamic retargeting, and scalable ROAS optimization.',
        highlights: [
          'Lookalike audience modeling & interest stack architecture',
          'Rapid creative iteration (UGC, statics, motion carousels)',
          'Meta Conversions API (CAPI) server-side tracking setup',
          'Budget pacing & bid cap strategies for sustainable scaling',
        ],
      },
      {
        id: 'political-profile-handling-media-strategy',
        name: 'Political Profile Handling & Media Strategy',
        category: 'Digital Marketing & Lead Generation',
        image: '/images/services/digital-marketing-and-lead-generation/political-profile-handling-and-media-strategy.jpg',
        alt: 'Strategic public affairs communication and political profile management',
        description:
          'Strategic narrative architecture, constituency outreach campaigns, 24/7 digital sentiment monitoring, and crisis mitigation that build public trust and leadership authority.',
        highlights: [
          'Constituency-level demographic sentiment analysis',
          'Strategic speech, manifesto & digital press dissemination',
          'Rapid response media cell & counter-misinformation workflows',
          'Multi-channel ground-to-digital mobilization campaigns',
        ],
      },
    ],
  },

  // Category 3 — Branding, PR & Influencer Marketing
  {
    id: 'branding-pr-and-influencer-marketing',
    slug: 'branding-pr-and-influencer-marketing',
    title: 'Branding, PR & Influencer Marketing',
    subtitle: 'Signature Brand Identities, Prestige PR & Public Stature',
    description:
      'We craft iconic visual identities, orchestrate national public relations features, and manage prestige talent branding that positions our partners as undisputed market leaders.',
    titleCardImage: '/images/services/branding-pr-and-influencer-marketing/title-card.jpg',
    titleCardAlt: 'Branding, PR & Influencer Marketing showcase at DKP Innovation',
    services: [
      {
        id: 'celebrity-artist-branding-pr-strategy',
        name: 'Celebrity & Artist Branding with PR Strategy',
        category: 'Branding, PR & Influencer Marketing',
        image: '/images/services/branding-pr-and-influencer-marketing/celebrity-and-artist-branding-with-pr-strategy.jpg',
        alt: 'Celebrity talent branding, red carpet PR, and public relations strategy',
        description:
          'Strategic personal brand architecture, premier publication press features, red carpet media relations, and digital portfolio management tailored for artists and public icons.',
        highlights: [
          'Prestige national media press releases & magazine features',
          'Personal brand guidelines, tone of voice & visual identity',
          'Crisis communications management & media interview preparation',
          'Digital reputation curation & verified social profile growth',
        ],
      },
      {
        id: 'influencer-celebrity-marketing-reach-strategy',
        name: 'Influencer & Celebrity Marketing with Reach Strategy',
        category: 'Branding, PR & Influencer Marketing',
        image: '/images/services/branding-pr-and-influencer-marketing/influencer-and-celebrity-marketing.jpg',
        alt: 'Nationwide celebrity endorsement and mega reach marketing strategy',
        description:
          'High-impact celebrity endorsements, nationwide reach campaigns, talent activation, and synergistic brand partnerships that capture market share rapidly.',
        highlights: [
          'A-list celebrity alignment & brand ambassador contracts',
          'High-reach nationwide broadcast & digital campaign synchronization',
          'Collaborative product lines & signature co-branded launches',
          'Legal clearance, compliance guidelines & exclusivity negotiation',
        ],
      },
      {
        id: 'brand-identity-logo-design-startup-growth',
        name: 'Brand Identity, Logo Design & Startup Growth Support',
        category: 'Branding, PR & Influencer Marketing',
        image: '/images/services/branding-pr-and-influencer-marketing/brand-identity-and-logo-design.jpg',
        alt: 'Complete visual brand identity, typography palette, and logo design system',
        description:
          'End-to-end brand architecture, memorable logo marks, typographic hierarchies, color palettes, and foundational brand guidelines that set startups up for institutional investment.',
        highlights: [
          'Brand positioning, value proposition & mission formulation',
          'Distinctive logo marks, icon systems & brand design guides',
          'Investor pitch deck design & company brand asset kits',
          'Physical packaging, stationery & digital asset collateral',
        ],
      },
      {
        id: 'event-management',
        name: 'Event Management',
        category: 'Branding, PR & Influencer Marketing',
        image: '/images/services/branding-pr-and-influencer-marketing/event-management.jpg',
        alt: 'Corporate event production, staging, lighting, and press conference setup',
        description:
          'Flawless end-to-end execution of corporate conferences, product reveals, gala ceremonies, and press events with bespoke stage design, audio-visual mastery, and VIP coordination.',
        highlights: [
          'Venue selection, 3D stage rendering & spatial experience design',
          'Audiovisual engineering, live streaming & ambient lighting',
          'Media credentialing, press lounge management & photo walls',
          'On-site technical director & minute-by-minute protocol execution',
        ],
      },
    ],
  },

  // Category 4 — Creative Production & Advertising
  {
    id: 'creative-production-and-advertising',
    slug: 'creative-production-and-advertising',
    title: 'Creative Production & Advertising',
    subtitle: 'Cinematic Visuals, Commercial Storytelling & Immersive Media',
    description:
      'We bring brand narratives to life through high-definition cinematography, commercial photography, and interactive 360-degree virtual experiences that captivate attention.',
    titleCardImage: '/images/services/creative-production-and-advertising/title-card.jpg',
    titleCardAlt: 'Creative Production & Advertising showcase at DKP Innovation',
    services: [
      {
        id: 'corporate-photography-videography',
        name: 'Corporate Photography & Videography',
        category: 'Creative Production & Advertising',
        image: '/images/services/creative-production-and-advertising/corporate-photography-and-videography.jpg',
        alt: 'Professional corporate film crew and executive photography shoot',
        description:
          'High-definition executive portraits, workplace culture showcases, corporate documentaries, and branded asset libraries that establish trust and market authority.',
        highlights: [
          'Executive headshots & leadership team editorial photography',
          'High-impact corporate brand films & cultural documentaries',
          'Multi-camera 4K cinema equipment & precision studio lighting',
          'Full post-production color grading, sound design & editing',
        ],
      },
      {
        id: 'advertisement-shoots',
        name: 'Advertisement Shoots',
        category: 'Creative Production & Advertising',
        image: '/images/services/creative-production-and-advertising/advertisement-shoots.jpg',
        alt: 'High-concept commercial advertising shoot in professional studio',
        description:
          'High-impact commercial photography and film production crafted for multi-platform digital advertising, outdoor hoardings, and premium promotional campaigns.',
        highlights: [
          'Scriptwriting, storyboarding & creative concept development',
          'Professional casting, styling & location scouting',
          'Multi-aspect ratio outputs tailored for TV, YouTube & Meta',
          'Cinematic visual effects, motion typography & audio master',
        ],
      },
      {
        id: 'google-virtual-tours',
        name: 'Google Virtual Tours',
        category: 'Creative Production & Advertising',
        image: '/images/services/creative-production-and-advertising/google-virtual-tours.jpg',
        alt: 'Interactive 360-degree Google Virtual Tour Street View walkthrough',
        description:
          'Interactive 360-degree Street View virtual tours that elevate your Google Maps presence, invite online walk-ins, and build immediate credibility with prospective customers.',
        highlights: [
          'Official Google Street View certified panoramic 360° capture',
          'Seamless Google Business Profile integration & map linkage',
          'Interactive indoor navigation with customizable clickable hotspots',
          'Measurable boost to local search prominence and user dwell time',
        ],
      },
    ],
  },

  // Category 5 — Business Registration & Corporate Compliance
  {
    id: 'business-registration-and-corporate-compliance',
    slug: 'business-registration-and-corporate-compliance',
    title: 'Business Registration & Corporate Compliance',
    subtitle: 'Legal Entity Formation, Tax Compliance & Intellectual Property Protection',
    description:
      'We provide end-to-end corporate legal structuring, company incorporation, GST compliance, and trademark protection to establish a rock-solid operational and regulatory foundation for your enterprise.',
    titleCardImage: '/images/services/business-registration-and-corporate-compliance/title-card.jpg',
    titleCardAlt: 'Business Registration & Corporate Compliance overview and advisory services at DKP Innovation',
    services: [
      {
        id: 'company-incorporation',
        name: 'Company Incorporation',
        category: 'Business Registration & Corporate Compliance',
        image: '/images/services/business-registration-and-corporate-compliance/company-incorporation.jpg',
        alt: 'Company incorporation and legal business entity registration services',
        description:
          'End-to-end legal entity formation, MCA registration, Private Limited, LLP, and OPC incorporations, digital signature certificates (DSC), and statutory filing support.',
        highlights: [
          'Private Limited, LLP, OPC & Partnership firm registration',
          'Director Identification Number (DIN) & Digital Signature (DSC)',
          'MOA & AOA drafting and Ministry of Corporate Affairs (MCA) filing',
          'PAN, TAN, bank account opening & post-incorporation advisory',
        ],
      },
      {
        id: 'gst-registration-and-returns',
        name: 'GST Registration and Returns',
        category: 'Business Registration & Corporate Compliance',
        image: '/images/services/business-registration-and-corporate-compliance/gst-registration-and-return-filing.jpg',
        alt: 'GST registration, monthly return filing, and corporate tax compliance',
        description:
          'Seamless Goods and Services Tax (GST) registration, monthly and quarterly return filings (GSTR-1, GSTR-3B), tax reconciliation, and timely statutory compliance management.',
        highlights: [
          'New GST registration & voluntary registration assistance',
          'Timely GSTR-1, GSTR-3B, and annual return (GSTR-9) filing',
          'Input Tax Credit (ITC) reconciliation and notice handling',
          'Ongoing corporate tax advisory & compliance calendar tracking',
        ],
      },
      {
        id: 'trademark-registration',
        name: 'Trademark Registration',
        category: 'Business Registration & Corporate Compliance',
        image: '/images/services/business-registration-and-corporate-compliance/trademark-registration-and-ip-protection.jpg',
        alt: 'Trademark registration, IP protection, and brand copyright filing',
        description:
          'Comprehensive trademark search, brand name and logo IP registration, copyright filings, objection handling, and long-term brand asset protection.',
        highlights: [
          'Comprehensive trademark search across Indian & global classes',
          'Brand name, logo mark, slogan & copyright application filing',
          'Examination report response, hearing representation & objection handling',
          'Trademark renewal and brand asset infringement protection',
        ],
      },
    ],
  },
];

// Helper lookup to quickly find a service by id
export const getAllServices = (): ServiceItem[] => {
  return serviceCategories.flatMap((cat) => cat.services);
};

export const getServiceById = (id: string): ServiceItem | undefined => {
  return getAllServices().find((s) => s.id === id);
};
