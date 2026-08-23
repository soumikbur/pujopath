'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickAccess } from '@/components/home/QuickAccess';
import { FeatureFooter } from '@/components/home/FeatureFooter';
import { PujaHighlights } from '@/components/home/PujaHighlights';

export default function HomePage() {
  return (
    <div className="space-y-4 sm:space-y-4.5 max-w-7xl mx-auto w-full">
      {/* 1. Large Hero Card */}
      <HeroSection />

      {/* 2. Quick Access 7-Column Shortcuts */}
      <QuickAccess />

      {/* 3. Six Compact Feature Cards */}
      <FeatureFooter />

      {/* 4. Puja Highlights 3 Horizontal Cards */}
      <PujaHighlights />
    </div>
  );
}
