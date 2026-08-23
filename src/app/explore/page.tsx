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

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: initialQuery,
    zone: initialZone,
    crowdLevel: 'All',
    category: 'All',
    metroAccessibleOnly: false,
    wheelchairAccessibleOnly: false,
    featuredOnly: initialFeatured,
    heritageOnly: false,
    sortBy: 'recommended',
  });

  useEffect(() => {
    const q = searchParams.get('q');
    const z = searchParams.get('zone') as LocalityZone | null;
    const f = searchParams.get('featuredOnly') === 'true';
    if (q !== null || z !== null || f) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: q || '',
        zone: z || 'All',
        featuredOnly: f,
      }));
    }
  }, [searchParams]);

  const filteredPandals = PandalService.filterPandals(filters);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div>
        <div className="flex items-center gap-2 text-pujo-red text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>{isBn ? 'প্যান্ডেল সন্ধান' : 'Pandal Explorer'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-pujo-text-primary mt-1 tracking-tight">
          {isBn ? 'কলকাতার শ্রেষ্ঠ পূজামণ্ডপ অন্বেষণ' : 'Explore Durga Puja Pandals'}
        </h1>
        <p className="text-sm sm:text-base text-pujo-text-muted mt-1 max-w-3xl">
          {isBn
            ? 'উত্তর, দক্ষিণ, মধ্য কলকাতা, সল্টলেক ও সংলগ্ন অঞ্চলের সেরা থিম পুজো, ঐতিহাসিক বনেদি বাড়ির সাবেকি আরাধনা ও শ্রেষ্ঠ শিল্পকর্ম দেখুন।'
            : 'Discover iconic community celebrations, art installations, and traditional Bonedi Bari pujas across Bengal.'}
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
    <React.Suspense fallback={<div className="p-12 text-center text-pujo-text-muted font-bold">Loading Pandals...</div>}>
      <ExploreContent />
    </React.Suspense>
  );
}
