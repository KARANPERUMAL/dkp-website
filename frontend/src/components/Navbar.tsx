import { useState, useEffect } from 'react';
import { FloatingNav, type NavItem } from '@/components/ui/floating-navbar';
import { useNavigation } from '../context/NavigationContext';
import {
  IconHome,
  IconUsers,
  IconBriefcase,
  IconPhoto,
  IconUserCheck,
  IconMessage,
} from '@tabler/icons-react';

export const navItems: NavItem[] = [
  {
    name: 'Home',
    link: '#home',
    icon: <IconHome className="h-4 w-4" />,
  },
  {
    name: 'Who We Are',
    link: '#about',
    icon: <IconUsers className="h-4 w-4" />,
  },
  {
    name: 'What We Do',
    link: '#services',
    icon: <IconBriefcase className="h-4 w-4" />,
  },
  {
    name: 'Gallery',
    link: '#gallery',
    icon: <IconPhoto className="h-4 w-4" />,
  },
  {
    name: 'Careers',
    link: '#careers',
    icon: <IconUserCheck className="h-4 w-4" />,
  },
  {
    name: 'Contact Us',
    link: '#contact',
    icon: <IconMessage className="h-4 w-4" />,
  },
];

export const Navbar = () => {
  const { currentPage, navigateTo } = useNavigation();

  // Compute active tab based on currentPage
  const getTabForPage = (page: string) => {
    if (page === 'about') return '#about';
    if (page === 'services') return '#services';
    if (page === 'gallery') return '#gallery';
    if (page === 'careers') return '#careers';
    if (page === 'contact') return '#contact';
    return '#home';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabForPage(currentPage));

  useEffect(() => {
    setActiveTab(getTabForPage(currentPage));
  }, [currentPage]);

  const handleNavClick = (link: string) => {
    setActiveTab(link);
    if (link === '#home') {
      navigateTo('home', 'home');
    } else if (link === '#about') {
      navigateTo('about');
    } else if (link === '#services') {
      navigateTo('services');
    } else if (link === '#gallery') {
      navigateTo('gallery');
    } else if (link === '#careers') {
      navigateTo('careers');
    } else if (link === '#contact') {
      navigateTo('contact');
    }
  };

  return (
    <>
      {/* Centered Aceternity UI Floating Navbar (fixed z-50 at top, always floating) */}
      <FloatingNav
        navItems={navItems}
        activeTab={activeTab}
        onItemClick={handleNavClick}
        alwaysVisible={true}
      />

      {/* Floating Header Container with Official Logo on Left (elevated z-50 above hero and scrolling content) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full pt-3 sm:pt-4 px-4 sm:px-8 lg:px-12 pointer-events-none">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between min-h-[46px] relative pointer-events-auto">
          {/* Official DKP Innovation Logo (rectangular container removed, size increased slightly with preserved aspect ratio) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home', 'home');
            }}
            aria-label="DKP Innovation Home"
            className="group flex items-center select-none z-10 transition-transform duration-200 hover:scale-105 cursor-pointer"
          >
            <img
              src="/images/logo/logo.png"
              alt="DKP Innovation"
              className="h-10 sm:h-11 md:h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            />
          </a>

          {/* Social media icons completely removed per requirements */}
        </div>
      </header>
    </>
  );
};
