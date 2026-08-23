'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PANDALS_DATA } from '@/data/pandals';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { Pandal, LocalityZone } from '@/types';
import { PandalCard } from '@/components/pandals/PandalCard';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Layers, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const PujoMap = dynamic(() => import('@/components/map/PujoMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-3xl border border-pujo-border shadow-card">
      <div className="text-sm font-bold text-pujo-text-muted">ম্যাপ লোড করা হচ্ছে...</div>
    </div>
  ),
});

export default function MapPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [selectedZone, setSelectedZone] = useState<LocalityZone | 'All'>('All');
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [showMetro, setShowMetro] = useState(true);

  const zoneOptions: { value: LocalityZone | 'All'; label: string }[] = [
    { value: 'All', label: isBn ? 'সব এলাকা' : 'All' },
    { value: 'North Kolkata', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
    { value: 'South Kolkata', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
    { value: 'Central Kolkata', label: isBn ? 'মধ্য কলকাতা' : 'Central Kolkata' },
    { value: 'Salt Lake', label: isBn ? 'সল্টলেক' : 'Salt Lake' },
    { value: 'Dum Dum', label: isBn ? 'দমদম' : 'Dum Dum' },
    { value: 'Behala', label: isBn ? 'বেহালা' : 'Behala' },
    { value: 'Howrah', label: isBn ? 'হাওড়া' : 'Howrah' },
  ];

  const filteredPandals =
    selectedZone === 'All'
      ? PANDALS_DATA
      : PANDALS_DATA.filter((p) => p.zone === selectedZone);

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-14rem)] flex flex-col pb-6">
      {/* Zone Switcher Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {zoneOptions.map((z) => (
            <button
              key={z.value}
              onClick={() => setSelectedZone(z.value)}
              className={cn(
                'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border shadow-sm',
                selectedZone === z.value
                  ? 'bg-pujo-red text-white border-pujo-red'
                  : 'bg-white border-pujo-border text-pujo-text-secondary hover:text-pujo-text-primary hover:border-pujo-red/40'
              )}
            >
              {z.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowMetro(!showMetro)}
          className={cn(
            'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 shrink-0 transition-colors shadow-sm',
            showMetro
              ? 'bg-pujo-red-soft text-pujo-red border-pujo-red-border'
              : 'bg-white text-pujo-text-muted border-pujo-border'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>{isBn ? 'মেট্রো রুট' : 'Metro'}</span>
        </button>
      </div>

      {/* Map + Side Panel */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 h-full rounded-3xl overflow-hidden border border-pujo-border shadow-card">
          <PujoMap
            pandals={filteredPandals}
            metroStations={METRO_STATIONS_DATA}
            selectedPandalId={selectedPandal?.id || null}
            onSelectPandal={(pandal) => setSelectedPandal(pandal)}
            showMetro={showMetro}
            className="w-full h-full"
          />
        </div>

        {selectedPandal && (
          <div className="hidden lg:block w-80 shrink-0 h-full overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-pujo-text-muted">
                {isBn ? 'নির্বাচিত প্যান্ডেল' : 'Selected Pandal'}
              </span>
              <button
                onClick={() => setSelectedPandal(null)}
                className="text-xs font-bold text-pujo-text-muted hover:text-pujo-text-primary"
              >
                বন্ধ &times;
              </button>
            </div>
            <PandalCard pandal={selectedPandal} variant="grid" />
          </div>
        )}
      </div>
    </div>
  );
}
