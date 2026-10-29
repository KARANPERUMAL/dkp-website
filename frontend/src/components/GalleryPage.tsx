import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { useNavigation } from '../context/NavigationContext';
import { galleryItems, type GalleryItem } from '../data/galleryData';
import { GalleryLightbox } from './gallery/GalleryLightbox';
import {
  TextAnimationBlurFadeIn,
  BlurFadeIn,
} from '@/components/ui/text-animation-blur-fade-in';

// Ordered gallery archive to precisely fulfill the hand-drawn sketch composition
const CURATED_ORDER_IDS = [
  'studio-panorama', // 0: Full-width Hero landscape (3.jpeg)
  // Left Column
  'digital-marketing-hub', // 1: Medium portrait (1.jpeg)
  'chroma-production-studio', // 2: Smaller landscape 1 (5.jpeg)
  'inspirational-cultural-mural', // 3: Smaller landscape 2 (4.jpeg)
  // Right Column
  'strategy-meeting-desk', // 4: Small landscape near top (7.jpeg)
  'executive-director-cabin', // 5: Larger portrait in middle (9.jpeg)
  'consultation-lounge', // 6: Large landscape near bottom (6.jpeg)
  // Extended Archive (revealed on Load More)
  'corridor-and-suites', // 7: Studio corridor portrait (2.jpeg)
  'workspace-vertical-depth', // 8: Workspace vertical architecture (8.jpeg)
  'hardware-and-marketing-desk', // 9: Tech setup detail (10.jpeg)
];

interface ColumnSlotConfig {
  item: GalleryItem;
  globalIndex: number;
  aspectClass: string;
}

export const GalleryPage = () => {
  const { navigateTo } = useNavigation();
  const prefersReducedMotion = useReducedMotion();

  // Curate existing items in intentional order
  const curatedGalleryItems: GalleryItem[] = useMemo(() => {
    const itemMap = new Map(galleryItems.map((item) => [item.id, item]));
    const ordered: GalleryItem[] = [];

    for (const id of CURATED_ORDER_IDS) {
      const found = itemMap.get(id);
      if (found) {
        ordered.push(found);
        itemMap.delete(id);
      }
    }

    for (const remaining of itemMap.values()) {
      ordered.push(remaining);
    }

    return ordered;
  }, []);

  // First full-width hero image
  const heroItem = curatedGalleryItems[0];

  // Progressive discovery state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  const openLightboxAt = (index: number, e?: React.MouseEvent | React.KeyboardEvent) => {
    setActiveLightboxIndex(index);
    if (e?.currentTarget instanceof HTMLElement) {
      setTriggerEl(e.currentTarget);
    }
    setIsLightboxOpen(true);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsExpanded(true);
      setIsLoadingMore(false);
    }, 120);
  };

  // Two-column layout mappings directly matching the reference sketch:
  // Left Column:
  // 1. Medium portrait
  // 2. Smaller landscape (stacked)
  // 3. Smaller landscape (stacked)
  // (Extended on Load More: corridor portrait + tech detail)
  const leftColumnItems: ColumnSlotConfig[] = useMemo(() => {
    const base: ColumnSlotConfig[] = [
      { item: curatedGalleryItems[1], globalIndex: 1, aspectClass: 'aspect-[4/5]' },
      { item: curatedGalleryItems[2], globalIndex: 2, aspectClass: 'aspect-[16/10]' },
      { item: curatedGalleryItems[3], globalIndex: 3, aspectClass: 'aspect-[16/10]' },
    ];
    if (isExpanded) {
      if (curatedGalleryItems[7]) {
        base.push({ item: curatedGalleryItems[7], globalIndex: 7, aspectClass: 'aspect-[4/5]' });
      }
      if (curatedGalleryItems[9]) {
        base.push({ item: curatedGalleryItems[9], globalIndex: 9, aspectClass: 'aspect-[16/10]' });
      }
    }
    return base;
  }, [curatedGalleryItems, isExpanded]);

  // Right Column:
  // 1. Small landscape near top
  // 2. Larger portrait in middle
  // 3. Large landscape near bottom
  // (Extended on Load More: studio architecture portrait)
  const rightColumnItems: ColumnSlotConfig[] = useMemo(() => {
    const base: ColumnSlotConfig[] = [
      { item: curatedGalleryItems[4], globalIndex: 4, aspectClass: 'aspect-[16/9]' },
      { item: curatedGalleryItems[5], globalIndex: 5, aspectClass: 'aspect-[3/4]' },
      { item: curatedGalleryItems[6], globalIndex: 6, aspectClass: 'aspect-[16/10]' },
    ];
    if (isExpanded) {
      if (curatedGalleryItems[8]) {
        base.push({ item: curatedGalleryItems[8], globalIndex: 8, aspectClass: 'aspect-[3/4]' });
      }
    }
    return base;
  }, [curatedGalleryItems, isExpanded]);

  return (
    <div className="min-h-screen bg-[#000122] text-white flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#000122]">
      {/* Floating Centered Navigation */}
      <Navbar />

      {/* =========================================================================
          EDITORIAL HEADER SECTION
          Minimal, quiet luxury presentation with natural description placement
          ========================================================================= */}
      <header className="relative w-full pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
        {/* Subtle Ambient Light */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute left-1/2 -top-[20%] -translate-x-1/2 w-[680px] h-[340px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 214, 10, 0.12) 0%, rgba(255, 214, 10, 0.02) 50%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto text-center">
          {/* Subtitle / Description */}
          <TextAnimationBlurFadeIn
            as="p"
            delay={0.1}
            duration={0.5}
            className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD5E1] font-light leading-relaxed"
          >
            An editorial archive of our Bangalore workspaces, creative labs, and production suites where engineering meets brand strategy.
          </TextAnimationBlurFadeIn>
        </div>
      </header>

      {/* =========================================================================
          MAIN GALLERY LAYOUT (MATCHING REFERENCE SKETCH)
          1. First Row: Large full-width horizontal lead image
          2. Below: Two-column asymmetrical staggered composition
          ========================================================================= */}
      <main className="relative w-full pb-14 sm:pb-20 md:pb-24 px-4 sm:px-8 lg:px-12 flex-1">
        <div className="max-w-[1240px] mx-auto">
          {/* 1. FIRST ROW: FULL-WIDTH LARGE HORIZONTAL IMAGE */}
          {heroItem && (
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.05 : 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full mb-4 sm:mb-5 md:mb-6"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => openLightboxAt(0, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightboxAt(0, e);
                  }
                }}
                aria-label={`View image: ${heroItem.title}`}
                className="group relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#000122] border border-white/[0.08] hover:border-white/25 transition-colors duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000122]"
              >
                <div className="relative w-full overflow-hidden aspect-[16/10] sm:aspect-[2/1] lg:aspect-[21/9]">
                  <img
                    src={heroItem.src}
                    alt={heroItem.alt}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.02] will-change-transform"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. TWO-COLUMN ASYMMETRICAL GALLERY LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-start">
            {/* LEFT COLUMN: Medium portrait, followed by two stacked smaller landscapes */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full">
              {leftColumnItems.map((slot) => (
                <motion.div
                  key={slot.item.id}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.05 : 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openLightboxAt(slot.globalIndex, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxAt(slot.globalIndex, e);
                      }
                    }}
                    aria-label={`View image: ${slot.item.title}`}
                    className="group relative w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#000122] border border-white/[0.07] hover:border-white/25 transition-colors duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000122]"
                  >
                    <div className={`relative w-full overflow-hidden ${slot.aspectClass}`}>
                      <img
                        src={slot.item.src}
                        alt={slot.item.alt}
                        loading={slot.globalIndex < 4 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] will-change-transform"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT COLUMN: Small landscape near top, larger portrait in middle, large landscape near bottom */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full">
              {rightColumnItems.map((slot) => (
                <motion.div
                  key={slot.item.id}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.05 : 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openLightboxAt(slot.globalIndex, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxAt(slot.globalIndex, e);
                      }
                    }}
                    aria-label={`View image: ${slot.item.title}`}
                    className="group relative w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#000122] border border-white/[0.07] hover:border-white/25 transition-colors duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000122]"
                  >
                    <div className={`relative w-full overflow-hidden ${slot.aspectClass}`}>
                      <img
                        src={slot.item.src}
                        alt={slot.item.alt}
                        loading={slot.globalIndex < 4 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] will-change-transform"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              PROGRESSIVE DISCOVERY: MINIMAL LOAD MORE CONTROL
              ========================================================================= */}
          {!isExpanded && (
            <div className="flex justify-center mt-10 sm:mt-12 md:mt-14">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                aria-label="Load more gallery images"
                className="group inline-flex items-center space-x-3 px-7 py-3 rounded-full border border-white/15 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <span>{isLoadingMore ? 'Loading' : 'Load More'}</span>
                <ArrowDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-y-0.5 transition-all duration-300" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          CONNECT / CALL TO ACTION SECTION
          Refined closing section matching site branding
          ========================================================================= */}
      <section className="relative w-full py-14 sm:py-18 md:py-20 px-4 sm:px-8 lg:px-12 bg-[#000122] border-t border-white/[0.08] overflow-hidden select-none">
        <div className="max-w-[1240px] mx-auto text-center relative z-10">
          <BlurFadeIn delay={0.1} duration={0.5}>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FFD60A] font-medium block mb-3">
              Connect
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Experience DKP Innovations
            </h2>
            <p className="max-w-lg mx-auto text-sm sm:text-base text-neutral-400 font-light mb-6 leading-relaxed">
              Whether you are planning a technology deployment, brand growth initiative, or exploring career opportunities, our studio doors are always open.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#000122] font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(255,214,10,0.3)] hover:shadow-[0_6px_25px_rgba(255,214,10,0.5)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <span>Start Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('careers')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white font-semibold text-xs tracking-wider uppercase border border-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <span>Open Careers</span>
              </button>
            </div>
          </BlurFadeIn>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />

      {/* Minimal Accessible Lightbox */}
      <GalleryLightbox
        isOpen={isLightboxOpen}
        currentIndex={activeLightboxIndex}
        items={curatedGalleryItems}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIndex) => setActiveLightboxIndex(newIndex)}
        triggerElement={triggerEl}
      />
    </div>
  );
};
