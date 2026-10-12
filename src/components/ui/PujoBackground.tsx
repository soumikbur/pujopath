'use client';

import React from 'react';
import Image from 'next/image';
import { useBackground } from '@/lib/context/BackgroundContext';
import { getAssetPath } from '@/lib/utils/asset';
import { BACKGROUND_SETTINGS } from '@/data/config/backgroundConfig';

/**
 * PujoBackground — Subtle, cinematic Ghibli-inspired Durga Puja background.
 *
 * Rotates randomly between 6 original Ghibli illustrations depicting authentic
 * Bengali Durga Puja moments. Features:
 * - Responsive 16:9 Landscape for desktop/laptops & 3:4 Portrait for mobile devices
 * - 2-second smooth crossfade without flashing or blank gaps
 * - Balanced, visible opacity & soft radial framing vignette
 * - 100% card & text readability across light and dark modes
 * - Zero interference with maps, buttons, or navigation (pointer-events-none, z-0)
 * - Culturally authentic alpana and kash flower vector line accents
 * - Respects prefers-reduced-motion
 */
export function PujoBackground() {
  const { currentBackground, incomingBackground, isTransitioning } = useBackground();

  // Current assets
  const currentLandscape = getAssetPath(currentBackground.srcLandscape || currentBackground.src);
  const currentPortrait = getAssetPath(currentBackground.srcPortrait || currentBackground.src);

  // Incoming assets for crossfade
  const incomingLandscape = incomingBackground
    ? getAssetPath(incomingBackground.srcLandscape || incomingBackground.src)
    : null;
  const incomingPortrait = incomingBackground
    ? getAssetPath(incomingBackground.srcPortrait || incomingBackground.src)
    : null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Underlying Ghibli Illustration Layer (Current) */}
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
              className="object-cover object-center opacity-[0.32] dark:opacity-[0.38] transition-opacity duration-500"
            />
          </div>
        )}
      </div>

      {/* 2. Incoming Ghibli Illustration Layer (Crossfading In) */}
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
                className="object-cover object-center opacity-[0.32] dark:opacity-[0.38] transition-opacity duration-500"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Soft Radial Vignette Overlay (Light Mode) */}
      <div
        className="absolute inset-0 dark:opacity-0 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse 95% 70% at 50% 25%, rgba(254, 248, 240, 0.22) 0%, rgba(252, 250, 247, 0.55) 55%, rgba(252, 250, 247, 0.85) 100%)',
        }}
      />

      {/* 4. Soft Radial Vignette Overlay (Dark Mode) */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse 95% 70% at 50% 25%, rgba(20, 17, 14, 0.2) 0%, rgba(20, 17, 14, 0.58) 55%, rgba(20, 17, 14, 0.88) 100%)',
        }}
      />

      {/* 5. Delicate Cultural Alpana Vector Motifs (Top-Left) */}
      <svg
        className="absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 text-[#B42323] opacity-[0.038] dark:opacity-[0.05] transition-opacity duration-300"
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

      {/* 6. Delicate Cultural Alpana Vector Motifs (Top-Right) */}
      <svg
        className="absolute -top-20 -right-20 w-88 h-88 sm:w-[420px] sm:h-[420px] text-[#B42323] opacity-[0.035] dark:opacity-[0.05] transition-opacity duration-300"
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

      {/* 7. Autumn Kash Flower (কাশফুল) Graceful Swirl Accent — Center-Right */}
      <svg
        className="hidden md:block absolute top-1/3 -right-12 w-64 h-96 text-[#B42323] opacity-[0.028] dark:opacity-[0.04]"
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
    </div>
  );
}
