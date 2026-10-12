'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  MapPin,
  Compass,
  ExternalLink,
  AlertTriangle,
  Train,
  Layers,
  Smartphone,
  Info,
  Plus,
} from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { PANDALS_DATA } from '@/data/pandals';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { calculateHaversineDistance, estimateWalkingMinutes, formatDistance, toBengaliDigits } from '@/lib/geo';
import {
  NavigationProvider,
  OriginMode,
  NavigationOrigin,
  buildGoogleMapsUrl,
  buildAppleMapsUrl,
  detectDefaultNavigationProvider,
  requestCurrentGeolocation,
  isValidCoordinate,
} from '@/lib/maps/navigationUrl';
import { AnimatedSegmentedControl } from '@/components/ui/AnimatedSegmentedControl';
import { AddCustomPandalModal } from '@/components/planner/AddCustomPandalModal';
import { cn } from '@/lib/utils/cn';

export function RouteBuilder() {
  const {
    currentRouteStops,
    removePandalFromRoute,
    moveRouteStop,
    optimizeCurrentRoute,
    lastOptimizationResult,
    clearCurrentRoute,
    saveCurrentRoute,
    addPandalToRoute,
    customPandals,
  } = useFavorites();

  const { locale } = useI18n();
  const isBn = locale === 'bn';

  // Navigation settings & states
  const [provider, setProvider] = useState<NavigationProvider>('google');
  const [originMode, setOriginMode] = useState<OriginMode>('app_default');
  const [selectedStationId, setSelectedStationId] = useState<string>(
    METRO_STATIONS_DATA[0]?.id || 'shobhabazar-sutanuti'
  );

  // Quick Add category filter state
  const [quickAddCategory, setQuickAddCategory] = useState<string>('all');
  const [quickAddSearch, setQuickAddSearch] = useState<string>('');
  const [quickAddLimit, setQuickAddLimit] = useState<number>(12);

  const totalBonediCount = useMemo(
    () => PANDALS_DATA.filter((p) => p.isBonediBari || p.category === 'Bonedi Bari').length,
    []
  );

  // GPS Location state
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Feedback states
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [optimizedSuccess, setOptimizedSuccess] = useState(false);

  // Initialize recommended provider on client mount
  useEffect(() => {
    try {
      const detected = detectDefaultNavigationProvider();
      setProvider(detected);
    } catch {
      // Fallback to google
    }
  }, []);

  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Request device GPS location on-demand
  const handleAcquireLocation = async () => {
    setIsLocating(true);
    setGpsError(null);
    try {
      const coords = await requestCurrentGeolocation(10000);
      setGpsLocation({ lat: coords.lat, lng: coords.lng });
      setOriginMode('current_location');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Location request failed';
      setGpsError(msg);
    } finally {
      setIsLocating(false);
    }
  };

  // Resolve current active NavigationOrigin
  const activeOrigin: NavigationOrigin = useMemo(() => {
    if (originMode === 'current_location' && gpsLocation) {
      return {
        mode: 'current_location',
        lat: gpsLocation.lat,
        lng: gpsLocation.lng,
        label: `My GPS Location (${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)})`,
        labelBn: `আমার জিপিএস অবস্থান (${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)})`,
      };
    }

    if (originMode === 'custom_station') {
      const station = METRO_STATIONS_DATA.find((s) => s.id === selectedStationId);
      if (station) {
        return {
          mode: 'custom_station',
          lat: station.latitude,
          lng: station.longitude,
          label: `${station.name} Metro`,
          labelBn: `${station.nameBn} মেট্রো`,
        };
      }
    }

    if (originMode === 'first_pandal' && currentRouteStops.length > 0) {
      const firstStop = currentRouteStops[0];
      return {
        mode: 'first_pandal',
        lat: firstStop.pandal.latitude,
        lng: firstStop.pandal.longitude,
        label: firstStop.pandal.name,
        labelBn: firstStop.pandal.nameBn,
      };
    }

    return {
      mode: 'app_default',
      label: 'Mapping App Device Location',
      labelBn: 'ম্যাপিং অ্যাপের স্বয়ংক্রিয় অবস্থান',
    };
  }, [originMode, gpsLocation, selectedStationId, currentRouteStops]);

  const handleSave = () => {
    saveCurrentRoute();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleOptimize = () => {
    const originCoords =
      (originMode === 'current_location' || originMode === 'custom_station') &&
      typeof activeOrigin.lat === 'number' &&
      typeof activeOrigin.lng === 'number'
        ? { lat: activeOrigin.lat, lng: activeOrigin.lng }
        : null;

    const result = optimizeCurrentRoute(originCoords);
    if (result) {
      setOptimizedSuccess(true);
      setTimeout(() => setOptimizedSuccess(false), 2500);
    }
  };

  // Check for invalid coordinates
  const invalidStops = useMemo(() => {
    return currentRouteStops.filter(
      (s) => !isValidCoordinate(s.pandal.latitude, s.pandal.longitude)
    );
  }, [currentRouteStops]);

  // Generate NavigationPlan based on selected provider and stops
  const navigationPlan = useMemo(() => {
    if (currentRouteStops.length === 0 || invalidStops.length > 0) {
      return null;
    }
    if (provider === 'apple') {
      return buildAppleMapsUrl(currentRouteStops, activeOrigin);
    }
    return buildGoogleMapsUrl(currentRouteStops, activeOrigin);
  }, [currentRouteStops, activeOrigin, provider, invalidStops]);

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

  // Filtered available pandals for Route Planner Explorer / Quick-Add (merging static and custom pandals)
  const availablePandals = useMemo(() => {
    const all = [...PANDALS_DATA, ...customPandals];
    let list = all.filter((p) => !currentRouteStops.some((s) => s.pandalId === p.id));

    if (quickAddCategory === 'bonedi-bari') {
      list = list.filter((p) => p.isBonediBari || p.category === 'Bonedi Bari');
    } else if (quickAddCategory === 'north') {
      list = list.filter((p) => p.zone === 'North Kolkata');
    } else if (quickAddCategory === 'south') {
      list = list.filter((p) => p.zone === 'South Kolkata');
    } else if (quickAddCategory === 'central') {
      list = list.filter((p) => p.zone === 'Central Kolkata');
    } else if (quickAddCategory === 'east') {
      list = list.filter((p) => p.zone === 'Salt Lake' || p.zone === 'New Town');
    }

    if (quickAddSearch.trim()) {
      const q = quickAddSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameBn.includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.localityBn.includes(q)
      );
    }

    return list;
  }, [currentRouteStops, customPandals, quickAddCategory, quickAddSearch]);

  const handleAddAllBonediBari = () => {
    const bonediList = PANDALS_DATA.filter(
      (p) => (p.isBonediBari || p.category === 'Bonedi Bari') && !currentRouteStops.some((s) => s.pandalId === p.id)
    );
    bonediList.forEach((p) => addPandalToRoute(p));
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          STAGE B / STATS HEADER: Distance, Time, Optimization
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
            {isBn ? 'মোট প্যান্ডেল' : 'Total Stops'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-1 font-sans">
            {isBn ? `${toBengaliDigits(currentRouteStops.length)}টি মণ্ডপ` : `${currentRouteStops.length} Pandals`}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
            {isBn ? 'হাঁটার দূরত্ব' : 'Walking Distance'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#b42323] mt-1 font-sans">
            {formatDistance(totalDistance, locale)}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
            {isBn ? 'আনুমানিক সময়' : 'Est. Duration'}
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
            title={isBn ? 'স্মার্ট নিকটতম দূরত্ব অ্যালগরিদম দিয়ে সাজান' : 'Optimize stop sequence for shortest walking distance'}
          >
            {optimizedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{optimizedSuccess ? (isBn ? 'সাজানো হয়েছে!' : 'Optimized!') : (isBn ? 'স্মার্ট সাজান' : 'Optimize Trail')}</span>
          </button>
        </div>
      </div>

      {/* 2-Opt Optimization Feedback Banner */}
      {lastOptimizationResult && (
        <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isBn
                ? `রুট স্মার্ট অপ্টিমাইজ হয়েছে! নিকটবর্তী মণ্ডপগুলো পরপর সাজানো হয়েছে (${lastOptimizationResult.savingsPercent}% দূরত্ব সাশ্রয়, ~${lastOptimizationResult.savingsKm} কিমি)।`
                : `Trail optimized! Consecutive visits to nearby pandals saved ~${lastOptimizationResult.savingsKm} km (${lastOptimizationResult.savingsPercent}% reduction).`}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 pl-6">
            {isBn
              ? '* সরলরেখা দূরত্বের অনুমান; বাস্তব সড়ক পথের অবস্থা ও ট্র্যাফিকের ওপর নির্ভর করে পরিবর্তন হতে পারে।'
              : '* Straight-line distance estimate; actual road travel may vary.'}
          </p>
          {lastOptimizationResult.hasUnresolvedStops && (
            <p className="text-[11px] text-amber-700 dark:text-amber-300 pl-6 font-semibold">
              {isBn
                ? `⚠️ দ্রষ্টব্য: ${lastOptimizationResult.unresolvedCount}টি কাস্টম মণ্ডপের স্থানাঙ্ক না থাকায় সেগুলোকে রুটের শেষে রাখা হয়েছে।`
                : `⚠️ Notice: ${lastOptimizationResult.unresolvedCount} stop(s) (${lastOptimizationResult.unresolvedStopNames.join(', ')}) lack coordinates and were placed at the end.`}
            </p>
          )}
        </div>
      )}

      {/* Save, Add Custom Pandal & Clear Controls */}
      {currentRouteStops.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs sm:text-sm font-bold text-[#242424] dark:text-[#ede5dc] hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] flex items-center gap-2 transition-all active:scale-95 shadow-xs"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-[#b42323]" />}
              <span>{savedSuccess ? (isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved to Itineraries!') : (isBn ? 'রুট সংরক্ষণ করুন' : 'Save Itinerary')}</span>
            </button>

            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border-2 border-[#b42323] bg-white dark:bg-[#1a1613] hover:bg-[#b42323] text-[#b42323] hover:text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all active:scale-95 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ নিজস্ব মণ্ডপ যোগ করুন' : '+ Add Custom Pandal'}</span>
            </button>
          </div>

          <button
            onClick={clearCurrentRoute}
            className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 hover:underline font-bold"
          >
            {isBn ? 'সম্পূর্ণ রুট পরিষ্কার করুন' : 'Clear Route'}
          </button>
        </div>
      )}

      {/* =========================================================================
          STAGE C: NAVIGATION LAUNCH HUB (Starting Point & Provider Selection)
         ========================================================================= */}
      {currentRouteStops.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#b42323]/20 dark:border-[#b42323]/30 bg-gradient-to-br from-white via-[#fdfbf9] to-[#faf5f0] dark:from-[#1a1613] dark:via-[#1f1915] dark:to-[#171310] shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee8e1] dark:border-[#2f2720] pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b42323]">
                <Compass className="w-4 h-4" />
                <span>{isBn ? 'পরিক্রমা ন্যাভিগেশন কন্ট্রোল' : 'Trail Navigation Hub'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#242424] dark:text-[#ede5dc] mt-0.5">
                {isBn ? 'ম্যাপিং অ্যাপে পরিক্রমা শুরু করুন' : 'Launch Route in Maps'}
              </h3>
            </div>
            <span className="text-xs text-[#776d65] dark:text-[#a89e95] bg-[#f2ece4] dark:bg-[#251e18] px-2.5 py-1 rounded-full self-start sm:self-auto font-medium">
              {isBn ? 'বহিঃস্থ ন্যাভিগেশন কেবল ক্লিকেই খুলবে' : 'External app opens only on click'}
            </span>
          </div>

          {/* 1. Origin / Starting Point Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#b42323]" />
              <span>{isBn ? 'যাত্রা শুরুর স্থান (Origin)' : 'Starting Location (Origin)'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {/* Option: App Default (GPS via map app) */}
              <button
                type="button"
                onClick={() => setOriginMode('app_default')}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between gap-1',
                  originMode === 'app_default'
                    ? 'border-[#b42323] bg-[#b42323]/5 dark:bg-[#b42323]/15 text-[#b42323]'
                    : 'border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-[#625b55] dark:text-[#a89e95] hover:border-[#b42323]/40'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{isBn ? 'ম্যাপের বর্তমান অবস্থান' : "App's Live GPS"}</span>
                  {originMode === 'app_default' && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] font-normal text-[#776d65] dark:text-[#8d837a]">
                  {isBn ? 'ম্যাপ অ্যাপ নিজে বর্তমান অবস্থান নির্ণয় করবে' : 'Navigation app detects your location'}
                </span>
              </button>

              {/* Option: Browser GPS On-Demand */}
              <button
                type="button"
                onClick={() => {
                  if (gpsLocation) {
                    setOriginMode('current_location');
                  } else {
                    handleAcquireLocation();
                  }
                }}
                disabled={isLocating}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between gap-1',
                  originMode === 'current_location'
                    ? 'border-[#b42323] bg-[#b42323]/5 dark:bg-[#b42323]/15 text-[#b42323]'
                    : 'border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-[#625b55] dark:text-[#a89e95] hover:border-[#b42323]/40'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{isLocating ? (isBn ? 'অবস্থান খোঁজা হচ্ছে...' : 'Locating GPS...') : (isBn ? 'আমার বর্তমান জিপিএস' : 'My Current GPS')}</span>
                  {originMode === 'current_location' && gpsLocation && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] font-normal text-[#776d65] dark:text-[#8d837a]">
                  {gpsLocation
                    ? `${gpsLocation.lat.toFixed(3)}, ${gpsLocation.lng.toFixed(3)}`
                    : (isBn ? 'ক্লিক করে সঠিক জিপিএস অনুমতি দিন' : 'Click to acquire precise GPS')}
                </span>
              </button>

              {/* Option: Metro Station */}
              <button
                type="button"
                onClick={() => setOriginMode('custom_station')}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between gap-1',
                  originMode === 'custom_station'
                    ? 'border-[#b42323] bg-[#b42323]/5 dark:bg-[#b42323]/15 text-[#b42323]'
                    : 'border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-[#625b55] dark:text-[#a89e95] hover:border-[#b42323]/40'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Train className="w-3 h-3 text-[#b42323]" />
                    <span>{isBn ? 'কলকাতা মেট্রো স্টেশন' : 'Metro Station'}</span>
                  </span>
                  {originMode === 'custom_station' && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] font-normal text-[#776d65] dark:text-[#8d837a]">
                  {isBn ? 'মেট্রো থেকে হাঁটা শুরু করুন' : 'Start walking from a transit stop'}
                </span>
              </button>

              {/* Option: First Pandal */}
              <button
                type="button"
                onClick={() => setOriginMode('first_pandal')}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between gap-1',
                  originMode === 'first_pandal'
                    ? 'border-[#b42323] bg-[#b42323]/5 dark:bg-[#b42323]/15 text-[#b42323]'
                    : 'border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-[#625b55] dark:text-[#a89e95] hover:border-[#b42323]/40'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{isBn ? 'প্রথম প্যান্ডেল থেকে' : 'First Pandal (#1)'}</span>
                  {originMode === 'first_pandal' && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] font-normal text-[#776d65] dark:text-[#8d837a] truncate">
                  {currentRouteStops[0] ? (isBn ? currentRouteStops[0].pandal.nameBn : currentRouteStops[0].pandal.name) : 'Stop 1'}
                </span>
              </button>
            </div>

            {/* GPS Error feedback if denied or timed out */}
            {gpsError && (
              <div className="text-xs p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>{gpsError}</span>
                <button
                  onClick={() => setGpsError(null)}
                  className="font-bold underline ml-2 cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Dismiss'}
                </button>
              </div>
            )}

            {/* Metro Station Selector dropdown if custom_station is active */}
            {originMode === 'custom_station' && (
              <div className="pt-1">
                <label className="text-[11px] font-bold text-[#776d65] dark:text-[#a89e95] block mb-1">
                  {isBn ? 'মেট্রো স্টেশন নির্বাচন করুন:' : 'Select Kolkata Metro Station:'}
                </label>
                <select
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                  className="w-full sm:w-80 p-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-[#242424] dark:text-[#ede5dc] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b42323]"
                >
                  {METRO_STATIONS_DATA.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name} ({station.line.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Provider Selection (Google Maps vs Apple Maps) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#b42323]" />
              <span>{isBn ? 'ন্যাভিগেশন প্রোভাইডার নির্বাচন' : 'Navigation Provider'}</span>
            </label>

            <AnimatedSegmentedControl<NavigationProvider>
              options={[
                {
                  id: 'google',
                  label: 'Google Maps',
                  badge: isBn ? 'Android / Web' : 'Android & Web',
                },
                {
                  id: 'apple',
                  label: 'Apple Maps',
                  badge: isBn ? 'iOS / Mac' : 'iOS & Mac',
                },
              ]}
              value={provider}
              onChange={setProvider}
              ariaLabel={isBn ? 'ন্যাভিগেশন প্রোভাইডার নির্বাচন' : 'Navigation Provider Selection'}
            />
          </div>

          {/* Validation Warning if invalid coordinates */}
          {invalidStops.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {isBn ? 'নিচের মণ্ডপগুলোর স্থানাঙ্ক অনুপস্থিত বা ত্রুটিপূর্ণ:' : 'The following pandals have invalid coordinates:'}
                </p>
                <ul className="list-disc list-inside mt-1">
                  {invalidStops.map((s) => (
                    <li key={s.pandalId}>{isBn ? s.pandal.nameBn : s.pandal.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Provider Informational Notes */}
          {navigationPlan?.notes && (
            <div className="p-3.5 rounded-xl bg-[#f5efe8] dark:bg-[#251e18] border border-[#e8ded3] dark:border-[#382d24] text-xs text-[#776d65] dark:text-[#a89e95] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#b42323] shrink-0 mt-0.5" />
              <span>{isBn ? navigationPlan.notesBn : navigationPlan.notes}</span>
            </div>
          )}

          {/* 3. Primary Navigation Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={navigationPlan?.primaryUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!navigationPlan || invalidStops.length > 0}
              onClick={(e) => {
                if (!navigationPlan || invalidStops.length > 0) {
                  e.preventDefault();
                }
              }}
              className={cn(
                'px-6 py-3.5 rounded-xl bg-[#b42323] text-white hover:bg-[#971c1c] text-sm sm:text-base font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95',
                (!navigationPlan || invalidStops.length > 0) &&
                  'opacity-50 pointer-events-none cursor-not-allowed shadow-none'
              )}
            >
              <Navigation className="w-5 h-5 fill-current" />
              <span>
                {navigationPlan?.requiresMultiSegment
                  ? (isBn ? 'প্রথম লেগ শুরু করুন (Start Leg 1)' : 'Start Pandal Hopping (Leg 1)')
                  : (isBn ? 'পুজো পরিক্রমা শুরু করুন' : 'Start Pandal Hopping')}
              </span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

            <div className="text-xs text-[#776d65] dark:text-[#a89e95] flex flex-col justify-center">
              <span className="font-semibold text-[#242424] dark:text-[#ede5dc]">
                {provider === 'google' ? 'Google Maps Walking Trail' : 'Apple Maps Walking Trail'}
              </span>
              <span>
                {isBn
                  ? `শুরুর স্থান: ${activeOrigin.labelBn || activeOrigin.label}`
                  : `Starting from: ${activeOrigin.label}`}
              </span>
            </div>
          </div>

          {/* 4. Sequential Leg Cards (For multi-segment routes or Apple Maps leg-by-leg) */}
          {navigationPlan && navigationPlan.requiresMultiSegment && navigationPlan.segments.length > 1 && (
            <div className="pt-3 border-t border-[#eee8e1] dark:border-[#2f2720] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                <Layers className="w-3.5 h-3.5 text-[#b42323]" />
                <span>{isBn ? 'ধাপ অনুযায়ী সম্পূর্ণ পরিক্রমা লেগসমূহ' : 'Sequential Trail Legs'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {navigationPlan.segments.map((seg) => (
                  <div
                    key={seg.segmentIndex}
                    className="p-3.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#242424] dark:text-[#ede5dc]">
                        {isBn ? seg.titleBn : seg.title}
                      </div>
                      <div className="text-[11px] text-[#776d65] dark:text-[#a89e95] truncate">
                        {seg.startName} → {seg.endName}
                      </div>
                    </div>
                    <a
                      href={seg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#b42323]/10 dark:bg-[#b42323]/25 text-[#b42323] hover:bg-[#b42323] hover:text-white font-bold text-xs shrink-0 transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>{isBn ? 'খুলুন' : 'Open'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STAGE A: PLAN YOUR TRAIL (Stops list with reordering, remove, empty state)
         ========================================================================= */}
      {currentRouteStops.length === 0 ? (
        <div className="p-10 sm:p-12 text-center rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-3">
          <Navigation className="w-10 h-10 text-[#b42323] mx-auto opacity-80" />
          <h3 className="font-bold text-lg text-[#242424] dark:text-[#ede5dc]">
            {isBn ? 'আপনার পুজো পরিক্রমা তালিকা খালি' : 'Your Puja Trail is Empty'}
          </h3>
          <p className="text-sm text-[#776d65] dark:text-[#a89e95] max-w-md mx-auto">
            {isBn
              ? 'প্যান্ডেল তালিকায় গিয়ে যেকোনো মণ্ডপে "রুট যোগ করুন" বাটনে ক্লিক করে নিজের পছন্দমতো পরিক্রমা তৈরি করুন অথবা সরাসরি যেকোনো নতুন মণ্ডপ যোগ করুন।'
              : 'Browse pandals in the directory and click "Add Route" to build your personalized walking trail, or add your own custom pandal.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b42323] text-white text-sm font-bold shadow-sm transition-all hover:bg-[#971c1c] active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'প্যান্ডেল সন্ধান করুন' : 'Explore Pandals'}</span>
            </Link>
            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#b42323] bg-white dark:bg-[#1a1613] text-[#b42323] hover:bg-[#b42323] hover:text-white text-sm font-extrabold transition-all active:scale-95 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ নিজস্ব মণ্ডপ যোগ করুন' : '+ Add Custom Pandal'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
              {isBn ? 'পরিক্রমা গন্তব্য তালিকা (ক্রমানুসারে)' : 'Planned Stops (In Order)'}
            </span>
            <span className="text-xs text-[#776d65] dark:text-[#a89e95]">
              {isBn ? 'তীর চিহ্নে ক্লিক করে ক্রম পরিবর্তন করুন' : 'Use arrows to reorder stops'}
            </span>
          </div>

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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc] truncate">
                      {isBn ? stop.pandal.nameBn : stop.pandal.name}
                    </h4>
                    {stop.pandal.isUserAdded && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold shrink-0 border border-purple-200 dark:border-purple-800">
                        {isBn ? '👤 নিজস্ব যোগ' : '👤 User Added'}
                      </span>
                    )}
                    {stop.pandal.hasUnresolvedCoordinates && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold shrink-0 border border-amber-200 dark:border-amber-800">
                        {isBn ? '⚠️ স্থানাঙ্ক অনুপস্থিত' : '⚠️ Missing Coordinates'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#776d65] dark:text-[#a89e95] truncate mt-0.5">
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

      {/* =========================================================================
          STAGE D: ROUTE PANDAL EXPLORER & QUICK ADD (With Animated Filter Control)
         ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b42323]" />
              <span>{isBn ? 'পরিক্রমায় নতুন মণ্ডপ যোগ করুন' : 'Add Pandals to Your Trail'}</span>
            </h3>
            <p className="text-xs text-[#776d65] dark:text-[#a89e95] mt-0.5">
              {isBn
                ? 'অঞ্চল বা বনেদি বাড়ি বিভাগ নির্বাচন করে সহজে পছন্দের মণ্ডপগুলো যোগ করুন অথবা নিজস্ব মণ্ডপ যুক্ত করুন।'
                : 'Filter by locality, heritage houses, or add your own custom pandal.'}
            </p>
          </div>

          {/* Quick Search & Add Custom Button */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 text-[#776d65] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={quickAddSearch}
                onChange={(e) => setQuickAddSearch(e.target.value)}
                placeholder={isBn ? 'মণ্ডপ বা এলাকা খুঁজুন...' : 'Search pandals...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
              />
            </div>

            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border-2 border-[#b42323] bg-white dark:bg-[#1a1613] hover:bg-[#b42323] text-[#b42323] hover:text-white text-xs font-bold shrink-0 transition-all active:scale-95 shadow-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isBn ? '+ নিজস্ব' : '+ Custom'}</span>
            </button>
          </div>
        </div>

        {/* Animated Segmented Filter Bar */}
        <div className="pt-1">
          <AnimatedSegmentedControl<string>
            options={[
              { id: 'all', label: isBn ? 'সকল মণ্ডপ' : 'All Pandals' },
              {
                id: 'bonedi-bari',
                label: isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari',
                badge: isBn ? toBengaliDigits(totalBonediCount) : String(totalBonediCount),
              },
              { id: 'north', label: isBn ? 'উত্তর কলকাতা' : 'North' },
              { id: 'south', label: isBn ? 'দক্ষিণ কলকাতা' : 'South' },
              { id: 'central', label: isBn ? 'মধ্য কলকাতা' : 'Central' },
              { id: 'east', label: isBn ? 'সল্টলেক ও পূর্ব' : 'Salt Lake & East' },
            ]}
            value={quickAddCategory}
            onChange={(cat) => {
              setQuickAddCategory(cat);
              setQuickAddLimit(12);
            }}
            size="sm"
            ariaLabel={isBn ? 'রুট প্ল্যানার প্যান্ডেল ফিল্টার' : 'Route planner pandal filter'}
          />
        </div>

        {/* Bonedi Bari Special Quick-Action */}
        {quickAddCategory === 'bonedi-bari' && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="text-xs text-[#776d65] dark:text-[#c4b5a7]">
              <span className="font-bold text-[#b42323] dark:text-amber-400 block sm:inline">
                {isBn ? '🏛️ ঐতিহ্যবাহী পারিবারিক বনেদি পুজো' : '🏛️ Traditional Heritage Family Pujas'}
              </span>
              <span className="sm:ml-2">
                {isBn
                  ? 'শোভাবাজার, জোড়াসাঁকো, দার্জিপাড়া ও জানবাজারের ঐতিহাসিক পারিবারিক পুজো।'
                  : 'Historical heritage pujas of Sovabazar, Jorasanko, Darjipara, and Janbazar.'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddAllBonediBari}
              className="px-3.5 py-1.5 rounded-lg bg-[#b42323] hover:bg-[#971c1c] text-white text-xs font-bold shrink-0 transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>+</span>
              <span>{isBn ? 'সব বনেদি পুজো যোগ করুন' : 'Add All Bonedi Bari Pujas'}</span>
            </button>
          </div>
        )}

        {/* Available Pandals Cards Grid */}
        {availablePandals.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#776d65] dark:text-[#a89e95] bg-white dark:bg-[#1a1613] rounded-xl border border-[#eee8e1] dark:border-[#2f2720]">
            {isBn
              ? 'এই বিভাগের সকল মণ্ডপ ইতিমধ্যেই আপনার পরিক্রমা তালিকায় যুক্ত আছে।'
              : 'All pandals in this category are already added to your itinerary.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePandals.slice(0, quickAddLimit).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] flex items-center justify-between gap-2.5 shadow-xs transition-all hover:border-[#b42323]/40"
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] truncate">
                    {isBn ? p.nameBn : p.name}
                  </div>
                  <div className="text-[11px] text-[#776d65] dark:text-[#a89e95] truncate">
                    {isBn ? p.localityBn : p.locality} • {p.zone}
                  </div>
                  {p.isBonediBari && (
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold">
                      {isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari'}
                    </span>
                  )}
                  {p.isUserAdded && (
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                      {isBn ? '👤 নিজস্ব যোগ' : '👤 User Added'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addPandalToRoute(p)}
                  className="px-3 py-1.5 rounded-lg bg-[#f9e9e7] dark:bg-[#341b18] border border-[#f6ceca] dark:border-[#4a2420] text-[#b42323] hover:bg-[#b42323] hover:text-white font-bold text-xs shrink-0 transition-all active:scale-95"
                  title={isBn ? 'পরিক্রমায় যোগ করুন' : 'Add to route'}
                >
                  + {isBn ? 'যোগ' : 'Add'}
                </button>
              </div>
            ))}

            {availablePandals.length > quickAddLimit && (
              <div className="col-span-full pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setQuickAddLimit((prev) => prev + 12)}
                  className="px-4 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] hover:border-[#b42323] text-[#4a423d] dark:text-[#c4b9ae] hover:text-[#b42323] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  {isBn
                    ? `আরও মণ্ডপ দেখুন (+${toBengaliDigits(Math.min(12, availablePandals.length - quickAddLimit))})`
                    : `Show More Pandals (+${Math.min(12, availablePandals.length - quickAddLimit)})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Custom Pandal Modal */}
      <AddCustomPandalModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
      />
    </div>
  );
}
