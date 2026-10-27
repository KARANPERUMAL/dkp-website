"use client";
import React, { useId } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextAnimationBlurFadeInProps extends HTMLMotionProps<"div"> {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDuration?: number;
  duration?: number;
  blur?: string;
  yOffset?: number;
  as?: "div" | "span" | "h1" | "h2" | "h3" | "h4" | "p";
  once?: boolean;
}

export const TextAnimationBlurFadeIn: React.FC<TextAnimationBlurFadeInProps> = ({
  text,
  children,
  className,
  delay = 0,
  staggerDuration = 0.02,
  duration = 0.5,
  blur = "10px",
  yOffset = 10,
  as = "div",
  once = true,
  ...props
}) => {
  const rawText = text ?? (typeof children === "string" ? children : null);
  const elementId = useId();

  // If text is provided, animate word-by-word with staggered blur-and-fade
  if (rawText) {
    const words = rawText.split(" ");
    const MotionComponent = motion[as] as typeof motion.div;

    return (
      <MotionComponent
        className={cn("inline-block", className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-40px" }}
        {...props}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${elementId}-word-${index}`}
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                filter: `blur(${blur})`,
                y: yOffset,
              },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: {
                  duration,
                  ease: [0.16, 1, 0.3, 1],
                  delay: delay + index * staggerDuration,
                },
              },
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </MotionComponent>
    );
  }

  // If complex children / elements are provided, animate container smoothly
  const MotionComponent = motion[as] as typeof motion.div;
  return (
    <MotionComponent
      className={className}
      initial={{
        opacity: 0,
        filter: `blur(${blur})`,
        y: yOffset,
      }}
      whileInView={{
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          duration,
          ease: [0.16, 1, 0.3, 1],
          delay,
        },
      }}
      viewport={{ once, margin: "-40px" }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export const BlurFadeIn = TextAnimationBlurFadeIn;
export const BlurFade = TextAnimationBlurFadeIn;
export default TextAnimationBlurFadeIn;
