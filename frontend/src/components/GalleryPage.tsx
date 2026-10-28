import { useState, useMemo } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { useNavigation } from '../context/NavigationContext';
import {
  galleryItems,
  galleryCategories,
  type GalleryCategory,
  type GalleryItem,
} from '../data/galleryData';
import { GalleryLightbox } from './gallery/GalleryLightbox';
import {
  TextAnimationBlurFadeIn,
  BlurFadeIn,
} from '@/components/ui/text-animation-blur-fade-in';
import {
  Maximize2,
  Camera,
  MapPin,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { IconArrowRight } from '@tabler/icons-react';
import { useReducedMotion } from 'framer-motion';

export const GalleryPage = () => {
  const { navigateTo } = useNavigation();
  const prefersReducedMotion = useReducedMotion();

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const openLightboxAt = (item: GalleryItem, e?: React.MouseEvent | React.KeyboardEvent) => {
    const originalIndex = galleryItems.findIndex((g) => g.id === item.id);
    setActiveLightboxIndex(originalIndex >= 0 ? originalIndex : 0);
    if (e?.currentTarget instanceof HTMLElement) {
      setTriggerEl(e.currentTarget);
    }
    setIsLightboxOpen(true);
  };

  const scrollToJournal = () => {
    const el = document.getElementById('gallery-journal');
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  // Featured items for Hero preview cluster
  const heroPrimary = galleryItems.find((g) => g.id === 'studio-panorama') || galleryItems[0];
  const heroLeft = galleryItems.find((g) => g.id === 'digital-marketing-hub') || galleryItems[1];
  const heroRight = galleryItems.find((g) => g.id === 'chroma-production-studio') || galleryItems[2];

  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col w-full selection:bg-orange-500 selection:text-white">
      {/* Floating Centered Navbar */}
      <Navbar />

      {/* =========================================================================
          SECTION 1: EDITORIAL HERO SECTION
          ========================================================================= */}
      <section className="relative w-full pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden select-none border-b border-neutral-800/80">
        {/* Ambient Warm Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-1/2 -top-[12%] -translate-x-1/2 w-[760px] h-[440px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(234, 88, 12, 0.22) 0%, rgba(180, 60, 10, 0.06) 50%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className="absolute right-[5%] top-[30%] w-[460px] h-[360px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(30, 41, 59, 0.35) 0%, transparent 70%)',
              filter: 'blur(55px)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto text-center">
          {/* Eyebrow Label */}
          <TextAnimationBlurFadeIn
            as="span"
            delay={0.05}
            duration={0.4}
            className="text-xs sm:text-sm font-bold text-orange-500 uppercase tracking-widest mb-4 inline-flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>OUR WORLD / VISUAL ARCHIVE</span>
          </TextAnimationBlurFadeIn>

          {/* Main Headline */}
          <TextAnimationBlurFadeIn
            as="h1"
            delay={0.15}
            staggerDuration={0.03}
            duration={0.6}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-6 max-w-4xl mx-auto leading-[1.05]"
          >
            Inside the Studio. Where Innovation Takes Shape.
          </TextAnimationBlurFadeIn>

          {/* Supporting Description */}
          <TextAnimationBlurFadeIn
            as="p"
            delay={0.28}
            duration={0.5}
            className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-normal mb-8"
          >
            A curated visual journal of DKP Innovations' creative spaces, high-performance technology hubs, and media production environments in Bangalore. Step inside the physical rooms where our strategists, engineers, and creatives build digital growth for forward-thinking enterprises.
          </TextAnimationBlurFadeIn>

          {/* Stat Badges / Key Metadata */}
          <BlurFadeIn delay={0.35} duration={0.5} className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs font-semibold text-neutral-400">
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center space-x-1.5">
              <Camera className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-white font-mono">10</span>
              <span>Curated Frames</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Bangalore Studio HQ</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
              Tech · Studio · Executive · Culture
            </span>
          </BlurFadeIn>

          {/* Asymmetric Hero Montage Cluster */}
          <BlurFadeIn delay={0.42} duration={0.6} className="relative max-w-4xl mx-auto mt-4 mb-6">
            {/* Left Flanking Accent Preview Card (xl+ screens) */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => openLightboxAt(heroLeft, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightboxAt(heroLeft, e);
                }
              }}
              aria-label={`Preview frame 02: ${heroLeft.title}`}
              className="absolute -left-12 lg:-left-16 top-10 w-36 lg:w-44 aspect-[2/3] hidden xl:block rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.8)] -rotate-3 hover:rotate-0 hover:scale-105 opacity-60 hover:opacity-100 transition-all duration-300 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <img
                src={heroLeft.src}
                alt={heroLeft.alt}
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-left">
                <span className="text-[10px] font-mono text-orange-400 font-bold block">02 / 10</span>
                <span className="text-[11px] font-bold text-white truncate block">Digital Hub</span>
              </div>
            </div>

            {/* Right Flanking Accent Preview Card (xl+ screens) */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => openLightboxAt(heroRight, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightboxAt(heroRight, e);
                }
              }}
              aria-label={`Preview frame 03: ${heroRight.title}`}
              className="absolute -right-12 lg:-right-16 top-14 w-44 lg:w-52 aspect-[16/10] hidden xl:block rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-3 hover:rotate-0 hover:scale-105 opacity-60 hover:opacity-100 transition-all duration-300 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <img
                src={heroRight.src}
                alt={heroRight.alt}
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-left">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">03 / 10</span>
                <span className="text-[11px] font-bold text-white truncate block">Production Lab</span>
              </div>
            </div>

            {/* Center Primary Card */}
            <div className="relative z-10 w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] group cursor-pointer">
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => openLightboxAt(heroPrimary, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightboxAt(heroPrimary, e);
                  }
                }}
                aria-label={`View featured frame: ${heroPrimary.title}`}
                className="relative aspect-[16/9] w-full overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl"
              >
                <img
                  src={heroPrimary.src}
                  alt={heroPrimary.alt}
                  loading="eager"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600/90 text-white backdrop-blur-md shadow-lg">
                    Featured Space
                  </span>
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono text-neutral-300 bg-black/50 border border-white/15 backdrop-blur-md">
                    01 / 10
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between text-left">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                      {heroPrimary.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 hidden sm:block mt-1 drop-shadow-sm">
                      {heroPrimary.caption}
                    </p>
                  </div>

                  <span className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-orange-600 text-white flex items-center justify-center transition-colors duration-200 backdrop-blur-md shrink-0 ml-3">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* Scroll CTA */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={scrollToJournal}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-400 hover:text-orange-400 transition-colors cursor-pointer group"
              >
                <span>Scroll to explore the visual journal</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </BlurFadeIn>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CURATED CATEGORY FILTER BAR
          ========================================================================= */}
      <section id="gallery-journal" className="sticky top-[64px] z-30 w-full bg-[#050608]/90 backdrop-blur-xl border-b border-white/10 py-3 sm:py-4 px-4 sm:px-8 select-none">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {galleryCategories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`relative px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-[0_2px_12px_rgba(234,88,12,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-orange-700/60 text-white' : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-xs text-neutral-400 font-mono">
            <span>Click any image to view high-resolution details</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ART-DIRECTED EDITORIAL JOURNAL (MAIN CONTENT)
          ========================================================================= */}
      <main className="relative w-full py-12 sm:py-16 md:py-24 px-4 sm:px-8 lg:px-12 flex-1">
        <div className="max-w-[1240px] mx-auto">
          {/* When 'all' is selected: Editorial Layout with curated movements */}
          {activeCategory === 'all' ? (
            <div className="space-y-16 sm:space-y-24 md:space-y-32">
              
              {/* -------------------------------------------------------------
                  CHAPTER 01: The Technology & Creative Core (3.jpeg & 1.jpeg & 8.jpeg)
                  ------------------------------------------------------------- */}
              <section aria-labelledby="chapter-01-heading" className="space-y-8 sm:space-y-10">
                <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-500 uppercase tracking-widest block mb-1">
                      Chapter 01 · Agile Workspaces
                    </span>
                    <h2 id="chapter-01-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      The Technology & Collaboration Core
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                    Where high-speed digital marketing, custom software architecture, and creative storytelling intersect daily.
                  </p>
                </div>

                {/* Asymmetric composition: 1 Large Landscape (3.jpeg) on top */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => openLightboxAt(galleryItems[0], e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightboxAt(galleryItems[0], e);
                    }
                  }}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
                    <img
                      src={galleryItems[0].src}
                      alt={galleryItems[0].alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                        {galleryItems[0].orderNumber} / 10
                      </span>
                      <span className="text-xs uppercase tracking-wider text-neutral-300 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md hidden sm:inline-block">
                        {galleryItems[0].categoryLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
                          {galleryItems[0].title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2">
                          {galleryItems[0].caption}
                        </p>
                      </div>
                      <span className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-orange-600 text-white flex items-center justify-center transition-colors shrink-0 ml-4 backdrop-blur-md">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Staggered Vertical Pair: 1.jpeg (Marketing Hub) & 8.jpeg (Room Vertical) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
                  {/* Left Column: 1.jpeg with Story card */}
                  <div className="md:col-span-6 flex flex-col space-y-4">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => openLightboxAt(galleryItems[1], e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightboxAt(galleryItems[1], e);
                        }
                      }}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden">
                        <img
                          src={galleryItems[1].src}
                          alt={galleryItems[1].alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                            {galleryItems[1].orderNumber} / 10
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                            {galleryItems[1].title}
                          </h3>
                          <p className="text-xs text-neutral-300 line-clamp-2">
                            {galleryItems[1].caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Editorial Note + 8.jpeg offset */}
                  <div className="md:col-span-6 flex flex-col space-y-6 md:pt-10">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-neutral-300">
                      <span className="text-[11px] font-mono uppercase text-orange-500 font-bold tracking-widest block mb-2">
                        Studio Philosophy
                      </span>
                      <p className="text-sm sm:text-base leading-relaxed italic text-white/90">
                        "Great digital outcomes are built in thoughtful spaces. Our studio is designed to give developers, marketers, and designers room to brainstorm, execute, and collaborate without friction."
                      </p>
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => openLightboxAt(galleryItems[8], e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightboxAt(galleryItems[8], e);
                        }
                      }}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden">
                        <img
                          src={galleryItems[8].src}
                          alt={galleryItems[8].alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                            {galleryItems[8].orderNumber} / 10
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                            {galleryItems[8].title}
                          </h3>
                          <p className="text-xs text-neutral-300 line-clamp-2">
                            {galleryItems[8].caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* -------------------------------------------------------------
                  CHAPTER 02: In-House Media & Chroma Studio (5.jpeg)
                  ------------------------------------------------------------- */}
              <section aria-labelledby="chapter-02-heading" className="space-y-6 sm:space-y-8">
                <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                      Chapter 02 · Media Production Lab
                    </span>
                    <h2 id="chapter-02-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Chroma Studio & Commercial Media Suite
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                    Professional LED arrays, chroma green keying, and camera gear powering video advertisements and brand shoots.
                  </p>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => openLightboxAt(galleryItems[2], e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightboxAt(galleryItems[2], e);
                    }
                  }}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 bg-[#07120e] shadow-[0_20px_50px_rgba(4,120,87,0.15)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                    <img
                      src={galleryItems[2].src}
                      alt={galleryItems[2].alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
                        {galleryItems[2].orderNumber} / 10
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/60 border border-white/10 text-white backdrop-blur-md">
                        In-House Studio Rig
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between">
                      <div className="max-w-2xl">
                        <span className="text-xs text-emerald-400 font-mono tracking-wider block mb-1">
                          Simpex LED Rigging · Chroma Cyclorama
                        </span>
                        <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-2">
                          {galleryItems[2].title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                          {galleryItems[2].caption}
                        </p>
                      </div>

                      <span className="w-11 h-11 rounded-full bg-emerald-600/80 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shrink-0 ml-4 backdrop-blur-md">
                        <Maximize2 className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* -------------------------------------------------------------
                  CHAPTER 03: Executive Leadership & Consultation (9, 6, 7)
                  ------------------------------------------------------------- */}
              <section aria-labelledby="chapter-03-heading" className="space-y-8 sm:space-y-10">
                <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-500 uppercase tracking-widest block mb-1">
                      Chapter 03 · Leadership & Consultation
                    </span>
                    <h2 id="chapter-03-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Executive Spaces & Client Discovery
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                    Private discussion cabins, natural pine wood suites, and comfortable consultation lounges for confidential client engagements.
                  </p>
                </div>

                {/* Asymmetric 3-Item Layout: Left large portrait (9.jpeg), Right stacked (6.jpeg & 7.jpeg) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                  
                  {/* Left: Founder's Cabin (9.jpeg) - Spans 5 columns */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openLightboxAt(galleryItems[3], e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxAt(galleryItems[3], e);
                      }
                    }}
                    className="md:col-span-5 group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 flex flex-col"
                  >
                    <div className="relative aspect-[2/3] md:h-full w-full overflow-hidden flex-1">
                      <img
                        src={galleryItems[3].src}
                        alt={galleryItems[3].alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                          {galleryItems[3].orderNumber} / 10
                        </span>
                        <span className="text-[11px] font-semibold text-white px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
                          Leadership
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                          {galleryItems[3].title}
                        </h3>
                        <p className="text-xs text-neutral-300">
                          {galleryItems[3].caption}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stacked (6.jpeg Portrait & 7.jpeg Landscape) - Spans 7 columns */}
                  <div className="md:col-span-7 flex flex-col space-y-6 sm:space-y-8 justify-between">
                    {/* Top: 7.jpeg (Landscape meeting desk) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => openLightboxAt(galleryItems[7], e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightboxAt(galleryItems[7], e);
                        }
                      }}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <img
                          src={galleryItems[7].src}
                          alt={galleryItems[7].alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                            {galleryItems[7].orderNumber} / 10
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                          <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                            {galleryItems[7].title}
                          </h3>
                          <p className="text-xs text-neutral-300 line-clamp-2">
                            {galleryItems[7].caption}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: 6.jpeg (Portrait consultation sofa) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => openLightboxAt(galleryItems[5], e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightboxAt(galleryItems[5], e);
                        }
                      }}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                        <img
                          src={galleryItems[5].src}
                          alt={galleryItems[5].alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                            {galleryItems[5].orderNumber} / 10
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                          <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                            {galleryItems[5].title}
                          </h3>
                          <p className="text-xs text-neutral-300 line-clamp-2">
                            {galleryItems[5].caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* -------------------------------------------------------------
                  CHAPTER 04: Cultural Heritage & Spatial Architecture (4, 2, 10)
                  ------------------------------------------------------------- */}
              <section aria-labelledby="chapter-04-heading" className="space-y-8 sm:space-y-10">
                <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block mb-1">
                      Chapter 04 · Heritage & Architecture
                    </span>
                    <h2 id="chapter-04-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Guiding Spirit & Architectural Perspective
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                    The values that define our perseverance, anchored by foundational cultural inspiration and clean physical design.
                  </p>
                </div>

                {/* Cultural Wall (4.jpeg) Centerpiece */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => openLightboxAt(galleryItems[4], e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightboxAt(galleryItems[4], e);
                    }
                  }}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/25 hover:border-amber-500/50 transition-all duration-300 bg-[#120f0a] shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                    <img
                      src={galleryItems[4].src}
                      alt={galleryItems[4].alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300 backdrop-blur-md">
                        {galleryItems[4].orderNumber} / 10
                      </span>
                      <span className="text-xs font-semibold text-white px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
                        Vision & Motto
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          {galleryItems[4].title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-300">
                          {galleryItems[4].caption}
                        </p>
                      </div>

                      <span className="w-10 h-10 rounded-full bg-amber-600/80 hover:bg-amber-500 text-white flex items-center justify-center transition-colors shrink-0 ml-4 backdrop-blur-md">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Duo: 2.jpeg (Corridor) & 10.jpeg (Tech station detail) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* 2.jpeg (Corridor) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openLightboxAt(galleryItems[6], e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxAt(galleryItems[6], e);
                      }
                    }}
                    className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <div className="relative aspect-[3/4] sm:aspect-[2/3] w-full overflow-hidden">
                      <img
                        src={galleryItems[6].src}
                        alt={galleryItems[6].alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                          {galleryItems[6].orderNumber} / 10
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {galleryItems[6].title}
                        </h3>
                        <p className="text-xs text-neutral-300 line-clamp-2">
                          {galleryItems[6].caption}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 10.jpeg (Hardware & Tech Station) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openLightboxAt(galleryItems[9], e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxAt(galleryItems[9], e);
                      }
                    }}
                    className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <div className="relative aspect-[3/4] sm:aspect-[2/3] w-full overflow-hidden">
                      <img
                        src={galleryItems[9].src}
                        alt={galleryItems[9].alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                          {galleryItems[9].orderNumber} / 10
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {galleryItems[9].title}
                        </h3>
                        <p className="text-xs text-neutral-300 line-clamp-2">
                          {galleryItems[9].caption}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          ) : (
            /* When a specific category is filtered: Clean Responsive Editorial Masonry */
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm font-semibold text-neutral-300">
                  Showing {filteredItems.length} frame{filteredItems.length === 1 ? '' : 's'} in{' '}
                  <span className="text-orange-400">
                    {galleryCategories.find((c) => c.key === activeCategory)?.label}
                  </span>
                </span>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  View All Frames (10)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openLightboxAt(item, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxAt(item, e);
                      }
                    }}
                    className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0f17] hover:border-orange-500/40 transition-all duration-300 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <div
                      className={`relative w-full overflow-hidden ${
                        item.aspectRatio === 'landscape' ? 'aspect-[16/10]' : 'aspect-[2/3]'
                      }`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15 text-orange-400 backdrop-blur-md">
                          {item.orderNumber} / 10
                        </span>
                        <span className="text-[11px] font-semibold text-neutral-300 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
                          {item.categoryLabel}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-neutral-300 line-clamp-2">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          SECTION 4: CALL TO ACTION SECTION
          ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#080a0f] border-t border-neutral-800/80 overflow-hidden select-none">
        <div className="max-w-[1240px] mx-auto text-center relative z-10">
          <BlurFadeIn delay={0.1} duration={0.5}>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3 block">
              ENGAGE WITH OUR TEAM
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Experience DKP Innovations in Person
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 mb-8 leading-relaxed">
              Whether you are planning a technology deployment, enterprise branding initiative, or seeking to join our engineering and creative team, our studio doors are always open.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(234,88,12,0.4)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.6)] transition-all duration-200 cursor-pointer"
              >
                <span>Start a Project Consultation</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('careers')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
              >
                <span>Explore Open Careers</span>
              </button>
            </div>
          </BlurFadeIn>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FOOTER
          ========================================================================= */}
      <Footer />

      {/* =========================================================================
          INTERACTIVE FULLSCREEN LIGHTBOX MODAL
          ========================================================================= */}
      <GalleryLightbox
        isOpen={isLightboxOpen}
        currentIndex={activeLightboxIndex}
        items={galleryItems}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIndex) => setActiveLightboxIndex(newIndex)}
        triggerElement={triggerEl}
      />
    </div>
  );
};
