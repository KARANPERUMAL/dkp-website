import { useNavigation } from '../../hooks/useNavigation';
import { OFFICIAL_PHONE, OFFICIAL_PHONE_TEL, OFFICIAL_EMAIL, OFFICIAL_EMAIL_MAILTO, branchLocations } from '../../data/branchesData';
import { serviceCategories } from '../../data/servicesData';
import { socialLinksList, OFFICIAL_SOCIAL_LINKS } from '../../data/socialLinks';
import { ReviewBadges } from '../reviews/ReviewBadges';
import { IconPhone, IconMail, IconMapPin, IconArrowUpRight } from '@tabler/icons-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const { navigateTo } = useNavigation();

  return (
    <footer id="contact" className="w-full bg-[#004D86] text-white border-t border-white/20 pt-14 pb-8 px-4 sm:px-8 lg:px-12 select-none">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/20">
          
          {/* Column 1 — Brand (Spans 4 columns on desktop) */}
          <div className="lg:col-span-4 flex flex-col space-y-4 min-w-0">
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
                src="/images/logo/logo.webp"
                alt="DKP Innovation"
                width={160}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </a>

            <p className="text-sm text-white/90 leading-relaxed max-w-sm">
              We help businesses grow through technology, creative production, digital marketing and strategic brand development.
            </p>

            {/* Social Media Links & Reviews */}
            <div className="pt-2 min-w-0">
              <span className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center space-x-2.5">
                {socialLinksList.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="w-9 h-9 rounded-lg bg-[#003E6D] hover:bg-[#FFD60A] text-white hover:text-[#002244] flex items-center justify-center border border-white/20 hover:border-[#FFD60A] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_2px_12px_rgba(255,214,10,0.3)] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
                    >
                      <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>

              {/* Review Badges side by side in a second row directly beneath social icons */}
              <div className="mt-3 w-full min-w-0">
                <ReviewBadges />
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
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('home', 'home');
                  }}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('about');
                  }}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left inline-block"
                >
                  Who We Are
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('services');
                  }}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left inline-block"
                >
                  What Do We Do
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('gallery');
                  }}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left inline-block"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/foundation"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('foundation');
                  }}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left inline-block"
                >
                  DKP Foundation
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('careers');
                  }}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left inline-block"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('contact');
                  }}
                  className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left inline-block"
                >
                  Contact Us
                </a>
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
                  <a
                    href={`/services#${cat.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('services', cat.slug);
                    }}
                    className="text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer text-left leading-snug flex items-center group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {cat.title}
                    </span>
                  </a>
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

              <div>
                <a
                  href={OFFICIAL_SOCIAL_LINKS.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={OFFICIAL_SOCIAL_LINKS.whatsapp.ariaLabel}
                  className="inline-flex items-center space-x-2 text-neutral-300 hover:text-[#FFD60A] text-xs sm:text-sm font-medium transition-colors"
                >
                  <OFFICIAL_SOCIAL_LINKS.whatsapp.icon className="w-4 h-4 text-[#FFD60A] flex-shrink-0" />
                  <span>WhatsApp: {OFFICIAL_SOCIAL_LINKS.whatsapp.shortLabel}</span>
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

                <a
                  href="/contact#branch-map"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('contact', 'branch-map');
                  }}
                  className="mt-3 inline-flex items-center space-x-1 text-xs text-[#FFD60A] hover:text-[#FFE047] font-semibold cursor-pointer group"
                >
                  <span>View Interactive Branch Map</span>
                  <IconArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
            <span className="font-bold text-white tracking-tight">DKP INNOVATION</span>
            <span>•</span>
            <span>Digital Agency, Creative Production & Brand Architecture</span>
            <span>•</span>
            <span>Bengaluru, Karnataka, India</span>
          </div>

          <div>
            <span>© {CURRENT_YEAR} DKP Innovation. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
