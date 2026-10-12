'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition — Shared routing transition wrapper (Phases 2 & 3).
 *
 * Implements a restrained, polished navigation transition:
 * - 190ms duration with natural ease-out curve.
 * - Subtle 5px vertical translation + opacity fade for standard pages.
 * - Safe transform-free opacity fade for Leaflet interactive map pages (/map, /planner).
 * - Full compliance with prefers-reduced-motion (Phase 5).
 * - Persistent audio playback & background timer isolation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);

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

  const animationClass = reducedMotion
    ? ''
    : isMapRoute
    ? 'page-transition-enter-map'
    : 'page-transition-enter';

  return (
    <div key={pathname} className={`w-full ${animationClass}`}>
      {children}
    </div>
  );
}
