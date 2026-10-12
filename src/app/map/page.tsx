'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PANDALS_DATA } from '@/data/pandals';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { Pandal, LocalityZone } from '@/types';
import { PandalCard } from '@/components/pandals/PandalCard';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Layers, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const PujoMap = dynamic(() => import('@/components/map/PujoMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white dark:bg-[#1a1613] rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] shadow-xs">
      <div className="text-sm font-bold text-[#776d65] dark:text-[#a89e95] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#b42323] animate-ping" />
        <span>Loading Google Maps & Pandals...</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [selectedFilter, setSelectedFilter] = useState<LocalityZone | 'All' | 'Bonedi Bari'>('All');
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [showMetro, setShowMetro] = useState(true);

  const filterOptions: { value: LocalityZone | 'All' | 'Bonedi Bari'; label: string; isSpecial?: boolean }[] = [
    { value: 'All', label: isBn ? 'সব এলাকা' : 'All' },
    { value: 'Bonedi Bari', label: isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari', isSpecial: true },
    { value: 'North Kolkata', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
    { value: 'South Kolkata', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
    { value: 'Central Kolkata', label: isBn ? 'মধ্য কলকাতা' : 'Central Kolkata' },
    { value: 'Salt Lake', label: isBn ? 'সল্টলেক' : 'Salt Lake' },
    { value: 'Dum Dum', label: isBn ? 'দমদম' : 'Dum Dum' },
    { value: 'Behala', label: isBn ? 'বেহালা' : 'Behala' },
    { value: 'Howrah', label: isBn ? 'হাওড়া' : 'Howrah' },
  ];

  const filteredPandals =
    selectedFilter === 'All'
      ? PANDALS_DATA
      : selectedFilter === 'Bonedi Bari'
      ? PANDALS_DATA.filter((p) => Boolean(p.isBonediBari || p.category === 'Bonedi Bari'))
      : PANDALS_DATA.filter((p) => p.zone === selectedFilter);

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col pb-4">
      {/* Zone Switcher & Metro Toggle Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedFilter(opt.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 border shadow-xs active:scale-95',
                selectedFilter === opt.value
                  ? opt.isSpecial
                    ? 'bg-[#800020] text-amber-200 border-[#800020]'
                    : 'bg-[#b42323] text-white border-[#b42323]'
                  : opt.isSpecial
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800 hover:border-[#800020]'
                  : 'bg-white dark:bg-[#1a1613] border-[#eee8e1] dark:border-[#2f2720] text-[#625b55] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white hover:border-[#b42323]/40'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>


        <button
          onClick={() => setShowMetro(!showMetro)}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 shrink-0 transition-all shadow-xs active:scale-95',
            showMetro
              ? 'bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323] border-[#f6ceca] dark:border-[#4a2420]'
              : 'bg-white dark:bg-[#1a1613] text-[#776d65] dark:text-[#a89e95] border-[#eee8e1] dark:border-[#2f2720]'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>{isBn ? 'মেট্রো রুট' : 'Metro Lines'}</span>
        </button>
      </div>

      {/* Map Canvas + Selected Pandal Display */}
      <div className="relative flex-1 flex gap-4 min-h-0">
        <div className="flex-1 h-full rounded-2xl overflow-hidden border border-[#eee8e1] dark:border-[#2f2720] shadow-xs">
          <PujoMap
            pandals={filteredPandals}
            metroStations={METRO_STATIONS_DATA}
            selectedPandalId={selectedPandal?.id || null}
            onSelectPandal={(pandal) => setSelectedPandal(pandal)}
            showMetro={showMetro}
            className="w-full h-full"
          />
        </div>

        {/* Desktop Side Panel */}
        {selectedPandal && (
          <div className="hidden lg:block w-84 shrink-0 h-full overflow-y-auto space-y-2.5 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'নির্বাচিত প্যান্ডেল' : 'Selected Pandal'}
              </span>
              <button
                onClick={() => setSelectedPandal(null)}
                className="text-xs font-bold text-[#776d65] dark:text-[#a89e95] hover:text-[#b42323] p-1 rounded-lg"
              >
                {isBn ? 'বন্ধ করুন ×' : 'Close ×'}
              </button>
            </div>
            <PandalCard pandal={selectedPandal} variant="grid" />
          </div>
        )}

        {/* Mobile / Tablet Floating Bottom Card */}
        {selectedPandal && (
          <div className="lg:hidden absolute bottom-3 inset-x-3 z-30 animate-in slide-in-from-bottom-4 duration-200">
            <div className="relative rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] p-3 shadow-xl">
              <button
                onClick={() => setSelectedPandal(null)}
                aria-label="Close details"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-[#f5f1ec] dark:bg-[#251e18] text-[#776d65] hover:text-[#b42323] z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <PandalCard pandal={selectedPandal} variant="compact" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
