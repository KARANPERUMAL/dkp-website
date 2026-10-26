"use client";

import * as React from "react";
import {
  motion,
  type MotionStyle,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  onCardClick?: (card: TeamCardItem, index: number) => void;
}

// Authoritative DKP Innovation service data representing the five core capabilities
export const defaultDkpServices: TeamCardItem[] = [
  {
    name: "Digital Marketing & Lead Generation",
    role: "Performance & Growth",
    description:
      "Data-aligned digital marketing, omnichannel campaign management, and search engine optimization structured to expand brand visibility.",
    imageSrc: "/images/services/digital-marketing-and-lead-generation/title-card.jpg",
    imageAlt: "Digital Marketing & Lead Generation at DKP Innovation",
    isFeatured: true,
    ctaLabel: "Explore Growth",
    ctaHref: "#services-digital-marketing-and-lead-generation",
    slug: "digital-marketing-and-lead-generation",
  },
  {
    name: "Web & Digital Engineering",
    role: "Web & Platform Engineering",
    description:
      "Modern websites, web applications, and digital platforms engineered with high performance, accessibility, and conversion focus.",
    imageSrc: "/images/services/technology-solutions/website-design-and-development.jpg",
    imageAlt: "Web & Digital Engineering at DKP Innovation",
    ctaLabel: "Explore Web",
    ctaHref: "#services-technology-solutions",
    slug: "technology-solutions",
  },
  {
    name: "Creative Production & Advertising",
    role: "Visual Storytelling & Media",
    description:
      "Commercial film production, studio and corporate photography, and multimedia advertising developed to express your brand identity.",
    imageSrc: "/images/services/creative-production-and-advertising/title-card.jpg",
    imageAlt: "Creative Production & Advertising at DKP Innovation",
    ctaLabel: "Explore Production",
    ctaHref: "#services-creative-production-and-advertising",
    slug: "creative-production-and-advertising",
  },
  {
    name: "Engineering & Architecture",
    role: "Scalable Systems & Tech",
    description:
      "Scalable e-commerce infrastructure, bespoke web applications, and enterprise search dominance engineered for high conversion.",
    imageSrc: "/images/services/technology-solutions/title-card.jpg",
    imageAlt: "Engineering & Architecture at DKP Innovation",
    ctaLabel: "Explore Tech",
    ctaHref: "#services-technology-solutions",
    slug: "technology-solutions",
  },
  {
    name: "Branding & Business Growth",
    role: "Brand Identity & Stature",
    description:
      "Distinctive visual identity design, national publication press features, celebrity endorsements, and corporate event management.",
    imageSrc: "/images/services/branding-pr-and-influencer-marketing/title-card.jpg",
    imageAlt: "Branding & Business Growth at DKP Innovation",
    ctaLabel: "Explore Branding",
    ctaHref: "#services-branding-pr-and-influencer-marketing",
    slug: "branding-pr-and-influencer-marketing",
  },
];

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
  const isFeatured = Boolean(card.isFeatured);

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
        zIndex: isHighlighted ? total + 20 : total - index,
      } as MotionStyle}
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "flex flex-col select-none overflow-hidden rounded-3xl border transition-shadow duration-300",
        "w-[15.5rem] sm:w-[17.2rem] lg:w-[18rem]",
        "p-4 sm:p-5",
        isHighlighted
          ? "h-[25.5rem] sm:h-[27.5rem] shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
          : "h-[24.5rem] sm:h-[26.5rem] shadow-[0_10px_28px_rgba(0,0,0,0.08)]",
        isFeatured
          ? "border-orange-500/40 bg-[#090b0e] text-white"
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
              isFeatured
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-neutral-900 text-white hover:bg-orange-600"
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
          isFeatured
            ? "border-neutral-800 bg-neutral-900"
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
            isFeatured ? "text-orange-400" : "text-orange-600"
          )}
        >
          {card.role}
        </span>
        <h3
          className={cn(
            "text-base sm:text-[1.18rem] font-bold tracking-tight leading-snug transition-colors line-clamp-2",
            isFeatured ? "text-white" : "text-neutral-900",
            isHighlighted && !isFeatured ? "text-orange-600" : ""
          )}
        >
          {card.name}
        </h3>
        <p
          className={cn(
            "text-[12px] sm:text-[13px] leading-relaxed line-clamp-3 pt-0.5",
            isFeatured ? "text-neutral-300" : "text-neutral-600"
          )}
        >
          {card.description}
        </p>
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
  onCardClick,
}: TeamStackProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeCard, setActiveCard] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Responsive breakpoints
  React.useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Collapse and reset active state on mobile tap outside
  React.useEffect(() => {
    if (!isMobile || !isExpanded) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (
        target instanceof Node &&
        (!containerRef.current || !containerRef.current.contains(target))
      ) {
        setIsExpanded(false);
        setActiveCard(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isExpanded, isMobile]);

  // Reset active state when leaving mobile
  React.useEffect(() => {
    if (!isMobile) setActiveCard(null);
  }, [isMobile]);

  return (
    <div
      className={cn(
        "relative w-full overflow-x-clip select-none py-3 sm:py-5",
        className
      )}
    >
      {(eyebrow || title || description) && (
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
          {eyebrow && (
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 block">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className="relative mx-auto flex h-[31rem] sm:h-[34rem] lg:h-[35rem] w-full max-w-6xl items-center justify-center"
        onMouseEnter={isMobile ? undefined : () => setIsExpanded(true)}
        onMouseLeave={
          isMobile
            ? undefined
            : () => {
                setIsExpanded(false);
                setActiveCard(null);
              }
        }
        onClick={
          isMobile
            ? () => {
                if (!isExpanded) setIsExpanded(true);
              }
            : undefined
        }
      >
        <div className="relative h-[25rem] w-full max-w-5xl sm:h-[28rem]">
          {items.map((card, index) => (
            <TeamMemberCard
              key={card.name}
              card={card}
              index={index}
              total={items.length}
              isExpanded={isExpanded}
              isMobile={isMobile}
              isTablet={isTablet}
              isActive={activeCard === index}
              onActivate={setActiveCard}
              onExpand={() => setIsExpanded(true)}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>

      {/* Subtext interaction prompt */}
      <div className="mt-2 text-center">
        <p className="text-[12px] sm:text-xs text-neutral-600 tracking-wide">
          {isMobile
            ? "Tap cards to cycle • Tap active card to view service"
            : "Hover over the deck to explore services • Click any card to view details"}
        </p>
      </div>
    </div>
  );
}

export default TeamStack;
