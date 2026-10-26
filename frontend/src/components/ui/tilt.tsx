"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
  type SpringOptions,
} from "motion/react";

export type TiltProps = {
  children: React.ReactNode;
  className?: string;
  style?: MotionStyle;
  /**
   * Maximum rotation angle in degrees.
   * @default 15
   */
  rotationFactor?: number;
  /**
   * Reverse the tilt direction.
   * @default false
   */
  isReverse?: boolean;
  springOptions?: SpringOptions;
};

export function Tilt({
  children,
  className,
  style,
  rotationFactor = 15,
  isReverse = false,
  springOptions,
}: TiltProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setReducedMotion(true);
    }
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const defaultSpringOptions: SpringOptions = {
    damping: 25,
    stiffness: 300,
    ...springOptions,
  };

  const xSpring = useSpring(x, defaultSpringOptions);
  const ySpring = useSpring(y, defaultSpringOptions);

  const effectiveRotation = reducedMotion ? 0 : rotationFactor;

  const rotateX = useTransform(
    ySpring,
    [-0.5, 0.5],
    isReverse
      ? [effectiveRotation, -effectiveRotation]
      : [-effectiveRotation, effectiveRotation],
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    isReverse
      ? [-effectiveRotation, effectiveRotation]
      : [effectiveRotation, -effectiveRotation],
  );

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", ...style, transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
