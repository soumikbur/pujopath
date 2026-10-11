'use client';

import React from 'react';

/**
 * PujoBackground — Minimalistic, culturally authentic background layer
 * featuring soft radial lighting, subtle festive geometric alpana / mandala line work,
 * and delicate ornamental curves inspired by Bengal's autumn festival.
 * Zero external asset requests, hardware-accelerated, non-blocking (pointer-events-none).
 */
export function PujoBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500"
    >
      {/* 1. Base Ambient Radial Warmth (Light Mode) */}
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

      {/* 2. Top-Left Traditional Alpana Motif (Subtle sacred concentric petals & rays) */}
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
        {/* 12 Radiating Lotus Petals */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <path
            key={deg}
            d="M100,100 C105,75 118,65 100,44 C82,65 95,75 100,100 Z"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        {/* Outer Fine Dots */}
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

      {/* 3. Top-Right Traditional Alpana Motif (Mirrored mandala accent) */}
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

      {/* 4. Delicate Autumn Kash Flower (কাশফুল) Graceful Swirl Accent — Center-Right */}
      <svg
        className="hidden md:block absolute top-1/3 -right-12 w-64 h-96 text-[#B42323] opacity-[0.025] dark:opacity-[0.04]"
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

      {/* 5. Bottom Delicate Geometric Border Accent */}
      <svg
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[700px] h-36 text-[#B42323] opacity-[0.03] dark:opacity-[0.04]"
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
