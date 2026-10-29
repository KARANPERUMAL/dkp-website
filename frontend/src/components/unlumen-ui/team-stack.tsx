"use client";

import * as React from "react";
import {
  motion,
  type MotionStyle,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { serviceCategories } from "@/data/servicesData";
import { TextAnimationBlurFadeIn } from "@/components/ui/text-animation-blur-fade-in";

export interface TeamCardItem {
  name: string;
  role: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  isFeatured?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  slug?: string;
}

export interface TeamStackProps {
  items?: TeamCardItem[];
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
  defaultActiveIndex?: number;
  onCardClick?: (card: TeamCardItem, index: number) => void;
}

const ctaLabels: Record<string, string> = {
  "technology-solutions": "Explore IT",
  "digital-marketing-and-lead-generation": "Explore Growth",
  "branding-pr-and-influencer-marketing": "Explore Branding",
  "creative-production-and-advertising": "Explore Production",
  "business-registration-and-corporate-compliance": "Explore Compliance",
};

// Authoritative DKP Innovation service data representing the five core capabilities in exact order
export const defaultDkpServices: TeamCardItem[] = serviceCategories.map((cat, idx) => ({
  name: cat.title,
  role: cat.subtitle,
  description: cat.description,
  imageSrc: cat.titleCardImage,
  imageAlt: cat.titleCardAlt,
  isFeatured: idx === 0,
  ctaLabel: ctaLabels[cat.slug] || `Explore ${cat.title}`,
  ctaHref: `#services-${cat.slug}`,
  slug: cat.slug,
}));

// Deterministic jitter function for natural card-pile aesthetics
function pseudoRandom(i: number, amplitude: number, seed: number): number {
  const r = 43758.5453 * Math.sin((i + 1) * 12.9898 + 78.233 * seed);
  return (2 * (r - Math.floor(r)) - 1) * amplitude;
}

interface TeamMemberCardProps {
  card: TeamCardItem;
  index: number;
  total: number;
  isExpanded: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isActive: boolean;
  onActivate: (index: number) => void;
  onExpand: () => void;
  onCardClick?: (card: TeamCardItem, index: number) => void;
}

function TeamMemberCard({
  card,
  index,
  total,
  isExpanded,
  isMobile,
  isTablet,
  isActive,
  onActivate,
  onExpand,
  onCardClick,
}: TeamMemberCardProps) {
  const [isCardHovered, setIsCardHovered] = React.useState(false);
  const [isCtaHovered, setIsCtaHovered] = React.useState(false);
  const ctaLabelRef = React.useRef<HTMLSpanElement>(null);
  const [ctaWidth, setCtaWidth] = React.useState(124);

  const isHighlighted = isCardHovered || (isMobile && isActive);
  const showCta = isHighlighted || isCtaHovered;
  const hasCta = Boolean(card.ctaHref || card.slug || onCardClick);
  const ctaLabel = card.ctaLabel || `View ${card.name}`;
  const isDark = isActive || (Boolean(card.isFeatured) && !isActive);

  // Measure CTA label width for spring expand pill
  React.useLayoutEffect(() => {
    if (ctaLabelRef.current) {
      setCtaWidth(Math.ceil(ctaLabelRef.current.scrollWidth + 50));
    }
  }, [ctaLabel]);

  // Spread coordinates dynamically adapted to card count and viewport
  const spreadCoordinates = React.useMemo(() => {
    if (total === 4) {
      if (isMobile) {
        return {
          x: [-2.2, -0.7, 0.7, 2.2][index],
          y: [0.6, -0.6, -0.6, 0.6][index],
          rotate: [-7, -2.5, 2.5, 7][index],
        };
      }
      if (isTablet) {
        return {
          x: [-12.5, -4.2, 4.2, 12.5][index],
          y: [1.2, -1.8, -1.8, 1.2][index],
          rotate: [-11, -3.5, 3.5, 11][index],
        };
      }
      // Desktop
      return {
        x: [-18.5, -6.2, 6.2, 18.5][index],
        y: [1.8, -2.2, -2.2, 1.8][index],
        rotate: [-15, -4.5, 4.5, 15][index],
      };
    }

    if (total === 5) {
      if (isMobile) {
        return {
          x: [-2.8, -1.4, 0, 1.4, 2.8][index],
          y: [0.6, -0.4, -0.8, -0.4, 0.6][index],
          rotate: [-6, -3, 0, 3, 6][index],
        };
      }
      if (isTablet) {
        return {
          x: [-14, -7, 0, 7, 14][index],
          y: [1.5, -0.8, -1.8, -0.8, 1.5][index],
          rotate: [-10, -5, 0, 5, 10][index],
        };
      }
      // Desktop
      return {
        x: [-21, -10.5, 0, 10.5, 21][index],
        y: [2, -1, -2.5, -1, 2][index],
        rotate: [-14, -7, 0, 7, 14][index],
      };
    }

    // Generic calculation for arbitrary card counts
    const centerOffset = index - (total - 1) / 2;
    const scaleFactor = isMobile ? 1.6 : isTablet ? 7.5 : 11.5;
    return {
      x: centerOffset * scaleFactor,
      y: Math.abs(centerOffset) * (isMobile ? 0.5 : 1.2) - (isMobile ? 0 : 2),
      rotate: centerOffset * (isMobile ? 3.5 : 7),
    };
  }, [total, index, isMobile, isTablet]);

  // Collapsed resting jitter position
  const collapsedPosition = React.useMemo(() => {
    const t = Math.floor(index / 2) + 1;
    const n = index % 2 === 0 ? 1 : -1;
    const rx = pseudoRandom(index, 0.15, 1);
    const ry = pseudoRandom(index, 0.1, 2);
    const rRot = pseudoRandom(index, 6, 3);
    return {
      x: n * t * 0.35 + rx,
      y: ry,
      rotate: rRot,
    };
  }, [index]);

  const handleAction = React.useCallback(() => {
    if (onCardClick) {
      onCardClick(card, index);
      return;
    }
    if (card.ctaHref && card.ctaHref.startsWith("#")) {
      const el = document.getElementById(card.ctaHref.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    if (card.ctaHref) {
      window.location.href = card.ctaHref;
    }
  }, [card, index, onCardClick]);

  const handleCardClick = React.useCallback(() => {
    if (isMobile) {
      if (!isExpanded) {
        onExpand();
        onActivate(index);
        return;
      }
      if (isActive) {
        if (hasCta) handleAction();
        return;
      }
      onActivate(index);
      return;
    }
    if (hasCta) handleAction();
  }, [isMobile, isExpanded, isActive, hasCta, handleAction, onExpand, onActivate, index]);

  const targetX = isExpanded
    ? `${spreadCoordinates.x}rem`
    : `${collapsedPosition.x}rem`;
  const targetY = isExpanded
    ? `${spreadCoordinates.y}rem`
    : `${collapsedPosition.y}rem`;
  const targetRotate = isExpanded
    ? `${spreadCoordinates.rotate}deg`
    : `${collapsedPosition.rotate}deg`;

  return (
    <motion.article
      onMouseEnter={isMobile ? undefined : () => setIsCardHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setIsCardHovered(false)}
      onClick={handleCardClick}
      onKeyDown={
        hasCta
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAction();
              }
            }
          : undefined
      }
      tabIndex={hasCta ? 0 : undefined}
      role={hasCta ? "button" : "article"}
      aria-label={`${card.name} - ${card.role}`}
      animate={{
        x: targetX,
        y: targetY,
        rotate: targetRotate,
        scale: isExpanded ? (isHighlighted ? 1.04 : 1) : isHighlighted ? 1 : 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 22,
        mass: 0.55,
      }}
      style={{
        zIndex: isHighlighted ? total + 20 : isDark ? total + 10 : total - index,
      } as MotionStyle}
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "flex flex-col select-none overflow-hidden rounded-3xl border transition-shadow duration-300",
        "w-[15.5rem] sm:w-[17.2rem] lg:w-[18rem]",
        "p-4 sm:p-5",
        isHighlighted
          ? "h-[25.5rem] sm:h-[27.5rem] shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
          : "h-[24.5rem] sm:h-[26.5rem] shadow-[0_10px_28px_rgba(0,0,0,0.08)]",
        isDark
          ? "border-[#FFD60A]/50 bg-[#004D86] text-white"
          : "border-neutral-200/90 bg-white text-neutral-900",
        hasCta ? "cursor-pointer" : ""
      )}
    >
      {/* Floating CTA Pill (Top-Right) */}
      {hasCta && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleAction();
          }}
          onMouseEnter={() => setIsCtaHovered(true)}
          onMouseLeave={() => setIsCtaHovered(false)}
          onFocus={() => setIsCtaHovered(true)}
          onBlur={() => setIsCtaHovered(false)}
          className="group absolute top-4 right-4 sm:top-5 sm:right-5 z-20 inline-flex items-center"
        >
          <span className="sr-only">{ctaLabel}</span>
          <motion.div
            aria-hidden="true"
            animate={{ width: showCta ? ctaWidth : 34 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className={cn(
              "relative inline-flex h-8.5 sm:h-9 items-center justify-end overflow-hidden rounded-full shadow-md transition-colors",
              isDark
                ? "bg-[#FFD60A] text-[#002244] hover:bg-[#FFE047]"
                : "bg-[#004D86] text-white hover:bg-[#FFD60A] hover:text-[#002244]"
            )}
          >
            <motion.span
              ref={ctaLabelRef}
              animate={{
                opacity: showCta ? 1 : 0,
                filter: showCta ? "blur(0px)" : "blur(4px)",
                x: showCta ? 0 : -2,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="pointer-events-none absolute left-3.5 whitespace-nowrap text-[11px] sm:text-xs font-semibold tracking-tight"
            >
              {ctaLabel}
            </motion.span>
            <motion.span
              animate={{ scale: showCta ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="relative flex size-8.5 sm:size-9 items-center justify-center overflow-hidden rounded-full"
            >
              <ArrowUpRight className="size-4 stroke-[2.2]" />
            </motion.span>
          </motion.div>
        </div>
      )}

      {/* Card Image: Official Service Title-Card (Top) */}
      <div
        className={cn(
          "w-full overflow-hidden rounded-2xl border transition-transform duration-300",
          isDark
            ? "border-white/20 bg-[#003E6D]"
            : "border-neutral-200/80 bg-neutral-100",
          isHighlighted ? "scale-[1.01]" : ""
        )}
      >
        <img
          src={card.imageSrc}
          alt={card.imageAlt || card.name}
          loading="lazy"
          className="h-34 sm:h-40 w-full object-cover object-center"
        />
      </div>

      {/* Card Info: Role, Name, Description (Bottom) */}
      <div className="mt-4 sm:mt-5 flex-1 flex flex-col justify-start space-y-1">
        <span
          className={cn(
            "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block",
            isDark ? "text-[#FFD60A]" : "text-[#854D0E]"
          )}
        >
          {card.role}
        </span>
        <h3
          className={cn(
            "text-base sm:text-[1.18rem] font-bold tracking-tight leading-snug transition-colors line-clamp-2",
            isDark ? "text-white" : "text-neutral-900",
            isHighlighted && !isDark ? "text-[#854D0E]" : ""
          )}
        >
          {card.name}
        </h3>
        <p
          className={cn(
            "text-[12px] sm:text-[13px] leading-relaxed line-clamp-3 pt-0.5",
            isDark ? "text-neutral-300" : "text-neutral-600"
          )}
        >
          {card.description}
        </p>
      </div>
    </motion.article>
  );
}

interface MobileServiceCardProps {
  card: TeamCardItem;
  index: number;
  onCardClick?: (card: TeamCardItem, index: number) => void;
  prefersReducedMotion: boolean | null;
}

function MobileServiceCard({
  card,
  index,
  onCardClick,
  prefersReducedMotion,
}: MobileServiceCardProps) {
  const handleAction = React.useCallback(() => {
    if (onCardClick) {
      onCardClick(card, index);
      return;
    }
    if (card.ctaHref && card.ctaHref.startsWith("#")) {
      const el = document.getElementById(card.ctaHref.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    if (card.ctaHref) {
      window.location.href = card.ctaHref;
    }
  }, [card, index, onCardClick]);

  const hasCta = Boolean(card.ctaHref || card.slug || onCardClick);
  const ctaLabel = card.ctaLabel || `Explore ${card.name}`;

  return (
    <motion.article
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px", amount: 0.15 }}
      transition={{
        duration: prefersReducedMotion ? 0.05 : 0.6,
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.08, 0.24),
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={hasCta ? handleAction : undefined}
      onKeyDown={
        hasCta
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAction();
              }
            }
          : undefined
      }
      role={hasCta ? "button" : "article"}
      tabIndex={hasCta ? 0 : undefined}
      aria-label={`${card.name} - ${card.role}`}
      className="group relative flex flex-col w-full bg-white border border-neutral-200/90 hover:border-[#FFD60A] rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(255,214,10,0.18)] transition-all duration-300 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] select-none overflow-hidden"
    >
      {/* Service Image Visual */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 select-none">
        <img
          src={card.imageSrc}
          alt={card.imageAlt || card.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Service Details */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10.5px] font-bold text-[#854D0E] uppercase tracking-wider block mb-1">
            {card.role}
          </span>
          <h3 className="text-lg font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#854D0E] transition-colors mb-2">
            {card.name}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-4">
            {card.description}
          </p>
        </div>

        {/* Explore Button & Counter */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#004D86] text-white text-xs font-semibold group-hover:bg-[#FFD60A] group-hover:text-[#002244] transition-colors shadow-sm">
            <span>{ctaLabel}</span>
            <ArrowUpRight className="size-3.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <span className="text-[11px] font-mono font-medium text-neutral-400">
            0{index + 1}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function TeamStack({
  items = defaultDkpServices,
  title,
  eyebrow,
  description,
  className,
  defaultActiveIndex = 0,
  onCardClick,
}: TeamStackProps) {
  const [isTablet, setIsTablet] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeCard, setActiveCard] = React.useState<number | null>(defaultActiveIndex);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Responsive breakpoint for tablet
  React.useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full overflow-x-clip select-none pt-2 pb-0 sm:pt-4 sm:pb-0",
        className
      )}
    >
      {(eyebrow || title || description) && (
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
          {eyebrow && (
            <TextAnimationBlurFadeIn
              as="span"
              delay={0.05}
              duration={0.4}
              className="text-xs font-bold text-[#854D0E] uppercase tracking-wider mb-2 block"
            >
              {eyebrow}
            </TextAnimationBlurFadeIn>
          )}
          {title && (
            <TextAnimationBlurFadeIn
              as="h2"
              delay={0.12}
              duration={0.5}
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4"
            >
              {title}
            </TextAnimationBlurFadeIn>
          )}
          {description && (
            <TextAnimationBlurFadeIn
              as="p"
              delay={0.22}
              duration={0.5}
              className="text-base sm:text-lg text-neutral-600 leading-relaxed"
            >
              {description}
            </TextAnimationBlurFadeIn>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          MOBILE LAYOUT: Clean vertical list of normal service cards (< 768px)
          ------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-lg mx-auto md:hidden px-1">
        {items.map((card, index) => (
          <MobileServiceCard
            key={card.name}
            card={card}
            index={index}
            onCardClick={onCardClick}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      {/* -------------------------------------------------------------
          DESKTOP & TABLET LAYOUT: Stacked / Fanned Deck (>= 768px)
          ------------------------------------------------------------- */}
      <div
        ref={containerRef}
        className="relative mx-auto hidden md:flex h-[28rem] sm:h-[31rem] lg:h-[32rem] w-full max-w-6xl items-center justify-center"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setActiveCard(defaultActiveIndex);
        }}
      >
        <div className="relative h-[25rem] w-full max-w-5xl sm:h-[28rem]">
          {items.map((card, index) => (
            <TeamMemberCard
              key={card.name}
              card={card}
              index={index}
              total={items.length}
              isExpanded={isExpanded}
              isMobile={false}
              isTablet={isTablet}
              isActive={activeCard === index}
              onActivate={setActiveCard}
              onExpand={() => setIsExpanded(true)}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamStack;
