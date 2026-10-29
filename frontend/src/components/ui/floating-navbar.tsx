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
          "fixed top-3.5 sm:top-5 inset-x-0 mx-auto z-[5000] flex max-w-fit items-center justify-center pointer-events-auto",
          className
        )}
      >
        <nav
          aria-label="Floating Navigation"
          className="flex items-center justify-center gap-1 rounded-full border border-white/[0.18] bg-[#000122]/90 px-2 sm:px-2.5 py-1.5 shadow-[0_8px_32px_rgba(0,1,34,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl"
        >
          {navItems.map((navItem, idx: number) => {
            const isActive = activeTab === navItem.link;
            return (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                onClick={(e) => {
                  e.preventDefault();
                  if (onItemClick) {
                    onItemClick(navItem.link);
                  }
                }}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 select-none",
                  isActive
                    ? "text-[#000122] font-bold"
                    : "text-[#CBD5E1] hover:text-[#FFD60A] hover:bg-white/10"
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
                        isActive ? "text-[#000122]" : "text-neutral-400 group-hover:text-[#FFD60A]"
                      )}
                    >
                      {navItem.icon}
                    </span>
                  )}
                  <span className="hidden sm:inline">{navItem.name}</span>
                  {/* Active Indicator Dot on small mobile screens where text is hidden */}
                  {isActive && (
                    <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-[#000122] ml-0.5" />
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
