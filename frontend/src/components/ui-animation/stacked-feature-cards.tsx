import { defaultWhyChooseUsCards } from '@/data/whyChooseUsData';
import * as React from "react";
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
                      card.iconClassName || "bg-[#FFD60A] text-[#002244] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]"
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
