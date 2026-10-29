export interface ReviewPlatformData {
  id: 'google' | 'justdial';
  platformName: string;
  url: string;
  ariaLabel: string;
  stars: number;
  rating?: string;
  reviewCount?: string;
  hasVerifiedCount: boolean;
  actionText: string;
}

export const reviewsData: Record<'google' | 'justdial', ReviewPlatformData> = {
  google: {
    id: 'google',
    platformName: 'Google Reviews',
    // Official Google Business / Maps profile for DKP Innovations Bengaluru
    url: 'https://maps.app.goo.gl/t6bt9Nm2izZSm2rM7?g_st=aw',
    ariaLabel: 'Read and write reviews for DKP Innovations on Google Reviews',
    stars: 5,
    // Note: Live public rating count on Google is pending public sync. Left undefined to prevent fabricating data.
    rating: undefined,
    reviewCount: undefined,
    hasVerifiedCount: false,
    actionText: 'Review us on Google',
  },
  justdial: {
    id: 'justdial',
    platformName: 'Justdial Reviews',
    // Official verified Justdial listing for DKP Innovations Bangalore
    url: 'https://www.justdial.com/Bangalore/DKP-Innovations-Bhima-Jyothi-Lic-Colony-Basaveshwar-Nagar-Basaveshwara-Nagar/080PXX80-XX80-250225114407-V2V9_BZDET',
    ariaLabel: 'Read verified 5.0 rating and 11 reviews for DKP Innovations on Justdial',
    stars: 5,
    rating: '5.0',
    reviewCount: '11 Ratings',
    hasVerifiedCount: true,
    actionText: 'View on Justdial',
  },
};
