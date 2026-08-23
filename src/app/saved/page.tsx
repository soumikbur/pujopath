'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Navigation, Search, Trash2 } from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { PANDALS_DATA } from '@/data/pandals';
import { PandalCard } from '@/components/pandals/PandalCard';
import { toBengaliDigits } from '@/lib/geo';

export default function SavedPage() {
  const { savedPandalIds, savedRoutes, deleteSavedRoute, loadSavedRoute } = useFavorites();
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const savedPandals = PANDALS_DATA.filter((p) => savedPandalIds.includes(p.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-pujo-red text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-current" />
          <span>{isBn ? 'সংরক্ষিত তালিকা' : 'My Saved Items'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-pujo-text-primary mt-1 tracking-tight">
          {isBn ? 'সংরক্ষিত প্যান্ডেল ও কাস্টম রুট' : 'Saved Pandals & Custom Routes'}
        </h1>
        <p className="text-sm sm:text-base text-pujo-text-muted mt-1">
          {isBn
            ? 'আপনার পছন্দের বুকমার্ক করা পূজামণ্ডপ ও তৈরিকৃত পরিক্রমা রুটসমূহ এখানে সংরক্ষিত থাকে।'
            : 'Access your bookmarked pandals and saved route itineraries anytime.'}
        </p>
      </div>

      {/* Saved Pandals */}
      <div className="space-y-3.5">
        <h2 className="text-lg font-bold text-pujo-text-primary">
          {isBn ? `সংরক্ষিত প্যান্ডেল (${toBengaliDigits(savedPandals.length)})` : `Saved Pandals (${savedPandals.length})`}
        </h2>

        {savedPandals.length === 0 ? (
          <div className="p-8 sm:p-10 text-center bg-white rounded-3xl border border-pujo-border shadow-card space-y-3">
            <Heart className="w-8 h-8 text-pujo-red mx-auto" />
            <h4 className="text-base font-bold text-pujo-text-primary">
              {isBn ? 'কোনো প্যান্ডেল সংরক্ষিত নেই' : 'No Saved Pandals Yet'}
            </h4>
            <p className="text-sm text-pujo-text-muted max-w-md mx-auto">
              {isBn
                ? 'প্যান্ডেল কার্ডের হার্ট আইকনে ট্যাপ করে আপনার পছন্দের তালিকা তৈরি করুন।'
                : 'Tap the heart icon on any pandal card to add it to your must-visit collection.'}
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-pujo-red text-white text-sm font-bold mt-2 shadow-sm"
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

      {/* Saved Routes */}
      <div className="space-y-3.5 pt-6 border-t border-pujo-border">
        <h2 className="text-lg font-bold text-pujo-text-primary">
          {isBn ? `সংরক্ষিত পরিক্রমা রুট (${toBengaliDigits(savedRoutes.length)})` : `Saved Route Itineraries (${savedRoutes.length})`}
        </h2>

        {savedRoutes.length === 0 ? (
          <div className="p-8 sm:p-10 text-center bg-white rounded-3xl border border-pujo-border shadow-card space-y-3">
            <Navigation className="w-8 h-8 text-pujo-red mx-auto" />
            <h4 className="text-base font-bold text-pujo-text-primary">
              {isBn ? 'কোনো সংরক্ষিত রুট নেই' : 'No Saved Routes'}
            </h4>
            <p className="text-sm text-pujo-text-muted max-w-md mx-auto">
              {isBn
                ? 'রুট প্ল্যানারে গিয়ে নতুন পরিক্রমা তৈরি করুন এবং "রুট সংরক্ষণ করুন" ক্লিক করুন।'
                : 'Create an itinerary in the Route Planner and click "Save Itinerary".'}
            </p>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-pujo-bg-surface border border-pujo-border text-pujo-text-primary text-sm font-bold mt-2"
            >
              <span>{isBn ? 'রুট প্ল্যানারে যান' : 'Go to Route Planner'}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedRoutes.map((route) => (
              <div
                key={route.id}
                className="p-5 rounded-2xl bg-white border border-pujo-border shadow-card flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-base font-bold text-pujo-text-primary">{route.name}</h4>
                  <p className="text-sm text-pujo-text-muted mt-0.5">
                    {isBn
                      ? `${toBengaliDigits(route.stops.length)}টি মণ্ডপ • ~${toBengaliDigits(route.estimatedDurationMinutes)} মিনিট`
                      : `${route.stops.length} Pandals • ~${route.estimatedDurationMinutes} mins`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadSavedRoute(route)}
                    className="px-3.5 py-2 rounded-xl bg-pujo-red-soft border border-pujo-red-border text-pujo-red hover:bg-pujo-red hover:text-white text-xs sm:text-sm font-bold transition-colors"
                  >
                    {isBn ? 'লোড' : 'Load'}
                  </button>
                  <button
                    onClick={() => deleteSavedRoute(route.id)}
                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title={isBn ? 'মুছুন' : 'Delete'}
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
