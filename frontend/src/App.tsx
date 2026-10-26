import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { ContactPage } from './components/ContactPage';

function PageContent() {
  const { currentPage } = useNavigation();

  switch (currentPage) {
    case 'about':
      return <AboutPage />;
    case 'services':
      return <ServicesPage />;
    case 'contact':
      return <ContactPage />;
    case 'home':
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <NavigationProvider>
      <PageContent />
    </NavigationProvider>
  );
}

export default App;
