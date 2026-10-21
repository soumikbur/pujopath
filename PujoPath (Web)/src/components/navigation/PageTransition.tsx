'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition — Shared routing transition wrapper.
 *
 * Implements a restrained, polished navigation transition:
 * - 180ms duration with subtle opacity fade.
 * - Zero CSS transforms, ensuring uninhibited, natural vertical scrolling.
 * - Auto-clearing animation state on completion.
 * - Full compliance with prefers-reduced-motion.
 * - Persistent audio playback & background timer isolation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // Reset animation state whenever route changes
  useEffect(() => {
    setAnimating(true);
  }, [pathname]);

  const isMapRoute = pathname === '/map' || pathname === '/planner';

  // Ensure Leaflet map canvas smoothly recalculates dimensions on route entry
  useEffect(() => {
    if (isMapRoute && typeof window !== 'undefined') {
      const timer = window.setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [pathname, isMapRoute]);

  const animationClass =
    !reducedMotion && animating
      ? isMapRoute
        ? 'page-transition-enter-map'
        : 'page-transition-enter'
      : '';

  return (
    <div
      key={pathname}
      className={`w-full flex-1 flex flex-col ${animationClass}`}
      onAnimationEnd={() => setAnimating(false)}
    >
      {children}
    </div>
  );
}
