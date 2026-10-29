import { useNavigation } from '../../context/NavigationContext';
import { OFFICIAL_PHONE, OFFICIAL_PHONE_TEL, OFFICIAL_EMAIL, OFFICIAL_EMAIL_MAILTO, branchLocations } from '../../data/branchesData';
import { serviceCategories } from '../../data/servicesData';
import { IconPhone, IconMail, IconMapPin, IconArrowUpRight } from '@tabler/icons-react';

export const Footer = () => {
  const { navigateTo } = useNavigation();

  return (
    <footer id="contact" className="w-full bg-[#000122] text-white border-t border-white/10 pt-14 pb-8 px-4 sm:px-8 lg:px-12 select-none">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1 — Brand (Spans 4 columns on desktop) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home', 'home');
              }}
              className="inline-block cursor-pointer transition-opacity hover:opacity-90 w-fit"
              aria-label="DKP Innovation Home"
            >
              <img
                src="/images/logo/logo.png"
                alt="DKP Innovation"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </a>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-sm">
              We help businesses grow through technology, creative production, digital marketing and strategic brand development.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DKP Innovation Facebook"
                  className="w-8 h-8 rounded-lg bg-[#000122] hover:bg-[#FFD60A] text-neutral-300 hover:text-[#000122] flex items-center justify-center text-xs font-bold border border-white/10 transition-all duration-200"
                >
                  f
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DKP Innovation Twitter / X"
                  className="w-8 h-8 rounded-lg bg-[#000122] hover:bg-[#FFD60A] text-neutral-300 hover:text-[#000122] flex items-center justify-center text-xs font-bold border border-white/10 transition-all duration-200"
                >
                  t
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DKP Innovation LinkedIn"
                  className="w-8 h-8 rounded-lg bg-[#000122] hover:bg-[#FFD60A] text-neutral-300 hover:text-[#000122] flex items-center justify-center text-xs font-bold border border-white/10 transition-all duration-200"
                >
                  in
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 — Quick Links (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigateTo('home', 'home')}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('home', 'about')}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left"
                >
                  Who We Are
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('services')}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left"
                >
                  What Do We Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('careers')}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 — Services (Spans 3 columns on desktop) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {serviceCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo('services', cat.slug)}
                    className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left leading-snug flex items-center group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {cat.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact & Locations (Spans 3 columns on desktop) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Get In Touch
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <a
                  href={OFFICIAL_PHONE_TEL}
                  className="inline-flex items-center space-x-2 text-neutral-300 hover:text-[#FFD60A] font-medium transition-colors"
                >
                  <IconPhone className="w-4 h-4 text-[#FFD60A] flex-shrink-0" />
                  <span>{OFFICIAL_PHONE}</span>
                </a>
              </div>

              <div>
                <a
                  href={OFFICIAL_EMAIL_MAILTO}
                  className="inline-flex items-center space-x-2 text-neutral-300 hover:text-[#FFD60A] text-xs sm:text-sm font-medium transition-colors break-all"
                >
                  <IconMail className="w-4 h-4 text-[#FFD60A] flex-shrink-0" />
                  <span>{OFFICIAL_EMAIL}</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-300 mb-2">
                  <IconMapPin className="w-4 h-4 text-[#FFD60A] flex-shrink-0" />
                  <span>Bengaluru Branches</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  {branchLocations.map((branch, i) => (
                    <li key={branch.id} className="leading-snug">
                      <span className="text-[#FFD60A] font-semibold">{i + 1}.</span>{' '}
                      <span className="text-neutral-300">{branch.name.split('—')[0].trim()}</span>{' '}
                      <span className="text-neutral-500">({branch.tag})</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigateTo('contact', 'branch-map')}
                  className="mt-3 inline-flex items-center space-x-1 text-xs text-[#FFD60A] hover:text-[#FFE047] font-semibold cursor-pointer group"
                >
                  <span>View Interactive Branch Map</span>
                  <IconArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
            <span className="font-bold text-neutral-300 tracking-tight">DKP INNOVATION</span>
            <span>•</span>
            <span>Digital Agency, Creative Production & Brand Architecture</span>
            <span>•</span>
            <span>Bengaluru, Karnataka, India</span>
          </div>

          <div>
            <span>© {new Date().getFullYear()} DKP Innovation. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
