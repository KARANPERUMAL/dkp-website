import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { useNavigation } from '../context/NavigationContext';
import { galleryItems, type GalleryItem } from '../data/galleryData';
import { GalleryLightbox } from './gallery/GalleryLightbox';
import {
  TextAnimationBlurFadeIn,
  BlurFadeIn,
} from '@/components/ui/text-animation-blur-fade-in';

// Ordered gallery archive to precisely fulfill the editorial collage composition:
// Top row (2): 3.jpeg (large wide left) + 4.jpeg (tall landscape right)
// Middle row (3): 5.jpeg (square crop left) + 14.jpeg (landscape center) + 9.jpeg (portrait right)
// Third row (3): 13.jpeg (portrait left) + 6.jpeg (portrait center) + 12.png (portrait right)
// Fourth row (4): 7.jpeg (landscape left) + 1.jpeg (portrait) + 2.jpeg (portrait) + 15.jpeg (portrait)
// Fifth row (3): 8.jpeg (portrait left) + 11.png (landscape center) + 10.jpeg (portrait right)
const CURATED_COLLAGE_IDS = [
  // Top Row (2 images) — Preserved exact original positions
  'studio-panorama', // Slot 0: 3.jpeg (Landscape, large wide left)
  'inspirational-cultural-mural', // Slot 1: 4.jpeg (Landscape, tall landscape right)

  // Middle Row (3 images) — Balanced production, collaborative workbench, leadership suite
  'chroma-production-studio', // Slot 2: 5.jpeg (Chroma green studio cropped to square 1:1, left)
  'advertising-and-creative-bench', // Slot 3: 14.jpeg (Landscape, advertising & web bench center)
  'executive-director-cabin', // Slot 4: 9.jpeg (Portrait, pine wood executive cabin right)

  // Third Row (3 images) — Tech workspace, golden lounge, glass tower elevation
  'digital-marketing-growth-lab', // Slot 5: 13.jpeg (Portrait, digital marketing team desk left)
  'consultation-lounge', // Slot 6: 6.jpeg (Portrait, gold sofa consultation lounge center)
  'corporate-tower-elevation', // Slot 7: 12.png (Portrait, blue glass tower elevation right)

  // Fourth Row (4 images) — Meeting desk & greenery, dual-screen marketing, corridor, IT coding
  'strategy-meeting-desk', // Slot 8: 7.jpeg (Landscape, strategy desk & plant left)
  'digital-marketing-hub', // Slot 9: 1.jpeg (Portrait, dual-screen marketing workstation)
  'corridor-and-suites', // Slot 10: 2.jpeg (Portrait, polished wood floor corridor)
  'it-solutions-engineering-desk', // Slot 11: 15.jpeg (Portrait, IT solutions coding desk)

  // Fifth Row — Architectural ceiling, corporate building facade, tech hardware (3 images)
  'workspace-vertical-depth', // Slot 12: 8.jpeg (Portrait, studio elevation & wood ceiling left)
  'nagadevanahalli-corporate-facade', // Slot 13: 11.png (Landscape, corporate facade center)
  'hardware-and-marketing-desk', // Slot 14: 10.jpeg (Portrait, keyboard & tech hardware right)
];

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  aspectClass?: string;
  eager?: boolean;
  objectPosition?: string;
  onOpen: (index: number, e?: React.MouseEvent | React.KeyboardEvent) => void;
  className?: string;
}

const GalleryCard = ({
  item,
  index,
  aspectClass = 'aspect-[16/10]',
  eager = false,
  objectPosition = 'object-center',
  onOpen,
  className = '',
}: GalleryCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: prefersReducedMotion ? 0.05 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`w-full ${className}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => onOpen(index, e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(index, e);
          }
        }}
        aria-label={`View image: ${item.title}`}
        className="group relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#003E6D] border border-white/[0.2] hover:border-white/50 transition-all duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#004D86]"
      >
        <div className={`relative w-full h-full overflow-hidden ${aspectClass}`}>
          <img
            src={item.src}
            alt={item.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={`w-full h-full object-cover ${objectPosition} transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] will-change-transform`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const GalleryPage = () => {
  const { navigateTo } = useNavigation();

  // Curate all 15 items in intentional editorial order
  const curatedGalleryItems: GalleryItem[] = useMemo(() => {
    const itemMap = new Map(galleryItems.map((item) => [item.id, item]));
    const ordered: GalleryItem[] = [];

    for (const id of CURATED_COLLAGE_IDS) {
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

  return (
    <div className="min-h-screen bg-[#004D86] text-white flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#002244]">
      {/* Floating Centered Navigation */}
      <Navbar />

      {/* =========================================================================
          EDITORIAL HEADER SECTION
          Minimal, quiet luxury presentation with natural description placement
          ========================================================================= */}
      <header className="relative w-full pt-28 sm:pt-32 md:pt-28 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
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
          MAIN GALLERY LAYOUT (MATCHING REFERENCE EDITORIAL COLLAGE)
          Tier 1: Top row (2 images: large wide left, tall landscape right)
          Tier 2: Middle row (3 images: small square left, larger rectangular center, narrow vertical right)
          Tier 3: Third row (3 images: three portrait-oriented images arranged side by side)
          Tier 4: Fourth row (4 images: wide corporate facade left + vertical triptych right)
          Tier 5: Fifth row (3 images: digital marketing portrait left, advertising landscape center, IT solutions portrait right)
          All 15 images visible directly on the page without omission or duplication
          ========================================================================= */}
      <main className="relative w-full pb-14 sm:pb-20 md:pb-24 px-4 sm:px-8 lg:px-12 flex-1">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-4 sm:gap-5 md:gap-6">
          {/* ---------------------------------------------------------------------
              TIER 1 — TOP ROW (2 IMAGES)
              Large wide image on the left, tall landscape-oriented image on the right
              --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-stretch">
            {/* Left: Large wide image (Slot 0, 3.jpeg) */}
            {curatedGalleryItems[0] && (
              <div className="col-span-12 md:col-span-7 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[0]}
                  index={0}
                  aspectClass="aspect-[16/10]"
                  eager
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}

            {/* Right: Tall landscape-oriented image (Slot 1, 4.jpeg) */}
            {curatedGalleryItems[1] && (
              <div className="col-span-12 md:col-span-5 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[1]}
                  index={1}
                  aspectClass="aspect-[4/3] md:aspect-auto"
                  eager
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------------------
              TIER 2 — MIDDLE ROW (3 IMAGES)
              Small square image on the left, larger rectangular image in center,
              and narrow vertical image on the right
              --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-stretch">
            {/* Left: Small square image (Slot 2, 5.jpeg) */}
            {curatedGalleryItems[2] && (
              <div className="col-span-12 sm:col-span-3 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[2]}
                  index={2}
                  aspectClass="aspect-square"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}

            {/* Center: Larger rectangular image (Slot 3, 14.jpeg) */}
            {curatedGalleryItems[3] && (
              <div className="col-span-12 sm:col-span-6 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[3]}
                  index={3}
                  aspectClass="aspect-[16/10]"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}

            {/* Right: Narrow vertical image (Slot 4, 9.jpeg) */}
            {curatedGalleryItems[4] && (
              <div className="col-span-12 sm:col-span-3 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[4]}
                  index={4}
                  aspectClass="aspect-[3/4]"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------------------
              TIER 3 — BOTTOM ROW (3 IMAGES)
              Wide gallery composition containing three portrait-oriented images
              arranged side by side
              --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-stretch">
            {/* Left: Portrait 1 (Slot 5, 13.jpeg) */}
            {curatedGalleryItems[5] && (
              <div className="col-span-1 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[5]}
                  index={5}
                  aspectClass="aspect-[3/4]"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}

            {/* Center: Portrait 2 (Slot 6, 6.jpeg) */}
            {curatedGalleryItems[6] && (
              <div className="col-span-1 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[6]}
                  index={6}
                  aspectClass="aspect-[3/4]"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}

            {/* Right: Portrait 3 (Slot 7, 12.png) */}
            {curatedGalleryItems[7] && (
              <div className="col-span-1 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[7]}
                  index={7}
                  aspectClass="aspect-[3/4]"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------------------
              TIER 4 — ADDITIONAL BALANCED ROW (4 IMAGES)
              Strategy desk on the left, paired with a vertical triptych on the right
              --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-stretch">
            {/* Left: Large wide strategy & meeting collaboration desk (Slot 8, 7.jpeg) */}
            {curatedGalleryItems[8] && (
              <div className="col-span-12 md:col-span-6 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[8]}
                  index={8}
                  aspectClass="aspect-[16/10]"
                  objectPosition="object-center"
                  onOpen={openLightboxAt}
                  className="h-full flex-1 min-h-[260px] sm:min-h-[320px] md:min-h-[360px]"
                />
              </div>
            )}

            {/* Right: Three vertical studio portraits side by side (Slots 9, 10, 11) */}
            <div className="col-span-12 md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-stretch">
              {/* 1.jpeg: Digital Marketing & Strategy Workstation */}
              {curatedGalleryItems[9] && (
                <div className="flex flex-col">
                  <GalleryCard
                    item={curatedGalleryItems[9]}
                    index={9}
                    aspectClass="aspect-[3/4] md:aspect-auto"
                    objectPosition="object-center"
                    onOpen={openLightboxAt}
                    className="h-full flex-1 min-h-[260px] sm:min-h-[320px] md:min-h-[360px]"
                  />
                </div>
              )}

              {/* 2.jpeg: Central Corridor & Architectural Layout */}
              {curatedGalleryItems[10] && (
                <div className="flex flex-col">
                  <GalleryCard
                    item={curatedGalleryItems[10]}
                    index={10}
                    aspectClass="aspect-[3/4] md:aspect-auto"
                    objectPosition="object-center"
                    onOpen={openLightboxAt}
                    className="h-full flex-1 min-h-[260px] sm:min-h-[320px] md:min-h-[360px]"
                  />
                </div>
              )}

              {/* 15.jpeg: IT & Digital Solutions Engineering Station */}
              {curatedGalleryItems[11] && (
                <div className="flex flex-col">
                  <GalleryCard
                    item={curatedGalleryItems[11]}
                    index={11}
                    aspectClass="aspect-[3/4] md:aspect-auto"
                    objectPosition="object-center"
                    onOpen={openLightboxAt}
                    className="h-full flex-1 min-h-[260px] sm:min-h-[320px] md:min-h-[360px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              TIER 5 — ARCHITECTURAL CEILING, CORPORATE FACADE & TECH DESK (3 IMAGES)
              Editorial triptych presenting images 8, 11, and 10:
              Left: Studio Elevation & Workspace Architecture (Slot 12, 8.jpeg, portrait)
              Center: DKP Innovations Corporate Facade & Branch (Slot 13, 11.png, landscape)
              Right: Creative Technology & Development Setup (Slot 14, 10.jpeg, portrait)
              --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-stretch">
            {/* Left: Studio Elevation & Workspace Architecture (Slot 12, 8.jpeg) */}
            {curatedGalleryItems[12] && (
              <div className="col-span-12 sm:col-span-3 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[12]}
                  index={12}
                  aspectClass="aspect-[3/4]"
                  objectPosition="object-center"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}

            {/* Center: DKP Innovations Corporate Facade & Branch (Slot 13, 11.png) */}
            {curatedGalleryItems[13] && (
              <div className="col-span-12 sm:col-span-6 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[13]}
                  index={13}
                  aspectClass="aspect-[16/10]"
                  objectPosition="object-center"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}

            {/* Right: Creative Technology & Development Setup (Slot 14, 10.jpeg) */}
            {curatedGalleryItems[14] && (
              <div className="col-span-12 sm:col-span-3 flex flex-col">
                <GalleryCard
                  item={curatedGalleryItems[14]}
                  index={14}
                  aspectClass="aspect-[3/4]"
                  objectPosition="object-center"
                  onOpen={openLightboxAt}
                  className="h-full flex-1"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =========================================================================
          CONNECT / CALL TO ACTION SECTION
          Refined closing section matching site branding
          ========================================================================= */}
      <section className="relative w-full py-14 sm:py-18 md:py-20 px-4 sm:px-8 lg:px-12 bg-[#004D86] border-t border-white/[0.2] overflow-hidden select-none">
        <div className="max-w-[1240px] mx-auto text-center relative z-10">
          <BlurFadeIn delay={0.1} duration={0.5}>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FFD60A] font-medium block mb-3">
              Connect
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Experience DKP Innovations
            </h2>
            <p className="max-w-lg mx-auto text-sm sm:text-base text-neutral-100 font-light mb-6 leading-relaxed">
              Whether you are planning a technology deployment, brand growth initiative, or exploring career opportunities, our studio doors are always open.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(255,214,10,0.3)] hover:shadow-[0_6px_25px_rgba(255,214,10,0.5)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
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
