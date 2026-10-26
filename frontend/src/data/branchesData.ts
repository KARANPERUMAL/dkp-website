export interface BranchLocation {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  address: string;
  lat: number;
  lon: number;
  phone: string;
  phoneDisplay: string;
  email: string;
  directionsUrl: string;
  searchUrl: string;
  hours: string;
  landmark: string;
}

export const OFFICIAL_PHONE = '+91 63637 25910';
export const OFFICIAL_PHONE_TEL = 'tel:+916363725910';
export const OFFICIAL_EMAIL = 'dkpinnovations20251@gmail.com';
export const OFFICIAL_EMAIL_MAILTO = 'mailto:dkpinnovations20251@gmail.com';

export const branchLocations: BranchLocation[] = [
  {
    id: 'branch-1-wtc',
    name: 'World Trade Center — Brigade Gateway',
    subtitle: 'Corporate Headquarters & Strategic Consulting',
    tag: 'Corporate Headquarters',
    address: 'Unit No 2201A, 22nd Floor, World Trade Center, Brigade Gateway, Rajajinagar, Bengaluru, Karnataka 560055, India',
    lat: 13.012247,
    lon: 77.556174,
    phone: '+91 63637 25910',
    phoneDisplay: '+91 63637 25910',
    email: 'dkpinnovations20251@gmail.com',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=World+Trade+Center+Brigade+Gateway+Rajajinagar+Bengaluru+560055',
    searchUrl: 'https://www.google.com/maps/search/?api=1&query=Unit+No+2201A+22nd+Floor+World+Trade+Center+Brigade+Gateway+Rajajinagar+Bengaluru+560055',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
    landmark: 'Adjacent to Orion Mall & Columbia Asia Hospital',
  },
  {
    id: 'branch-2-basaveshwaranagar',
    name: 'Basaveshwar Nagar Branch',
    subtitle: 'Creative Production & Brand Architecture Studio',
    tag: 'Creative Studio',
    address: 'No 87, Bhima Jyothi LIC Colony, Chord Road, 3rd Stage, Basaveshwar Nagar, Bengaluru, Karnataka, India',
    lat: 12.991200,
    lon: 77.538000,
    phone: '+91 63637 25910',
    phoneDisplay: '+91 63637 25910',
    email: 'dkpinnovations20251@gmail.com',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=No+87+Bhima+Jyothi+LIC+Colony+Chord+Road+3rd+Stage+Basaveshwar+Nagar+Bengaluru',
    searchUrl: 'https://www.google.com/maps/search/?api=1&query=No+87+Bhima+Jyothi+LIC+Colony+Chord+Road+3rd+Stage+Basaveshwar+Nagar+Bengaluru',
    hours: 'Mon – Sat: 9:30 AM – 6:30 PM IST',
    landmark: 'West of Chord Road, Near LIC Colony Park',
  },
  {
    id: 'branch-3-kengeri',
    name: 'Nagadevanahalli Branch — Kengeri Outer Ring Road',
    subtitle: 'Technology Solutions & Regional Operations Hub',
    tag: 'Operations Hub',
    address: '#32, 1st Floor, Kengeri Outer Ring Road, Nagadevanahalli, Bengaluru, Karnataka 560056, India',
    lat: 12.935699,
    lon: 77.492416,
    phone: '+91 63637 25910',
    phoneDisplay: '+91 63637 25910',
    email: 'dkpinnovations20251@gmail.com',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=32+1st+Floor+Kengeri+Outer+Ring+Road+Nagadevanahalli+Bengaluru+560056',
    searchUrl: 'https://www.google.com/maps/search/?api=1&query=32+1st+Floor+Kengeri+Outer+Ring+Road+Nagadevanahalli+Bengaluru+560056',
    hours: 'Mon – Sat: 9:30 AM – 6:30 PM IST',
    landmark: 'Kengeri Outer Ring Road / Near Bangalore University Campus',
  },
];
