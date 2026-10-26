import { useState, useEffect } from 'react';

export function useHeroCurveReveal() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setProgress(1);
      setIsComplete(true);
      return;
    }

    let rafId: number | null = null;

    const updateScrollProgress = () => {
      if (typeof window === 'undefined') return;

      const scrollY = window.scrollY;
      // Pinned hero scroll interval is the distance during which the white section moves up over the hero.
      // Starts when the user begins scrolling, and completes when the hero is covered (~72% of innerHeight).
      const revealDistance = Math.max(300, Math.min(800, window.innerHeight * 0.72));
      const rawProgress = Math.min(1, Math.max(0, scrollY / revealDistance));

      setProgress(rawProgress);
      setIsComplete(rawProgress >= 0.999);
    };

    const onScrollOrResize = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    // Initial check on mount
    updateScrollProgress();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return { progress, isComplete };
}
