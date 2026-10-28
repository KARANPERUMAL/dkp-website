import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
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

    // Auto-focus the close button for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      // Restore focus to triggering thumbnail
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

  // Keyboard controls: Escape, ArrowLeft, ArrowRight
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

  const currentDisplayNumber = String(currentIndex + 1).padStart(2, '0');
  const totalDisplayNumber = String(items.length).padStart(2, '0');

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
          transition={{ duration: prefersReducedMotion ? 0.05 : 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/95 backdrop-blur-2xl select-none"
        >
          {/* Top Control Bar */}
          <header
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 z-20 border-b border-white/10 bg-black/40 backdrop-blur-md"
          >
            {/* Left: Counter and Category */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-xs sm:text-sm font-mono font-bold text-orange-500 tracking-wider">
                {currentDisplayNumber} <span className="text-white/40">/</span> {totalDisplayNumber}
              </span>
              <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                {currentItem.categoryLabel}
              </span>
            </div>

            {/* Center: Title on medium+ screens */}
            <div className="hidden md:flex items-center space-x-2 text-center max-w-md truncate">
              <span className="text-sm font-semibold text-white truncate">
                {currentItem.title}
              </span>
            </div>

            {/* Right: Controls & Close */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-neutral-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hidden sm:inline-block">
                {currentItem.width} × {currentItem.height}
              </span>

              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close image viewer (Press Escape)"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-orange-600 text-white transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Center: Main Image Viewport with Previous & Next navigation */}
          <div
            onClick={onClose}
            className="relative flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 min-h-0 overflow-hidden"
          >
            {/* Previous Button */}
            {items.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image (Left Arrow)"
                className="absolute left-2 sm:left-4 md:left-6 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-orange-600 text-white border border-white/15 flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {items.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image (Right Arrow)"
                className="absolute right-2 sm:right-4 md:right-6 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-orange-600 text-white border border-white/15 flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Active Image Container */}
            <motion.div
              key={currentItem.id}
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.96,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.05 : 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-full max-w-full flex items-center justify-center"
            >
              <img
                src={currentItem.src}
                alt={currentItem.alt}
                className="max-h-[72vh] sm:max-h-[76vh] md:max-h-[78vh] w-auto max-w-[92vw] sm:max-w-[88vw] object-contain rounded-xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/15 ring-1 ring-white/10"
              />
            </motion.div>
          </div>

          {/* Bottom Caption & Details Bar */}
          <footer
            onClick={(e) => e.stopPropagation()}
            className="w-full z-20 px-4 sm:px-8 py-4 sm:py-5 border-t border-white/10 bg-black/60 backdrop-blur-md"
          >
            <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {currentItem.title}
                  </span>
                  <span className="text-xs text-orange-500 font-semibold sm:hidden">
                    · {currentItem.categoryLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal max-w-3xl">
                  {currentItem.caption}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs text-neutral-400 whitespace-nowrap self-end sm:self-center">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{currentItem.location}</span>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
