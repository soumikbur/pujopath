'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PandalFilters } from '@/components/pandals/PandalFilters';
import { PandalGrid } from '@/components/pandals/PandalGrid';
import { PandalService } from '@/lib/services/PandalService';
import { FilterOptions, LocalityZone } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Search, Plus, Building } from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { SelectedPandalsBar } from '@/components/planner/SelectedPandalsBar';
import { AddCustomPandalModal } from '@/components/planner/AddCustomPandalModal';
import { SuggestPandalModal } from '@/components/pandals/SuggestPandalModal';

function ExploreContent() {
  const searchParams = useSearchParams();
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { customPandals } = useFavorites();

  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);

  const initialQuery = searchParams.get('q') || '';
  const initialZone = (searchParams.get('zone') as LocalityZone) || 'All';
  const initialFeatured = searchParams.get('featuredOnly') === 'true';
  const initialHeritage = searchParams.get('heritageOnly') === 'true';
  const initialBonedi = searchParams.get('bonediBariOnly') === 'true' || searchParams.get('category') === 'Bonedi Bari';
  const initialMetro = searchParams.get('metroOnly') === 'true' || searchParams.get('metroAccessibleOnly') === 'true';

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: initialQuery,
    zone: initialZone,
    crowdLevel: 'All',
    category: initialBonedi ? 'Bonedi Bari' : 'All',
    metroAccessibleOnly: initialMetro,
    wheelchairAccessibleOnly: false,
    featuredOnly: initialFeatured,
    heritageOnly: initialHeritage,
    bonediBariOnly: initialBonedi,
    sortBy: 'recommended',
  });

  useEffect(() => {
    const q = searchParams.get('q');
    const z = searchParams.get('zone') as LocalityZone | null;
    const f = searchParams.get('featuredOnly') === 'true';
    const h = searchParams.get('heritageOnly') === 'true';
    const b = searchParams.get('bonediBariOnly') === 'true' || searchParams.get('category') === 'Bonedi Bari';
    const m = searchParams.get('metroOnly') === 'true' || searchParams.get('metroAccessibleOnly') === 'true';

    if (q !== null || z !== null || f || h || b || m) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: q || '',
        zone: z || 'All',
        featuredOnly: f,
        heritageOnly: h,
        bonediBariOnly: b,
        category: b ? 'Bonedi Bari' : prev.category,
        metroAccessibleOnly: m,
      }));
    }
  }, [searchParams]);

  const filteredPandals = PandalService.filterPandals(
    filters,
    undefined,
    undefined,
    customPandals
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-24">
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

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setSuggestModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] hover:border-[#b42323] text-[#4a423d] dark:text-[#c4b9ae] hover:text-[#b42323] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Building className="w-4 h-4 text-[#b42323]" />
            <span>{isBn ? 'নতুন মণ্ডপ প্রস্তাব' : 'Suggest a Missing Pandal'}</span>
          </button>

          {/* Clearly Visible 'Add Custom Pandal' Action Button */}
          <button
            type="button"
            onClick={() => setCustomModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border-2 border-[#b42323] bg-white dark:bg-[#1a1613] hover:bg-[#b42323] text-[#b42323] hover:text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? '+ নিজস্ব মণ্ডপ যোগ করুন' : '+ Add Custom Pandal'}</span>
          </button>
        </div>
      </div>

      <PandalFilters
        filters={filters}
        onChange={setFilters}
        totalCount={filteredPandals.length}
      />

      <PandalGrid pandals={filteredPandals} />

      {/* Persistent Selected-Pandal Summary & Plan My Navigation Bar */}
      <SelectedPandalsBar />

      {/* Add Custom Pandal Modal */}
      <AddCustomPandalModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
      />

      {/* Suggest Missing Pandal Community Modal */}
      <SuggestPandalModal
        isOpen={suggestModalOpen}
        onClose={() => setSuggestModalOpen(false)}
      />
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
