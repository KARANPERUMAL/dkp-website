"use client";
import { useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  link: string;
  icon?: ReactNode;
}

export const FloatingNav = ({
  navItems,
  className,
  activeTab = "#home",
  onItemClick,
  alwaysVisible = true,
}: {
  navItems: NavItem[];
  className?: string;
  activeTab?: string;
  onItemClick?: (link: string) => void;
  alwaysVisible?: boolean;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (alwaysVisible) {
      if (!visible) setVisible(true);
      return;
    }
    if (typeof current === "number") {
      const prev = scrollYProgress.getPrevious();
      const direction = prev !== undefined ? current - prev : 0;

      // Keep visible near the top of the viewport
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        // Scrolling up -> reveal; scrolling down -> hide
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className={cn(
          "relative md:fixed md:top-5 md:inset-x-0 md:mx-auto z-[5000] flex max-w-fit items-center justify-center pointer-events-auto",
          className
        )}
      >
        <nav
          aria-label="Floating Navigation"
          className="flex items-center justify-center gap-0.5 sm:gap-1 rounded-full border border-white/[0.25] bg-[#003E6D]/90 px-1.5 sm:px-2.5 py-1.5 shadow-[0_8px_32px_rgba(0,62,109,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-xl max-w-[calc(100vw-1.5rem)] overflow-x-auto no-scrollbar"
        >
          {navItems.map((navItem, idx: number) => {
            const isActive = activeTab === navItem.link;
            return (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                title={navItem.name}
                aria-label={navItem.name}
                onClick={(e) => {
                  e.preventDefault();
                  if (onItemClick) {
                    onItemClick(navItem.link);
                  }
                }}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 select-none shrink-0",
                  isActive
                    ? "text-[#002244] font-bold"
                    : "text-white hover:text-[#FFD60A] hover:bg-white/10"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-full bg-[#FFD60A] shadow-[0_2px_14px_rgba(255,214,10,0.35)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {navItem.icon && (
                    <span
                      className={cn(
                        "transition-colors",
                        isActive ? "text-[#002244]" : "text-white/80 group-hover:text-[#FFD60A]"
                      )}
                    >
                      {navItem.icon}
                    </span>
                  )}
                  <span className="hidden md:inline">{navItem.name}</span>
                  {/* Active Indicator Dot on mobile screens below 768px where text is hidden */}
                  {isActive && (
                    <span className="md:hidden w-1.5 h-1.5 rounded-full bg-[#002244] ml-0.5" />
                  )}
                </span>
              </a>
            );
          })}
        </nav>
      </motion.div>
    </AnimatePresence>
  );
};
