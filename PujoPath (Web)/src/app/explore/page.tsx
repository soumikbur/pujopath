'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PandalFilters } from '@/components/pandals/PandalFilters';
import { PandalGrid } from '@/components/pandals/PandalGrid';
import { PandalService } from '@/lib/services/PandalService';
import { FilterOptions, LocalityZone } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { Search } from 'lucide-react';
import { SelectedPandalsBar } from '@/components/planner/SelectedPandalsBar';

const EXPLORE_STORAGE_KEY = 'pujopath_explore_filters';

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  zone: 'All',
  crowdLevel: 'All',
  category: 'All',
  metroAccessibleOnly: false,
  wheelchairAccessibleOnly: false,
  featuredOnly: false,
  heritageOnly: false,
  bonediBariOnly: false,
  sortBy: 'recommended',
};

function parseFiltersFromSearchParams(sp: URLSearchParams): { hasUrlParams: boolean; filters: Partial<FilterOptions> } {
  const parsed: Partial<FilterOptions> = {};
  let hasUrlParams = false;

  const q = sp.get('q');
  if (q !== null && q !== '') {
    parsed.searchQuery = q;
    hasUrlParams = true;
  }

  const zone = sp.get('zone');
  if (zone && zone !== 'All') {
    parsed.zone = zone as LocalityZone;
    hasUrlParams = true;
  }

  if (sp.has('featuredOnly')) {
    parsed.featuredOnly = sp.get('featuredOnly') === 'true';
    hasUrlParams = true;
  }
  if (sp.has('heritageOnly')) {
    parsed.heritageOnly = sp.get('heritageOnly') === 'true';
    hasUrlParams = true;
  }
  if (sp.has('bonediBariOnly') || sp.get('category') === 'Bonedi Bari') {
    const isBonedi = sp.get('bonediBariOnly') === 'true' || sp.get('category') === 'Bonedi Bari';
    parsed.bonediBariOnly = isBonedi;
    if (isBonedi) parsed.category = 'Bonedi Bari';
    hasUrlParams = true;
  }
  if (sp.has('metroOnly') || sp.has('metroAccessibleOnly')) {
    parsed.metroAccessibleOnly =
      sp.get('metroOnly') === 'true' || sp.get('metroAccessibleOnly') === 'true';
    hasUrlParams = true;
  }
  if (sp.has('wheelchair') || sp.has('wheelchairAccessibleOnly')) {
    parsed.wheelchairAccessibleOnly =
      sp.get('wheelchair') === 'true' || sp.get('wheelchairAccessibleOnly') === 'true';
    hasUrlParams = true;
  }
  if (sp.has('sortBy')) {
    parsed.sortBy = sp.get('sortBy') as FilterOptions['sortBy'];
    hasUrlParams = true;
  }

  return { hasUrlParams, filters: parsed };
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const { locale } = useI18n();
  const { customPandals } = useFavorites();
  const isBn = locale === 'bn';

  // Initialize with DEFAULT_FILTERS to ensure SSR and initial client hydration HTML match 100%
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Synchronize from URL params or sessionStorage on mount and when searchParams change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const { hasUrlParams, filters: fromUrl } = parseFiltersFromSearchParams(urlParams);
    if (hasUrlParams) {
      setFilters((prev) => ({ ...prev, ...fromUrl }));
      return;
    }
    try {
      const stored = sessionStorage.getItem(EXPLORE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFilters((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Fallback to default
    }
  }, [searchParams]);

  // Persist filters to sessionStorage and synchronize URL query string
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);

    if (typeof window === 'undefined') return;

    // Check if any filters are active
    const isCustomized =
      Boolean(newFilters.searchQuery) ||
      newFilters.zone !== 'All' ||
      newFilters.metroAccessibleOnly ||
      newFilters.wheelchairAccessibleOnly ||
      newFilters.featuredOnly ||
      newFilters.heritageOnly ||
      newFilters.bonediBariOnly ||
      newFilters.sortBy !== 'recommended';

    if (isCustomized) {
      try {
        sessionStorage.setItem(EXPLORE_STORAGE_KEY, JSON.stringify(newFilters));
      } catch {
        // quota safety
      }
    } else {
      try {
        sessionStorage.removeItem(EXPLORE_STORAGE_KEY);
      } catch {
        // safe
      }
    }

    // Build URL query params without full page reload
    const params = new URLSearchParams();
    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    if (newFilters.zone && newFilters.zone !== 'All') params.set('zone', newFilters.zone);
    if (newFilters.featuredOnly) params.set('featuredOnly', 'true');
    if (newFilters.heritageOnly) params.set('heritageOnly', 'true');
    if (newFilters.bonediBariOnly) params.set('bonediBariOnly', 'true');
    if (newFilters.metroAccessibleOnly) params.set('metroAccessibleOnly', 'true');
    if (newFilters.wheelchairAccessibleOnly) params.set('wheelchairAccessibleOnly', 'true');
    if (newFilters.sortBy && newFilters.sortBy !== 'recommended') params.set('sortBy', newFilters.sortBy);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState({ ...window.history.state }, '', newUrl);
  };

  const filteredPandals = PandalService.filterPandals(
    filters,
    undefined,
    undefined,
    customPandals
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-36 sm:pb-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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

      </div>

      <PandalFilters
        filters={filters}
        onChange={handleFiltersChange}
        totalCount={filteredPandals.length}
      />

      <PandalGrid pandals={filteredPandals} />

      {/* Persistent Selected-Pandal Summary & Plan My Navigation Bar */}
      <SelectedPandalsBar />
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
