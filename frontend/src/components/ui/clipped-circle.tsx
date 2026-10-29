"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  animate,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface ClippedCircleProps {
  className?: string;
  circleClassName?: string;
  circleSize?: number;
  children?: React.ReactNode;
}

export function ClippedCircle({
  className,
  circleClassName = "bg-[#000122]",
  circleSize = 450,
  children,
}: ClippedCircleProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useMotionValue(0);

  const circleRadius = circleSize / 2;
  const clipPath = useMotionTemplate`circle(${radius}px at ${mouseX}px ${mouseY}px)`;
  const scale = useTransform(radius, [0, circleRadius], [0, 1]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.parentElement) return;

    const parent = container.parentElement;

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      animate(radius, circleRadius, {
        duration: 0.45,
        ease: [0.19, 1, 0.22, 1],
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
      animate(radius, 0, {
        duration: 0.35,
        ease: [0.19, 1, 0.22, 1],
      });
    };

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [circleRadius, mouseX, mouseY, radius]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none z-20",
        className,
      )}
    >
      {/* Black circle backdrop that smoothly scales and follows pointer */}
      <motion.div
        className={cn(
          "pointer-events-none absolute rounded-full",
          circleClassName,
        )}
        style={{
          left: mouseX,
          top: mouseY,
          width: circleSize,
          height: circleSize,
          x: "-50%",
          y: "-50%",
          scale,
        }}
      />

      {/* Clipped dark overlay content synchronized to the exact same circular mask */}
      {children && (
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
          style={{
            clipPath,
            WebkitClipPath: clipPath,
          }}
          aria-hidden="true"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
