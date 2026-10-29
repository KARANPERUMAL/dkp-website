"use client";

import * as React from "react";
import {
  Target,
  ChartNoAxesColumnIncreasing,
  Paintbrush,
  Clock,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCardItem {
  value: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cardClassName?: string;
  iconClassName?: string;
  rotateClassName?: string;
}

export interface StackedFeatureCardsProps {
  cards?: FeatureCardItem[];
  featureCards?: FeatureCardItem[];
  className?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
}

export const defaultWhyChooseUsCards: FeatureCardItem[] = [
  {
    value: "01",
    title: "Customized Strategies",
    description:
      "Every business has different goals and audiences. We tailor our digital, creative and marketing strategies to your specific needs rather than relying on a one-size-fits-all approach.",
    icon: Target,
    cardClassName: "bg-white border border-neutral-200/90 text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-[#FFD60A]",
    iconClassName: "bg-[#FFD60A] text-[#000122] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]",
    rotateClassName: "rotate-[-0.6deg] sm:rotate-[-1.2deg]",
  },
  {
    value: "02",
    title: "Result-Driven Approach",
    description:
      "We align our work with clear business objectives and use relevant performance indicators to evaluate progress and guide improvements.",
    icon: ChartNoAxesColumnIncreasing,
    cardClassName: "bg-[#fafafb] border border-neutral-200/90 text-neutral-900 shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-[#FFD60A]",
    iconClassName: "bg-[#FFD60A] text-[#000122] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]",
    rotateClassName: "rotate-[0.8deg] sm:rotate-[1.4deg]",
  },
  {
    value: "03",
    title: "Experienced Creative Team",
    description:
      "Our approach brings strategy, design and creative execution together to develop consistent brand communication across digital and offline channels.",
    icon: Paintbrush,
    cardClassName: "bg-white border border-neutral-200/90 text-neutral-900 shadow-[0_14px_34px_rgba(0,0,0,0.08)] hover:border-[#FFD60A]",
    iconClassName: "bg-[#FFD60A] text-[#000122] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]",
    rotateClassName: "rotate-[-0.5deg] sm:rotate-[-0.9deg]",
  },
  {
    value: "04",
    title: "On-Time Delivery",
    description:
      "We prioritize clear project scope, practical timelines and coordinated execution to keep deliverables organized and projects moving forward.",
    icon: Clock,
    cardClassName: "bg-[#fafafb] border border-neutral-200/90 text-neutral-900 shadow-[0_16px_36px_rgba(0,0,0,0.09)] hover:border-[#FFD60A]",
    iconClassName: "bg-[#FFD60A] text-[#000122] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]",
    rotateClassName: "rotate-[0.6deg] sm:rotate-[1.1deg]",
  },
  {
    value: "05",
    title: "Affordable Packages",
    description:
      "We aim to provide solutions that match the client's requirements and budget without compromising on strategic clarity or quality.",
    icon: PiggyBank,
    cardClassName: "bg-white border border-neutral-200/90 text-neutral-900 shadow-[0_18px_38px_rgba(0,0,0,0.1)] hover:border-[#FFD60A]",
    iconClassName: "bg-[#FFD60A] text-[#000122] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]",
    rotateClassName: "rotate-[-0.4deg] sm:rotate-[-0.6deg]",
  },
];

export function StackedFeatureCards({
  cards,
  featureCards,
  className,
  title,
  eyebrow,
  description,
}: StackedFeatureCardsProps) {
  const cardList = cards || featureCards || defaultWhyChooseUsCards;

  return (
    <div className="w-full">
      {(title || eyebrow || description) && (
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          {eyebrow && (
            <span className="text-xs font-bold text-[#854D0E] uppercase tracking-wider mb-2 block">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-snug mb-3">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      )}
      <ul className={cn("relative space-y-0 pb-16 sm:pb-24", className)}>
        {cardList.map((card, index) => {
          const Icon = card.icon;
          return (
            <li
              key={card.value}
              className="sticky"
              style={{
                zIndex: index + 1,
                top: `calc(4.5rem + ${1.8 * index}rem)`,
              }}
            >
              <article
                className={cn(
                  "flex min-h-[18rem] sm:min-h-[20rem] lg:min-h-[21rem] flex-col justify-between rounded-[2rem] sm:rounded-[2.4rem] p-6 sm:p-8 lg:p-9 shadow-lg sm:shadow-xl transition-all duration-300",
                  card.cardClassName || "bg-white border border-neutral-200/90 text-neutral-900",
                  card.rotateClassName
                )}
              >
                {/* Header: Large Monospace Index Number + Branded Icon Badge */}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tighter text-neutral-900 select-none">
                    {card.value}
                  </span>
                  <span
                    className={cn(
                      "inline-flex size-11 sm:size-12 items-center justify-center rounded-2xl transition-transform duration-200 hover:scale-105 shadow-sm",
                      card.iconClassName || "bg-[#FFD60A] text-[#000122] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]"
                    )}
                  >
                    <Icon className="size-5 sm:size-6" />
                  </span>
                </div>

                {/* Body: Title and Full Description */}
                <div className="max-w-xl mt-4 sm:mt-6 space-y-2">
                  <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] leading-snug font-bold text-neutral-900 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base font-normal tracking-tight leading-relaxed text-neutral-600">
                    {card.description}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StackedFeatureCards;
