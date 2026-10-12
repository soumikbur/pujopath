'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useBackground } from '@/lib/context/BackgroundContext';
import { getAssetPath } from '@/lib/utils/asset';
import { BACKGROUND_SETTINGS, isHomepageRoute } from '@/data/config/backgroundConfig';

/**
 * PujoBackground — Centralized, route-aware background architecture.
 *
 * RULES:
 * 1. HOMEPAGE:
 *    Restores the original, vibrant Ghibli-inspired Durga Puja illustrations
 *    (16:9 Landscape on desktop, 3:4 Portrait on mobile) with original visual intensity
 *    (30-36% desktop, 32-38% mobile opacity) and soft radial framing vignette so the
 *    artwork is clearly visible and atmospheric.
 *
 * 2. ALL NON-HOMEPAGE PAGES (/map, /planner, /explore, /pandals/[slug], /calendar, /metro, etc.):
 *    Strictly NO photographic or illustrative background images. Displays the clean,
 *    minimalistic Bengali cultural background featuring base ambient warmth, sacred
 *    alpana line art with slow, elegant background animations (slow 75-90s rotation,
 *    subtle drift, and gentle pulsing) that stay decorative and non-intrusive.
 */
export function PujoBackground() {
  const pathname = usePathname();
  const isHomepage = isHomepageRoute(pathname);
  const { currentBackground, incomingBackground, isTransitioning, prefersReducedMotion } =
    useBackground();

  // Current assets (resolved ONLY when on homepage)
  const currentLandscape = isHomepage
    ? getAssetPath(currentBackground.srcLandscape || currentBackground.src)
    : null;
  const currentPortrait = isHomepage
    ? getAssetPath(currentBackground.srcPortrait || currentBackground.src)
    : null;

  // Incoming assets for crossfade (resolved ONLY when on homepage)
  const incomingLandscape =
    isHomepage && incomingBackground
      ? getAssetPath(incomingBackground.srcLandscape || incomingBackground.src)
      : null;
  const incomingPortrait =
    isHomepage && incomingBackground
      ? getAssetPath(incomingBackground.srcPortrait || incomingBackground.src)
      : null;

  // Non-homepage subtle animation flag (disabled if reduced motion preferred)
  const shouldAnimateAlpana = !isHomepage && !prefersReducedMotion;

  return (
    <div
      aria-hidden="true"
      className="pujopath-fixed-background pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500"
    >
      {/* ============================================================== */}
      {/* 1. HOMEPAGE-ONLY: Original Visible Ghibli Durga Puja Artwork   */}
      {/* ============================================================== */}
      {isHomepage && (
        <>
          {/* Current Illustration Layer (Original Opacity Restored) */}
          <div
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              transitionDuration: `${BACKGROUND_SETTINGS.transitionDurationMs}ms`,
              opacity: isTransitioning ? 0 : 1,
            }}
          >
            {/* Desktop / Laptop: 16:9 Landscape */}
            {currentLandscape && (
              <div className="hidden md:block absolute inset-0">
                <Image
                  src={currentLandscape}
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="object-cover object-center opacity-[0.30] dark:opacity-[0.36] transition-opacity duration-500"
                />
              </div>
            )}

            {/* Mobile / Tablet Portrait: 3:4 Portrait */}
            {currentPortrait && (
              <div className="block md:hidden absolute inset-0">
                <Image
                  src={currentPortrait}
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="object-cover object-top opacity-[0.32] dark:opacity-[0.38] transition-opacity duration-500"
                />
              </div>
            )}
          </div>

          {/* Incoming Illustration Layer (Crossfading In) */}
          {incomingBackground && (
            <div
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{
                transitionDuration: `${BACKGROUND_SETTINGS.transitionDurationMs}ms`,
                opacity: isTransitioning ? 1 : 0,
              }}
            >
              {/* Desktop / Laptop: 16:9 Landscape */}
              {incomingLandscape && (
                <div className="hidden md:block absolute inset-0">
                  <Image
                    src={incomingLandscape}
                    alt=""
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-cover object-center opacity-[0.30] dark:opacity-[0.36] transition-opacity duration-500"
                  />
                </div>
              )}

              {/* Mobile / Tablet Portrait: 3:4 Portrait */}
              {incomingPortrait && (
                <div className="block md:hidden absolute inset-0">
                  <Image
                    src={incomingPortrait}
                    alt=""
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-cover object-top opacity-[0.32] dark:opacity-[0.38] transition-opacity duration-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Soft Radial Vignette Framing (Light Mode, Homepage - Restored Original) */}
          <div
            className="absolute inset-0 dark:opacity-0 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(ellipse 95% 70% at 50% 25%, rgba(254, 248, 240, 0.22) 0%, rgba(252, 250, 247, 0.55) 55%, rgba(252, 250, 247, 0.85) 100%)',
            }}
          />

          {/* Soft Radial Vignette Framing (Dark Mode, Homepage - Restored Original) */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(ellipse 95% 70% at 50% 25%, rgba(20, 17, 14, 0.2) 0%, rgba(20, 17, 14, 0.58) 55%, rgba(20, 17, 14, 0.88) 100%)',
            }}
          />
        </>
      )}

      {/* ============================================================== */}
      {/* 2. NON-HOMEPAGE: Restored Minimalistic Ambient Radial Warmth   */}
      {/* ============================================================== */}
      {!isHomepage && (
        <>
          {/* Base Ambient Radial Warmth (Light Mode) */}
          <div
            className="absolute inset-0 dark:opacity-0 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(254, 245, 235, 0.85) 0%, rgba(250, 242, 232, 0.5) 55%, rgba(244, 233, 220, 0.4) 100%)',
            }}
          />

          {/* Base Ambient Radial Warmth (Dark Mode) */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(45, 30, 22, 0.45) 0%, rgba(25, 20, 16, 0.25) 55%, rgba(20, 17, 14, 0.05) 100%)',
            }}
          />
        </>
      )}

      {/* ============================================================== */}
      {/* 3. SITE-WIDE: Subtle Cultural Bengali Alpana & Geometric Art   */}
      {/*    (Gently animated on non-homepage pages, static on home)     */}
      {/* ============================================================== */}
      {/* Top-Left Sacred Alpana Motif (Subtle slow 75s rotation on non-homepage) */}
      <svg
        className={`absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 text-[#B42323] opacity-[0.038] dark:opacity-[0.05] transition-opacity duration-300 ${
          shouldAnimateAlpana ? 'animate-alpana-spin' : ''
        }`}
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="100" cy="100" r="88" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="74" />
        <circle cx="100" cy="100" r="60" strokeDasharray="2 2" />
        <circle cx="100" cy="100" r="44" />
        <circle cx="100" cy="100" r="28" />
        <circle cx="100" cy="100" r="12" fill="currentColor" fillOpacity="0.2" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <path
            key={deg}
            d="M100,100 C105,75 118,65 100,44 C82,65 95,75 100,100 Z"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
          <circle
            key={deg}
            cx="100"
            cy="20"
            r="1.6"
            fill="currentColor"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </svg>

      {/* Top-Right Mirrored Mandala Accent (Subtle slow 90s reverse rotation on non-homepage) */}
      <svg
        className={`absolute -top-20 -right-20 w-88 h-88 sm:w-[420px] sm:h-[420px] text-[#B42323] opacity-[0.035] dark:opacity-[0.05] transition-opacity duration-300 ${
          shouldAnimateAlpana ? 'animate-alpana-spin-reverse' : ''
        }`}
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="100" cy="100" r="92" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="76" />
        <circle cx="100" cy="100" r="56" />
        <circle cx="100" cy="100" r="36" strokeDasharray="2 3" />
        <circle cx="100" cy="100" r="16" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 100 100)`}>
            <path d="M100,100 Q112,65 100,36 Q88,65 100,100 Z" />
            <circle cx="100" cy="22" r="2" fill="currentColor" />
          </g>
        ))}
      </svg>

      {/* Autumn Kash Flower (কাশফুল) Graceful Swirl Accent (Subtle drifting movement on non-homepage) */}
      <svg
        className={`hidden md:block absolute top-1/3 -right-12 w-64 h-96 text-[#B42323] opacity-[0.025] dark:opacity-[0.04] ${
          shouldAnimateAlpana ? 'animate-alpana-drift' : ''
        }`}
        viewBox="0 0 100 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M10,190 C30,140 15,90 40,50 C55,25 75,15 90,5" />
        <path d="M40,50 C55,42 70,45 80,40" />
        <path d="M30,80 C48,70 65,74 76,68" />
        <path d="M22,115 C40,105 58,110 68,102" />
        <path d="M18,150 C34,142 50,146 58,138" />
      </svg>

      {/* Bottom Delicate Geometric Border Accent (Subtle gentle pulsing on non-homepage) */}
      <svg
        className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-[700px] h-36 text-[#B42323] opacity-[0.03] dark:opacity-[0.04] ${
          shouldAnimateAlpana ? 'animate-alpana-pulse' : ''
        }`}
        viewBox="0 0 600 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0,40 Q150,20 300,40 Q450,60 600,40" />
        <path d="M0,48 Q150,28 300,48 Q450,68 600,48" strokeDasharray="3 3" />
        <circle cx="300" cy="40" r="14" />
        <circle cx="300" cy="40" r="6" fill="currentColor" fillOpacity="0.3" />
        <circle cx="150" cy="30" r="4" fill="currentColor" fillOpacity="0.2" />
        <circle cx="450" cy="50" r="4" fill="currentColor" fillOpacity="0.2" />
      </svg>
    </div>
  );
}
