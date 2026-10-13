'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickAccess } from '@/components/home/QuickAccess';
import { PujaHighlights } from '@/components/home/PujaHighlights';
import { FeatureFooter } from '@/components/home/FeatureFooter';

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* 1. Hero Showcase with Realtime Countdown and Action Buttons */}
      <HeroSection />

      {/* 2. Quick Access Key Shortcuts */}
      <QuickAccess />

      {/* 3. Curated Puja Highlights (Traditional, Art, Routes) */}
      <PujaHighlights />

      {/* 4. Interactive Feature Highlights & Utility Controls */}
      <FeatureFooter />
    </div>
  );
}
