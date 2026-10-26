import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type PageRoute = 'home' | 'about' | 'services' | 'contact';

interface NavigationContextType {
  currentPage: PageRoute;
  navigateTo: (page: PageRoute, targetId?: string) => void;
  selectedServiceForInquiry?: string;
  setSelectedServiceForInquiry: (serviceName: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function getInitialPage(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path.includes('/about') || hash.includes('#about') || hash.includes('#/about')) {
    return 'about';
  }
  if (path.includes('/services') || hash.includes('#services') || hash.includes('#/services')) {
    return 'services';
  }
  if (path.includes('/contact') || hash.includes('#contact') || hash.includes('#/contact')) {
    return 'contact';
  }
  return 'home';
}

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPage());
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string | undefined>();

  useEffect(() => {
    const handleUrlChange = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (page: PageRoute, targetId?: string) => {
    setCurrentPage(page);

    const basePath = page === 'home' ? '/' : `/${page}`;
    const url = targetId ? `${basePath}#${targetId}` : basePath;
    window.history.pushState(null, '', url);

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedServiceForInquiry,
        setSelectedServiceForInquiry,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
