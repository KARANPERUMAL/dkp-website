import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '../../data/galleryData';

interface GalleryLightboxProps {
  isOpen: boolean;
  currentIndex: number;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  triggerElement?: HTMLElement | null;
}

export const GalleryLightbox = ({
  isOpen,
  currentIndex,
  items,
  onClose,
  onNavigate,
  triggerElement,
}: GalleryLightboxProps) => {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const currentItem = items[currentIndex];

  // Prevent background body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      triggerElement?.focus();
    };
  }, [isOpen, triggerElement]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIndex);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(nextIndex);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${currentItem.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#003E6D]/95 backdrop-blur-2xl select-none"
        >
          {/* Top Bar: Minimal and uncluttered */}
          <header
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-between px-6 sm:px-10 py-5 z-20"
          >
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/90">
              {currentItem.title}
            </div>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              type="button"
              aria-label="Close image viewer"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.12] hover:bg-white/25 text-white/90 hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Main Viewport */}
          <div
            onClick={onClose}
            className="relative flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0 overflow-hidden"
          >
            {/* Previous Button */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-4 sm:left-8 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#004D86]/80 hover:bg-[#00345C] text-white/90 hover:text-white border border-white/25 flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-4 sm:right-8 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#004D86]/80 hover:bg-[#00345C] text-white/90 hover:text-white border border-white/25 flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Centered Image */}
            <motion.div
              key={currentItem.id}
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.98,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.05 : 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-full max-w-full flex items-center justify-center"
            >
              <img
                src={currentItem.src}
                alt={currentItem.alt}
                width={currentItem.width}
                height={currentItem.height}
                decoding="async"
                className="max-h-[78vh] sm:max-h-[82vh] w-auto max-w-[90vw] object-contain rounded-lg sm:rounded-xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-white/10"
              />
            </motion.div>
          </div>

          {/* Minimal Bottom Bar */}
          <footer
            onClick={(e) => e.stopPropagation()}
            className="w-full z-20 px-6 sm:px-10 py-5 text-center"
          >
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
              {currentItem.caption}
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
