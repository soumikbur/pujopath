'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Sparkles,
  Navigation,
  Save,
  Check,
  Search,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { PANDALS_DATA } from '@/data/pandals';
import { calculateHaversineDistance, estimateWalkingMinutes, formatDistance, toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

export function RouteBuilder() {
  const {
    currentRouteStops,
    removePandalFromRoute,
    moveRouteStop,
    optimizeCurrentRoute,
    clearCurrentRoute,
    saveCurrentRoute,
    addPandalToRoute,
  } = useFavorites();

  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [optimizedSuccess, setOptimizedSuccess] = useState(false);

  const handleSave = () => {
    saveCurrentRoute();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleOptimize = () => {
    optimizeCurrentRoute();
    setOptimizedSuccess(true);
    setTimeout(() => setOptimizedSuccess(false), 2000);
  };

  // Accurate great-circle distance between sequential stops
  const totalDistance = currentRouteStops.reduce((acc, stop, idx) => {
    if (idx === 0) return 0;
    const prev = currentRouteStops[idx - 1];
    return (
      acc +
      calculateHaversineDistance(
        prev.pandal.latitude,
        prev.pandal.longitude,
        stop.pandal.latitude,
        stop.pandal.longitude
      )
    );
  }, 0);

  const totalWalkingMins = currentRouteStops.length > 0
    ? Math.round(estimateWalkingMinutes(totalDistance) + currentRouteStops.length * 20)
    : 0;

  const generateGoogleMapsUrl = () => {
    if (currentRouteStops.length === 0) return '#';
    const origin = `${currentRouteStops[0].pandal.latitude},${currentRouteStops[0].pandal.longitude}`;
    const destination = `${currentRouteStops[currentRouteStops.length - 1].pandal.latitude},${currentRouteStops[currentRouteStops.length - 1].pandal.longitude}`;
    const waypoints = currentRouteStops
      .slice(1, -1)
      .map((s) => `${s.pandal.latitude},${s.pandal.longitude}`)
      .join('|');

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=walking`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
            {isBn ? 'মোট প্যান্ডেল' : 'Total Stops'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-1">
            {isBn ? `${toBengaliDigits(currentRouteStops.length)}টি মণ্ডপ` : `${currentRouteStops.length} Pandals`}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
            {isBn ? 'প্রকৃত দূরত্ব' : 'True Distance'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#b42323] mt-1 font-sans">
            {formatDistance(totalDistance, locale)}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
            {isBn ? 'আনুমানিক সময়' : 'Est. Time'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-1 font-sans">
            ~{isBn ? toBengaliDigits(totalWalkingMins) : totalWalkingMins} {isBn ? 'মিনিট' : 'mins'}
          </div>
        </div>

        <div className="flex items-center pt-2 sm:pt-0">
          <button
            onClick={handleOptimize}
            disabled={currentRouteStops.length <= 1}
            className={cn(
              'w-full py-2.5 px-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-95',
              optimizedSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-[#b42323] hover:bg-[#971c1c] disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            {optimizedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{optimizedSuccess ? (isBn ? 'সাজানো হয়েছে!' : 'Optimized!') : (isBn ? 'স্মার্ট সাজান' : 'Optimize Trail')}</span>
          </button>
        </div>
      </div>

      {/* Action Bar */}
      {currentRouteStops.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs sm:text-sm font-bold text-[#242424] dark:text-[#ede5dc] hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] flex items-center gap-2 transition-all active:scale-95 shadow-xs"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-[#b42323]" />}
              <span>{savedSuccess ? (isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved to Itineraries!') : (isBn ? 'রুট সংরক্ষণ করুন' : 'Save Itinerary')}</span>
            </button>

            <a
              href={generateGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#b42323] text-white hover:bg-[#971c1c] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>{isBn ? 'গুগল ম্যাপে ন্যাভিগেশন' : 'Start Google Navigation'}</span>
            </a>
          </div>

          <button
            onClick={clearCurrentRoute}
            className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 hover:underline font-bold"
          >
            {isBn ? 'রুট পরিষ্কার করুন' : 'Clear Route'}
          </button>
        </div>
      )}

      {/* Stops List */}
      {currentRouteStops.length === 0 ? (
        <div className="p-10 sm:p-12 text-center rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-3">
          <Navigation className="w-10 h-10 text-[#b42323] mx-auto opacity-80" />
          <h3 className="font-bold text-lg text-[#242424] dark:text-[#ede5dc]">
            {isBn ? 'আপনার পুজো পরিক্রমা তালিকা খালি' : 'Your Puja Trail is Empty'}
          </h3>
          <p className="text-sm text-[#776d65] dark:text-[#a89e95] max-w-md mx-auto">
            {isBn
              ? 'প্যান্ডেল তালিকায় গিয়ে যেকোনো মণ্ডপে "রুট যোগ করুন" বাটনে ক্লিক করে নিজের পছন্দমতো পরিক্রমা তৈরি করুন।'
              : 'Browse pandals in the directory and click "Add Route" to build your personalized walking or metro hopping route.'}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b42323] text-white text-sm font-bold shadow-sm transition-all hover:bg-[#971c1c] active:scale-95 mt-2"
          >
            <Search className="w-4 h-4" />
            <span>{isBn ? 'প্যান্ডেল সন্ধান করুন' : 'Explore Pandals'}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {currentRouteStops.map((stop, idx) => (
            <div
              key={stop.pandalId}
              className="p-4 sm:p-5 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs flex items-center justify-between gap-4 transition-all hover:border-[#b42323]/40"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#b42323] text-white text-sm font-bold flex items-center justify-center shrink-0 font-sans shadow-xs">
                  {isBn ? toBengaliDigits(idx + 1) : idx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc] truncate">
                    {isBn ? stop.pandal.nameBn : stop.pandal.name}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-[#776d65] dark:text-[#a89e95] truncate">
                    {isBn ? stop.pandal.localityBn : stop.pandal.locality} • {stop.pandal.zone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {idx > 0 && (
                  <button
                    onClick={() => moveRouteStop(idx, idx - 1)}
                    className="p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] text-[#625b55] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white text-xs font-bold transition-colors active:scale-95"
                    title={isBn ? 'উপরে তুলুন' : 'Move Up'}
                    aria-label="Move stop up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                )}
                {idx < currentRouteStops.length - 1 && (
                  <button
                    onClick={() => moveRouteStop(idx, idx + 1)}
                    className="p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] text-[#625b55] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white text-xs font-bold transition-colors active:scale-95"
                    title={isBn ? 'নিচে নামান' : 'Move Down'}
                    aria-label="Move stop down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => removePandalFromRoute(stop.pandalId)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors active:scale-95"
                  title={isBn ? 'রুট থেকে মুছুন' : 'Remove Stop'}
                  aria-label="Remove stop from route"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Quick Add Section */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] space-y-3.5">
        <h3 className="text-sm font-bold text-[#242424] dark:text-[#ede5dc] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b42323]" />
          <span>{isBn ? 'জনপ্রিয় প্যান্ডেল দ্রুত যোগ করুন' : 'Quick Add Popular Pandals'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PANDALS_DATA.filter((p) => !currentRouteStops.some((s) => s.pandalId === p.id))
            .slice(0, 3)
            .map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] flex items-center justify-between gap-2 text-sm shadow-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#242424] dark:text-[#ede5dc] truncate">{isBn ? p.nameBn : p.name}</div>
                  <div className="text-xs text-[#776d65] dark:text-[#a89e95] truncate">{isBn ? p.localityBn : p.locality}</div>
                </div>
                <button
                  onClick={() => addPandalToRoute(p)}
                  className="px-3 py-1.5 rounded-lg bg-[#f9e9e7] dark:bg-[#341b18] border border-[#f6ceca] dark:border-[#4a2420] text-[#b42323] hover:bg-[#b42323] hover:text-white font-bold text-xs shrink-0 transition-all active:scale-95"
                >
                  + {isBn ? 'যোগ' : 'Add'}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
