'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trash2,
  Sparkles,
  Navigation,
  Save,
  Check,
  Search,
} from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { PANDALS_DATA } from '@/data/pandals';
import { formatDistance, toBengaliDigits } from '@/lib/geo';

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

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSave = () => {
    saveCurrentRoute();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const totalDistance = currentRouteStops.reduce((acc, stop, idx) => {
    if (idx === 0) return 0;
    return acc + 1.2;
  }, 0);

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
      {/* Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 rounded-3xl bg-white border border-pujo-border shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pujo-text-muted">
            {isBn ? 'মোট প্যান্ডেল' : 'Total Stops'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-pujo-text-primary mt-1">
            {isBn ? `${toBengaliDigits(currentRouteStops.length)}টি মণ্ডপ` : `${currentRouteStops.length} Pandals`}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pujo-text-muted">
            {isBn ? 'আনুমানিক দূরত্ব' : 'Est. Distance'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-pujo-red mt-1 font-sans">
            {formatDistance(totalDistance, locale)}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pujo-text-muted">
            {isBn ? 'হাঁটা পথ সময়' : 'Walking Time'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-pujo-text-primary mt-1 font-sans">
            ~{isBn ? toBengaliDigits(Math.round(totalDistance * 16 + currentRouteStops.length * 25)) : Math.round(totalDistance * 16 + currentRouteStops.length * 25)} {isBn ? 'মিনিট' : 'mins'}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <button
            onClick={optimizeCurrentRoute}
            disabled={currentRouteStops.length <= 1}
            className="w-full py-3 px-3 rounded-2xl bg-pujo-red hover:bg-pujo-red-hover active:bg-pujo-red-dark disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBn ? 'স্মার্ট রুট সাজান' : 'Optimize Route'}</span>
          </button>
        </div>
      </div>

      {/* Action Bar */}
      {currentRouteStops.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-pujo-bg-surface border border-pujo-border text-xs sm:text-sm font-bold text-pujo-text-primary flex items-center gap-2 transition-colors shadow-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-pujo-red" />}
              <span>{savedSuccess ? (isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved!') : (isBn ? 'রুট সংরক্ষণ করুন' : 'Save Itinerary')}</span>
            </button>

            <a
              href={generateGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-pujo-red text-white hover:bg-pujo-red-hover text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>{isBn ? 'গুগল ম্যাপে যাত্রা শুরু' : 'Start Navigation'}</span>
            </a>
          </div>

          <button
            onClick={clearCurrentRoute}
            className="text-xs sm:text-sm text-rose-600 hover:underline font-bold"
          >
            {isBn ? 'রুট পরিষ্কার করুন' : 'Clear Route'}
          </button>
        </div>
      )}

      {/* Stops List */}
      {currentRouteStops.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-pujo-border shadow-card space-y-3">
          <Navigation className="w-10 h-10 text-pujo-red mx-auto" />
          <h3 className="font-bold text-lg text-pujo-text-primary">
            {isBn ? 'আপনার রুট তালিকা খালি' : 'Your Route is Empty'}
          </h3>
          <p className="text-sm text-pujo-text-muted max-w-md mx-auto">
            {isBn
              ? 'প্যান্ডেল তালিকায় গিয়ে পছন্দের মণ্ডপে "রুট যোগ করুন" ক্লিক করে নিজের পছন্দমতো পুজো পরিক্রমা তৈরি করুন।'
              : 'Browse pandals in the directory and click "Add Route" to build your personalized hopping trail.'}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-pujo-red text-white text-sm font-bold shadow-sm mt-2"
          >
            <Search className="w-4 h-4" />
            <span>{isBn ? 'প্যান্ডেল দেখুন' : 'Explore Pandals'}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {currentRouteStops.map((stop, idx) => (
            <div
              key={stop.pandalId}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-pujo-border shadow-card flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-pujo-red text-white text-sm font-bold flex items-center justify-center shrink-0 font-sans">
                  {isBn ? toBengaliDigits(idx + 1) : idx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-pujo-text-primary truncate">
                    {isBn ? stop.pandal.nameBn : stop.pandal.name}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-pujo-text-muted truncate">
                    {isBn ? stop.pandal.localityBn : stop.pandal.locality} • {stop.pandal.zone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {idx > 0 && (
                  <button
                    onClick={() => moveRouteStop(idx, idx - 1)}
                    className="p-2 rounded-xl border border-pujo-border text-pujo-text-secondary hover:text-pujo-text-primary text-xs font-bold"
                    title={isBn ? 'উপরে তুলুন' : 'Move Up'}
                  >
                    &uarr;
                  </button>
                )}
                {idx < currentRouteStops.length - 1 && (
                  <button
                    onClick={() => moveRouteStop(idx, idx + 1)}
                    className="p-2 rounded-xl border border-pujo-border text-pujo-text-secondary hover:text-pujo-text-primary text-xs font-bold"
                    title={isBn ? 'নিচে নামান' : 'Move Down'}
                  >
                    &darr;
                  </button>
                )}
                <button
                  onClick={() => removePandalFromRoute(stop.pandalId)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  title={isBn ? 'রুট থেকে মুছুন' : 'Remove Stop'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Quick Add */}
      <div className="p-5 sm:p-6 rounded-3xl bg-pujo-bg-surface border border-pujo-border space-y-3.5">
        <h3 className="text-sm font-bold text-pujo-text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pujo-red" />
          <span>{isBn ? 'জনপ্রিয় প্যান্ডেল দ্রুত যোগ করুন' : 'Quick Add Popular Pandals'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PANDALS_DATA.filter((p) => !currentRouteStops.some((s) => s.pandalId === p.id))
            .slice(0, 3)
            .map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-white border border-pujo-border flex items-center justify-between gap-2 text-sm shadow-sm"
              >
                <div className="min-w-0">
                  <div className="font-bold text-pujo-text-primary truncate">{isBn ? p.nameBn : p.name}</div>
                  <div className="text-xs text-pujo-text-muted truncate">{isBn ? p.localityBn : p.locality}</div>
                </div>
                <button
                  onClick={() => addPandalToRoute(p)}
                  className="px-3 py-1.5 rounded-xl bg-pujo-red-soft border border-pujo-red-border text-pujo-red hover:bg-pujo-red hover:text-white font-bold text-xs shrink-0 transition-colors"
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
