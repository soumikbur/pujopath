'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PandalFilters } from '@/components/pandals/PandalFilters';
import { PandalGrid } from '@/components/pandals/PandalGrid';
import { PandalService } from '@/lib/services/PandalService';
import { FilterOptions, LocalityZone } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Search } from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const initialQuery = searchParams.get('q') || '';
  const initialZone = (searchParams.get('zone') as LocalityZone) || 'All';
  const initialFeatured = searchParams.get('featuredOnly') === 'true';
  const initialHeritage = searchParams.get('heritageOnly') === 'true';
  const initialMetro = searchParams.get('metroOnly') === 'true' || searchParams.get('metroAccessibleOnly') === 'true';

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: initialQuery,
    zone: initialZone,
    crowdLevel: 'All',
    category: 'All',
    metroAccessibleOnly: initialMetro,
    wheelchairAccessibleOnly: false,
    featuredOnly: initialFeatured,
    heritageOnly: initialHeritage,
    sortBy: 'recommended',
  });

  useEffect(() => {
    const q = searchParams.get('q');
    const z = searchParams.get('zone') as LocalityZone | null;
    const f = searchParams.get('featuredOnly') === 'true';
    const h = searchParams.get('heritageOnly') === 'true';
    const m = searchParams.get('metroOnly') === 'true' || searchParams.get('metroAccessibleOnly') === 'true';

    if (q !== null || z !== null || f || h || m) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: q || '',
        zone: z || 'All',
        featuredOnly: f,
        heritageOnly: h,
        metroAccessibleOnly: m,
      }));
    }
  }, [searchParams]);

  const filteredPandals = PandalService.filterPandals(filters);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>{isBn ? 'প্যান্ডেল সন্ধান' : 'Pandal Directory'}</span>
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-[#242424] dark:text-[#ede5dc] sm:text-4xl">
          {isBn ? 'প্যান্ডেল খুঁজুন' : 'Explore Kolkata Pandals'}
        </h1>
        <p className="text-sm sm:text-base text-[#776d65] dark:text-[#a89e95] mt-1 max-w-3xl">
          {isBn
            ? 'নাম, এলাকা, থিম বা নিকটতম মেট্রো স্টেশন দিয়ে কলকাতার সেরা পূজামণ্ডপ খুঁজুন।'
            : 'Filter by heritage traditions, thematic craftsmanship, nearby metro stations, and crowd levels.'}
        </p>
      </div>

      <PandalFilters
        filters={filters}
        onChange={setFilters}
        totalCount={filteredPandals.length}
      />

      <PandalGrid pandals={filteredPandals} />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-[#776d65] dark:text-[#a89e95] font-bold">Loading Pandals...</div>}>
      <ExploreContent />
    </React.Suspense>
  );
}
