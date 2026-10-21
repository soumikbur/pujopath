'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PANDALS_DATA, KALI_PANDALS_DATA } from '@/data/pandals';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { Pandal, LocalityZone } from '@/types';
import { PandalCard } from '@/components/pandals/PandalCard';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { SelectedPandalsBar } from '@/components/planner/SelectedPandalsBar';
import {
  Layers,
  X,
  Maximize2,
  Minimize2,
  Locate,
  Compass,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const PujoMap = dynamic(() => import('@/components/map/PujoMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white dark:bg-[#1a1613] rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] shadow-xs">
      <div className="text-sm font-bold text-[#776d65] dark:text-[#a89e95] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#b42323] animate-ping" />
        <span>Loading Interactive PujoMap...</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { customPandals } = useFavorites();

  const [selectedFilter, setSelectedFilter] = useState<LocalityZone | 'All' | 'Bonedi Bari'>('All');
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [showMetro, setShowMetro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Map camera state
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5726, 88.3639]); // Default Kolkata
  const [mapZoom, setMapZoom] = useState<number>(12);

  // Combine Durga pandals, verified Barasat/Kali pandals, and user custom saved pandals
  const allAvailablePandals = useMemo(() => {
    return [...PANDALS_DATA, ...KALI_PANDALS_DATA, ...customPandals];
  }, [customPandals]);

  const filterOptions: { value: LocalityZone | 'All' | 'Bonedi Bari'; label: string; isSpecial?: boolean }[] = [
    { value: 'All', label: isBn ? 'সব এলাকা' : 'All' },
    { value: 'Bonedi Bari', label: isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari', isSpecial: true },
    { value: 'Barasat' as any, label: isBn ? 'বারাসাত' : 'Barasat' },
    { value: 'Madhyamgram' as any, label: isBn ? 'মধ্যমগ্রাম' : 'Madhyamgram' },
    { value: 'North 24 Parganas' as any, label: isBn ? 'উত্তর ২৪ পরগনা' : 'North 24 Pgs' },
    { value: 'North Kolkata', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
    { value: 'South Kolkata', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
    { value: 'Central Kolkata', label: isBn ? 'মধ্য কলকাতা' : 'Central Kolkata' },
    { value: 'Salt Lake', label: isBn ? 'সল্টলেক' : 'Salt Lake' },
    { value: 'Dum Dum', label: isBn ? 'দমদম' : 'Dum Dum' },
    { value: 'Behala', label: isBn ? 'বেহালা' : 'Behala' },
    { value: 'Howrah', label: isBn ? 'হাওড়া' : 'Howrah' },
  ];

  // Auto-center camera when user selects Barasat or specific zone
  const handleSelectFilter = (zone: LocalityZone | 'All' | 'Bonedi Bari') => {
    setSelectedFilter(zone);
    if (zone === ('Barasat' as any) || zone === ('Madhyamgram' as any)) {
      setMapCenter([22.7245, 88.4745]); // Barasat Junction / Pioneer Park cluster
      setMapZoom(13);
    } else if (zone === 'North Kolkata') {
      setMapCenter([22.598, 88.368]);
      setMapZoom(13);
    } else if (zone === 'South Kolkata') {
      setMapCenter([22.518, 88.355]);
      setMapZoom(13);
    } else if (zone === 'All') {
      setMapCenter([22.5726, 88.3639]);
      setMapZoom(12);
    }
  };

  const filteredPandals = useMemo(() => {
    if (selectedFilter === 'All') {
      return allAvailablePandals;
    }
    if (selectedFilter === 'Bonedi Bari') {
      return allAvailablePandals.filter((p) => Boolean(p.isBonediBari || p.category === 'Bonedi Bari'));
    }
    return allAvailablePandals.filter((p) => p.zone === selectedFilter);
  }, [allAvailablePandals, selectedFilter]);

  // Fullscreen escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPandal) {
          setSelectedPandal(null);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedPandal]);

  // Prevent background scroll when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Browser Geolocation
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert(isBn ? 'আপনার ব্রাউজার লোকেশন সমর্থন করে না।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(15);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed', err);
        alert(
          isBn
            ? 'বর্তমান অবস্থান নির্ণয় করা সম্ভব হয়নি। অনুগ্রহ করে ব্রাউজার সেটিংস থেকে লোকেশন অনুমতি দিন।'
            : 'Could not determine your GPS location. Please check browser location permissions.'
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [isBn]);

  // Recenter helpers
  const handleRecenterKolkata = () => {
    setMapCenter([22.5726, 88.3639]);
    setMapZoom(12);
  };

  const handleRecenterBarasat = () => {
    setSelectedFilter('Barasat' as any);
    setMapCenter([22.7245, 88.4745]);
    setMapZoom(13);
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen bg-[#faf7f2] dark:bg-[#14110e] p-2 sm:p-4'
          : 'space-y-3 sm:space-y-4 max-w-7xl mx-auto h-[calc(100dvh-13.5rem)] sm:h-[calc(100vh-12rem)] min-h-[380px] pb-2 sm:pb-4'
      )}
    >
      {/* Zone Switcher & Metro Toggle Bar (Hidden in Fullscreen to maximize view area) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelectFilter(opt.value)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 border shadow-xs active:scale-95',
                  selectedFilter === opt.value
                    ? opt.isSpecial
                      ? 'bg-[#800020] text-amber-200 border-[#800020]'
                      : opt.value === ('Barasat' as any) || opt.value === ('Madhyamgram' as any)
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-[#b42323] text-white border-[#b42323]'
                    : opt.isSpecial
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800 hover:border-[#800020]'
                    : opt.value === ('Barasat' as any)
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-900/50 hover:border-orange-500'
                    : 'bg-white dark:bg-[#1a1613] border-[#eee8e1] dark:border-[#2f2720] text-[#625b55] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white hover:border-[#b42323]/40'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

            {/* Quick Fullscreen Button in Header Bar */}
            <button
              onClick={() => setIsFullscreen(true)}
              title={isBn ? 'পূর্ণস্ক্রিন মানচিত্র' : 'Fullscreen Map'}
              className="p-2 rounded-xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] hover:text-[#b42323] dark:hover:text-white transition-all shadow-xs"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas + Floating Controls + Selected Pandal Display */}
      <div className="relative flex-1 flex gap-4 min-h-0">
        <div className="relative flex-1 h-full rounded-2xl overflow-hidden border border-[#eee8e1] dark:border-[#2f2720] shadow-xs">
          <PujoMap
            pandals={filteredPandals}
            metroStations={METRO_STATIONS_DATA}
            selectedPandalId={selectedPandal?.id || null}
            onSelectPandal={(pandal) => setSelectedPandal(pandal)}
            showMetro={showMetro}
            center={mapCenter}
            zoom={mapZoom}
            userLocation={userLocation}
            isFullscreen={isFullscreen}
            className="w-full h-full"
          />

          {/* FULLSCREEN TOP-LEFT OVERLAY: EXIT FULLSCREEN & ACTIVE FILTER BADGE */}
          {isFullscreen && (
            <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2.5 animate-in fade-in duration-200">
              <button
                onClick={() => setIsFullscreen(false)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-[#eee8e1] dark:border-[#2f2720] text-xs sm:text-sm font-bold text-[#b42323] dark:text-[#e05656] shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isBn ? 'স্বাভাবিক ভিউ' : 'Exit Fullscreen'}</span>
              </button>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 dark:bg-[#1a1613]/90 backdrop-blur-md border border-[#eee8e1] dark:border-[#2f2720] text-xs font-bold text-[#242424] dark:text-[#ede5dc] shadow-md">
                <span>🪔</span>
                <span>{filterOptions.find((f) => f.value === selectedFilter)?.label || selectedFilter}</span>
                <span className="text-[10px] text-[#776d65] dark:text-[#a89e95]">
                  ({filteredPandals.length})
                </span>
              </div>
            </div>
          )}

          {/* FLOATING ACTION CONTROLS (Top-Right on Map) */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 animate-in fade-in duration-200">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? (isBn ? 'পূর্ণস্ক্রিন বন্ধ' : 'Exit Fullscreen (Esc)') : (isBn ? 'পূর্ণস্ক্রিন মানচিত্র' : 'Enter Fullscreen')}
              className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-[#eee8e1] dark:border-[#2f2720] text-[#242424] dark:text-[#ede5dc] hover:text-[#b42323] dark:hover:text-[#e05656] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Locate Me Geolocation Button */}
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              title={isBn ? 'আমার অবস্থান' : 'My Location'}
              className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-[#eee8e1] dark:border-[#2f2720] text-[#242424] dark:text-[#ede5dc] hover:text-[#b42323] dark:hover:text-[#e05656] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Locate className={cn('w-4 h-4', isLocating && 'animate-spin text-[#0284c7]')} />
            </button>

            {/* Recenter Barasat Button */}
            <button
              onClick={handleRecenterBarasat}
              title={isBn ? 'বারাসাত শ্যামাপূজা ক্লাস্টার' : 'Recenter Barasat Kali Hub'}
              className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/80 backdrop-blur-md border border-orange-200 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 font-bold text-xs"
            >
              BAR
            </button>

            {/* Recenter Kolkata Button */}
            <button
              onClick={handleRecenterKolkata}
              title={isBn ? 'কলকাতা কেন্দ্র করুন' : 'Recenter Kolkata'}
              className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-[#eee8e1] dark:border-[#2f2720] text-[#242424] dark:text-[#ede5dc] hover:text-[#b42323] dark:hover:text-[#e05656] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Zoom In */}
            <button
              onClick={() => setMapZoom((z) => Math.min(z + 1, 18))}
              title="Zoom In"
              className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-[#eee8e1] dark:border-[#2f2720] text-[#242424] dark:text-[#ede5dc] hover:text-[#b42323] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={() => setMapZoom((z) => Math.max(z - 1, 10))}
              title="Zoom Out"
              className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-[#eee8e1] dark:border-[#2f2720] text-[#242424] dark:text-[#ede5dc] hover:text-[#b42323] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Side Panel */}
        {selectedPandal && (
          <div
            className={cn(
              'hidden lg:block w-84 shrink-0 h-full overflow-y-auto space-y-2.5 animate-in slide-in-from-right-4 duration-200',
              isFullscreen && 'z-[1000] p-2 bg-white/95 dark:bg-[#1a1613]/95 rounded-2xl shadow-2xl'
            )}
          >
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

        {/* Mobile / Tablet Floating Card (Positioned safely above bottom nav) */}
        {selectedPandal && (
          <div
            className={cn(
              'lg:hidden fixed z-[1050] max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-200 inset-x-3 sm:inset-x-6',
              isFullscreen ? 'bottom-6' : 'bottom-20 md:bottom-24'
            )}
          >
            <div className="relative rounded-2xl border border-[#eee8e1] dark:border-[#3d3227] bg-white dark:bg-[#1e1915] p-3 shadow-2xl">
              <button
                onClick={() => setSelectedPandal(null)}
                aria-label="Close details"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-[#f5f1ec] dark:bg-[#27201a] text-[#776d65] dark:text-[#a39486] hover:text-[#b42323] z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <PandalCard pandal={selectedPandal} variant="compact" />
            </div>
          </div>
        )}
      </div>

      {/* Floating Selected-Pandal Summary & Plan My Navigation Bar */}
      {!isFullscreen && (
        <>
          {!selectedPandal && <SelectedPandalsBar />}
        </>
      )}
    </div>
  );
}
