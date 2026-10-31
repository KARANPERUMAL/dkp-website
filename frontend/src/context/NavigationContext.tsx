import { useState, useEffect, type ReactNode } from 'react';
import { NavigationContext, type PageRoute } from './navigationState';

function getInitialPage(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();

  if (rawPath === '/about' || hash.includes('#about') || hash.includes('#/about')) {
    return 'about';
  }
  if (rawPath === '/services' || hash.includes('#services') || hash.includes('#/services')) {
    return 'services';
  }
  if (rawPath === '/gallery' || hash.includes('#gallery') || hash.includes('#/gallery')) {
    return 'gallery';
  }
  if (rawPath === '/foundation' || hash.includes('#foundation') || hash.includes('#/foundation')) {
    return 'foundation';
  }
  if (rawPath === '/careers' || hash.includes('#careers') || hash.includes('#/careers')) {
    return 'careers';
  }
  if (rawPath === '/contact' || hash.includes('#contact') || hash.includes('#/contact')) {
    return 'contact';
  }
  if (rawPath === '/' || rawPath === '/index.html' || hash.includes('#home') || (!rawPath && !hash)) {
    return 'home';
  }
  return 'not-found';
}

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPage());
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string | undefined>();
  const [selectedPositionForApplication, setSelectedPositionForApplication] = useState<string | undefined>();

  useEffect(() => {
    // Disable browser automatic scroll restoration so page transitions start cleanly at top
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handleUrlChange = () => {
      const page = getInitialPage();
      setCurrentPage(page);
      if (page === 'home' && (!window.location.hash || window.location.hash === '#home')) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (page: PageRoute, targetId?: string) => {
    const isAlreadyOnPage = currentPage === page;
    setCurrentPage(page);

    const basePath = page === 'home' ? '/' : page === 'not-found' ? '/404' : `/${page}`;
    const url = targetId && targetId !== 'home' ? `${basePath}#${targetId}` : basePath;
    window.history.pushState(null, '', url);

    if (page === 'home' && (!targetId || targetId === 'home')) {
      // Immediately reset scroll to absolute top (y=0) to restore hero in starting state
      window.scrollTo({ top: 0, left: 0, behavior: isAlreadyOnPage ? 'smooth' : 'instant' });
      if (window.location.hash) {
        window.history.replaceState(null, '', '/');
      }
      return;
    }

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: isAlreadyOnPage ? 'smooth' : 'instant' });
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedServiceForInquiry,
        setSelectedServiceForInquiry,
        selectedPositionForApplication,
        setSelectedPositionForApplication,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};


