import { createContext } from 'react';

export type PageRoute =
  | 'home'
  | 'about'
  | 'services'
  | 'gallery'
  | 'academy'
  | 'foundation'
  | 'careers'
  | 'contact'
  | 'not-found';

export interface NavigationContextType {
  currentPage: PageRoute;
  navigateTo: (page: PageRoute, targetId?: string, queryParams?: Record<string, string>) => void;
  selectedServiceForInquiry?: string;
  setSelectedServiceForInquiry: (serviceName: string) => void;
  selectedPositionForApplication?: string;
  setSelectedPositionForApplication: (positionName: string) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);
