import { lazy, Suspense } from 'react';
import { NavigationProvider } from './context/NavigationContext';
import { useNavigation } from './hooks/useNavigation';
import { usePageSeo } from './hooks/usePageSeo';

// Route-level code splitting using React.lazy with named-export adaptors
const HomePage = lazy(() =>
  import('./components/HomePage').then((m) => ({ default: m.HomePage }))
);
const AboutPage = lazy(() =>
  import('./components/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ServicesPage = lazy(() =>
  import('./components/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const ContactPage = lazy(() =>
  import('./components/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const CareersPage = lazy(() =>
  import('./components/CareersPage').then((m) => ({ default: m.CareersPage }))
);
const GalleryPage = lazy(() =>
  import('./components/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const FoundationPage = lazy(() =>
  import('./components/FoundationPage').then((m) => ({ default: m.FoundationPage }))
);

/**
 * Lightweight, non-shifting loading fallback that preserves the deep blue background
 */
function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page..."
      className="min-h-screen w-full bg-[#004D86] flex items-center justify-center selection:bg-[#FFD60A] selection:text-[#002244]"
    >
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FFD60A] animate-spin" />
    </div>
  );
}

function PageContent() {
  const { currentPage } = useNavigation();
  usePageSeo(currentPage);

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      {(() => {
        switch (currentPage) {
          case 'about':
            return <AboutPage />;
          case 'services':
            return <ServicesPage />;
          case 'gallery':
            return <GalleryPage />;
          case 'foundation':
            return <FoundationPage />;
          case 'careers':
            return <CareersPage />;
          case 'contact':
            return <ContactPage />;
          case 'home':
          default:
            return <HomePage />;
        }
      })()}
    </Suspense>
  );
}

function App() {
  return (
    <NavigationProvider>
      <PageContent />
    </NavigationProvider>
  );
}

export default App;
