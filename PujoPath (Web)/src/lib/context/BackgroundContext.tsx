'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  GHIBLI_BACKGROUNDS,
  BACKGROUND_SETTINGS,
  GhibliBackground,
  getNextRandomIndex,
  isHomepageRoute,
} from '@/data/config/backgroundConfig';
import { getAssetPath } from '@/lib/utils/asset';

interface BackgroundContextValue {
  currentBackground: GhibliBackground;
  incomingBackground: GhibliBackground | null;
  isTransitioning: boolean;
  isPaused: boolean;
  togglePause: () => void;
  nextBackground: () => void;
  prefersReducedMotion: boolean;
  currentIndex: number;
  isHomepage: boolean;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = isHomepageRoute(pathname);

  // Initial state uses index 0 for SSR consistency, then randomizes on client mount
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasRandomizedInitialRef = useRef<boolean>(false);

  // 1. Initial random selection & prefers-reduced-motion check on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    // Randomize initial background on session start
    if (!hasRandomizedInitialRef.current && GHIBLI_BACKGROUNDS.length > 1) {
      const initialRandom = Math.floor(Math.random() * GHIBLI_BACKGROUNDS.length);
      setCurrentIndex(initialRandom);
      hasRandomizedInitialRef.current = true;
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  // 2. Perform smooth transition to next background (only active on homepage)
  const triggerTransitionTo = useCallback(
    (targetIndex: number) => {
      if (!isHomepage || targetIndex === currentIndex || isTransitioning) return;

      const targetBg = GHIBLI_BACKGROUNDS[targetIndex];
      if (!targetBg) return;

      // Preload next image before initiating crossfade to prevent blank flashes
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const targetSrc = isMobile ? (targetBg.srcPortrait || targetBg.src) : (targetBg.srcLandscape || targetBg.src);
      
      const preloadImg = new Image();
      preloadImg.src = getAssetPath(targetSrc);

      const startFade = () => {
        setIncomingIndex(targetIndex);
        setIsTransitioning(true);

        if (transitionTimerRef.current) {
          clearTimeout(transitionTimerRef.current);
        }

        transitionTimerRef.current = setTimeout(() => {
          setCurrentIndex(targetIndex);
          setIncomingIndex(null);
          setIsTransitioning(false);
        }, BACKGROUND_SETTINGS.transitionDurationMs);
      };

      if (preloadImg.complete) {
        startFade();
      } else {
        preloadImg.onload = startFade;
        preloadImg.onerror = () => {
          // If the image fails to load, gracefully skip without breaking rotation
          console.warn(`[PujoPath Background] Failed to load ${targetSrc}; skipping.`);
          const fallbackIndex = getNextRandomIndex(targetIndex);
          if (fallbackIndex !== currentIndex) {
            triggerTransitionTo(fallbackIndex);
          }
        };
      }
    },
    [currentIndex, isHomepage, isTransitioning]
  );

  // 3. Step forward manually
  const nextBackground = useCallback(() => {
    if (!isHomepage) return;
    const nextIdx = getNextRandomIndex(currentIndex);
    triggerTransitionTo(nextIdx);
  }, [currentIndex, isHomepage, triggerTransitionTo]);

  // 4. Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // 5. Automatic interval timer rotation (28 seconds, homepage only)
  useEffect(() => {
    // If not on homepage, paused, reduced-motion active, or transitioning, clear timer
    if (!isHomepage || isPaused || prefersReducedMotion) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Set recurring timer
    timerRef.current = setInterval(() => {
      const nextIdx = getNextRandomIndex(currentIndex);
      triggerTransitionTo(nextIdx);
    }, BACKGROUND_SETTINGS.intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [currentIndex, isHomepage, isPaused, prefersReducedMotion, triggerTransitionTo]);

  const value = useMemo<BackgroundContextValue>(() => {
    return {
      currentBackground: GHIBLI_BACKGROUNDS[currentIndex] || GHIBLI_BACKGROUNDS[0],
      incomingBackground: incomingIndex !== null ? GHIBLI_BACKGROUNDS[incomingIndex] : null,
      isTransitioning,
      isPaused,
      togglePause,
      nextBackground,
      prefersReducedMotion,
      currentIndex,
      isHomepage,
    };
  }, [
    currentIndex,
    incomingIndex,
    isTransitioning,
    isPaused,
    togglePause,
    nextBackground,
    prefersReducedMotion,
    isHomepage,
  ]);

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
}

export function useBackground(): BackgroundContextValue {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
