'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFestival } from '@/lib/context/FestivalContext';
import { HeroSection } from '@/components/home/HeroSection';
import { PujaSelectionSection } from '@/components/home/PujaSelectionSection';
import { QuickAccess } from '@/components/home/QuickAccess';
import { PujaHighlights } from '@/components/home/PujaHighlights';
import { FeatureFooter } from '@/components/home/FeatureFooter';
import { SelectPujaView } from '@/components/festival/SelectPujaView';

function HomeContent() {
  const searchParams = useSearchParams();
  const festivalParam = searchParams.get('festival');
  const { activeFestival } = useFestival();

  // The application opens directly on the initial Puja Selection page when the root URL is opened.
  // A festival section is only displayed when explicitly selected via query param or active session selection.
  const isFestivalChosen =
    festivalParam === 'durga' ||
    festivalParam === 'kali' ||
    (festivalParam !== null && activeFestival !== null);

  if (!isFestivalChosen) {
    // Initial landing: Render the dedicated Puja Selection page with no pre-selection
    return <SelectPujaView initialSelectedFestival={null} />;
  }

  // Active Festival Dashboard (Durga Puja or Kali Puja)
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* 1. Hero Showcase with Realtime Countdown and Action Buttons */}
      <HeroSection />

      {/* 2. Dedicated Puja Selection & Switcher */}
      <PujaSelectionSection />

      {/* 3. Quick Access Key Shortcuts */}
      <QuickAccess />

      {/* 4. Curated Puja Highlights (Traditional, Art, Routes) */}
      <PujaHighlights />

      {/* 5. Interactive Feature Highlights & Utility Controls */}
      <FeatureFooter />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center" />}>
      <HomeContent />
    </Suspense>
  );
}
