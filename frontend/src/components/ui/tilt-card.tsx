"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ClippedCircle } from "@/components/ui/clipped-circle";
import { Tilt, type TiltProps } from "@/components/ui/tilt";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  /** left half of the split badge pill; shown as a simple pill if `badgeLabel` is omitted */
  price?: string;
  /** right half of the split pill, coloured by `badgeVariant` */
  badgeLabel?: string;
  badgeVariant?: "success" | "warning";
  imageSrc?: string;
  imageAlt?: string;
  /** wraps the card in a plain `<a>` tag */
  href?: string;
  children?: React.ReactNode;
  tiltProps?: Omit<TiltProps, "children" | "className">;
  circleSize?: number;
  circleClassName?: string;
  overlayContent?: React.ReactNode;
}

const BADGE_LABEL_CLASSES: Record<
  NonNullable<TiltCardProps["badgeVariant"]>,
  string
> = {
  success: "bg-emerald-500/15 text-emerald-700",
  warning: "bg-amber-500/20 text-amber-700",
};

export function TiltCard({
  title,
  description,
  price,
  badgeLabel,
  badgeVariant = "success",
  imageSrc,
  imageAlt = "",
  href,
  children,
  tiltProps,
  circleSize = 380,
  circleClassName = "bg-[#000122]",
  overlayContent,
  className,
  ...props
}: TiltCardProps) {
  const inner = (
    <Tilt
      rotationFactor={11}
      {...tiltProps}
      className={cn(
        "relative group overflow-hidden",
        "bg-white border border-neutral-200/90 hover:border-[#FFD60A]/50 rounded-xl",
        "shadow-sm hover:shadow-xl transition-all duration-300",
        "flex flex-col w-full text-left",
        className,
      )}
    >
      {/* Root-level Clipped Circle (rendered only when overlayContent is explicitly provided at root level) */}
      {overlayContent && (
        <ClippedCircle
          circleClassName={circleClassName}
          circleSize={circleSize}
          className="z-20"
        >
          {overlayContent}
        </ClippedCircle>
      )}

      {/* Foreground Content */}
      {children ? (
        <div className="relative z-10 flex flex-col h-full w-full justify-between">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex flex-col h-full w-full justify-between">
          {imageSrc && (
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 select-none">
              <img
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                className={cn(
                  "w-full h-full object-cover object-center",
                  "transition-transform duration-500 ease-out",
                  "group-hover:scale-105",
                )}
              />
            </div>
          )}

          {/* Isolated content area with localized hover effect */}
          <div className="relative flex-1 overflow-hidden">
            <ClippedCircle circleClassName={circleClassName} circleSize={circleSize} className="z-20">
              <div className="flex flex-row transition-all duration-200 justify-between px-4 sm:px-6 py-4 sm:py-5 bg-[#000122] h-full">
                <div className="flex flex-col gap-1 flex-1 mr-2">
                  <h2 className="text-lg tracking-tight leading-tight font-bold text-[#FFD60A]">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-neutral-200 text-sm leading-relaxed">{description}</p>
                  )}
                </div>
              </div>
            </ClippedCircle>

            <div className="flex flex-row transition-all duration-200 justify-between px-4 sm:px-6 py-4 sm:py-5 z-10 bg-white">
              <div className="flex flex-col gap-1 flex-1 mr-2">
                <h2 className="text-lg tracking-tight leading-tight font-bold text-neutral-900">
                  {title}
                </h2>
                {description && (
                  <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
                )}
              </div>

              {price && badgeLabel ? (
                <div className="inline-flex h-fit items-center text-sm whitespace-nowrap shrink-0">
                  <span className="rounded-l-full bg-neutral-100 h-fit py-1 px-2 font-medium text-neutral-700">
                    {price}
                  </span>
                  <span
                    className={cn(
                      "rounded-r-full text-sm h-fit py-1 px-2 font-medium",
                      BADGE_LABEL_CLASSES[badgeVariant],
                    )}
                  >
                    {badgeLabel}
                  </span>
                </div>
              ) : price ? (
                <span className="h-fit rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium whitespace-nowrap shrink-0 text-neutral-700">
                  {price}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Tilt>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block cursor-pointer"
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return <div {...props}>{inner}</div>;
}
