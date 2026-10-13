'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Navigation, Search, Trash2, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { PANDALS_DATA } from '@/data/pandals';
import { PandalCard } from '@/components/pandals/PandalCard';
import { toBengaliDigits } from '@/lib/geo';
import { RouteItinerary } from '@/types';

export default function SavedPage() {
  const router = useRouter();
  const { savedPandalIds, savedRoutes, deleteSavedRoute, loadSavedRoute } = useFavorites();
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const savedPandals = PANDALS_DATA.filter((p) => savedPandalIds.includes(p.id));

  const handleLoadRoute = (route: RouteItinerary) => {
    loadSavedRoute(route);
    router.push('/planner');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-current" />
          <span>{isBn ? 'সংরক্ষিত তালিকা' : 'My Saved Collection'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'সংরক্ষিত প্যান্ডেল ও কাস্টম রুট' : 'Saved Pandals & Custom Routes'}
        </h1>
        <p className="text-sm sm:text-base text-[#776d65] dark:text-[#a89e95] mt-1">
          {isBn
            ? 'আপনার পছন্দের বুকমার্ক করা পূজামণ্ডপ ও তৈরিকৃত পরিক্রমা রুটসমূহ এখানে সংরক্ষিত থাকে।'
            : 'Access your bookmarked pandals and saved route itineraries anytime.'}
        </p>
      </div>

      {/* Saved Pandals Section */}
      <div className="space-y-3.5">
        <h2 className="text-lg font-bold text-[#242424] dark:text-[#ede5dc]">
          {isBn ? `সংরক্ষিত প্যান্ডেল (${toBengaliDigits(savedPandals.length)})` : `Saved Pandals (${savedPandals.length})`}
        </h2>

        {savedPandals.length === 0 ? (
          <div className="p-8 sm:p-10 text-center rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-3">
            <Heart className="w-8 h-8 text-[#b42323] mx-auto opacity-70" />
            <h4 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'কোনো প্যান্ডেল সংরক্ষিত নেই' : 'No Saved Pandals Yet'}
            </h4>
            <p className="text-sm text-[#776d65] dark:text-[#a89e95] max-w-md mx-auto">
              {isBn
                ? 'প্যান্ডেল কার্ডের হার্ট আইকনে ট্যাপ করে আপনার পছন্দের তালিকা তৈরি করুন।'
                : 'Tap the heart icon on any pandal card to bookmark your must-visit collection.'}
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b42323] text-white text-sm font-bold mt-2 shadow-sm transition-all hover:bg-[#971c1c] active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'প্যান্ডেল দেখুন' : 'Explore Pandals'}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {savedPandals.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} variant="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Saved Routes Section */}
      <div className="space-y-3.5 pt-6 border-t border-[#eee8e1] dark:border-[#2f2720]">
        <h2 className="text-lg font-bold text-[#242424] dark:text-[#ede5dc]">
          {isBn ? `সংরক্ষিত পরিক্রমা রুট (${toBengaliDigits(savedRoutes.length)})` : `Saved Route Itineraries (${savedRoutes.length})`}
        </h2>

        {savedRoutes.length === 0 ? (
          <div className="p-8 sm:p-10 text-center rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-3">
            <Navigation className="w-8 h-8 text-[#b42323] mx-auto opacity-70" />
            <h4 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'কোনো সংরক্ষিত রুট নেই' : 'No Saved Routes'}
            </h4>
            <p className="text-sm text-[#776d65] dark:text-[#a89e95] max-w-md mx-auto">
              {isBn
                ? 'রুট প্ল্যানারে গিয়ে নতুন পরিক্রমা তৈরি করুন এবং "রুট সংরক্ষণ করুন" ক্লিক করুন।'
                : 'Create an itinerary in the Route Planner and click "Save Itinerary".'}
            </p>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-[#242424] dark:text-[#ede5dc] hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] text-sm font-bold mt-2 shadow-xs transition-all active:scale-95"
            >
              <span>{isBn ? 'রুট প্ল্যানারে যান' : 'Go to Route Planner'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedRoutes.map((route) => (
              <div
                key={route.id}
                className="p-5 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs flex items-center justify-between gap-4 transition-all hover:border-[#b42323]/40"
              >
                <div>
                  <h4 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">{route.name}</h4>
                  <p className="text-sm text-[#776d65] dark:text-[#a89e95] mt-0.5">
                    {isBn
                      ? `${toBengaliDigits(route.stops.length)}টি মণ্ডপ • ~${toBengaliDigits(route.estimatedDurationMinutes)} মিনিট`
                      : `${route.stops.length} Pandals • ~${route.estimatedDurationMinutes} mins`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLoadRoute(route)}
                    className="px-3.5 py-2 rounded-xl bg-[#f9e9e7] dark:bg-[#341b18] border border-[#f6ceca] dark:border-[#4a2420] text-[#b42323] hover:bg-[#b42323] hover:text-white text-xs sm:text-sm font-bold transition-all active:scale-95"
                  >
                    {isBn ? 'লোড করে দেখুন' : 'Load Trail'}
                  </button>
                  <button
                    onClick={() => deleteSavedRoute(route.id)}
                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors active:scale-95"
                    title={isBn ? 'মুছুন' : 'Delete'}
                    aria-label="Delete saved route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
