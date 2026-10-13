'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Navigation,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  Route,
  Minus,
} from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits, formatDistance } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

interface SelectedPandalsBarProps {
  className?: string;
}

export function SelectedPandalsBar({
  className,
}: SelectedPandalsBarProps) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const {
    currentRouteStops,
    removePandalFromRoute,
    clearCurrentRoute,
  } = useFavorites();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const stopCount = currentRouteStops.length;
  const prevCountRef = useRef(stopCount);

  // Re-open bar when user adds a new pandal
  useEffect(() => {
    if (stopCount > prevCountRef.current) {
      setIsDismissed(false);
      setIsMinimized(false);
    }
    prevCountRef.current = stopCount;
  }, [stopCount]);

  // If already on the planner page, the full interactive planner is rendered on screen.
  const isPlannerPage = pathname === '/planner';

  if (isPlannerPage || isDismissed) {
    return null;
  }

  // Calculate approximate route distance
  const approxDistance = currentRouteStops.reduce((acc, stop, idx) => {
    if (idx === 0) return 0;
    const prev = currentRouteStops[idx - 1];
    const lat1 = prev.pandal.latitude;
    const lng1 = prev.pandal.longitude;
    const lat2 = stop.pandal.latitude;
    const lng2 = stop.pandal.longitude;
    if (!lat1 || !lat2) return acc;
    // Haversine approximation
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return acc + R * c;
  }, 0);

  // ── 1. Empty State (stopCount === 0): Normal Document Flow on Mobile, Unobtrusive Docked on Desktop ──
  if (stopCount === 0) {
    return (
      <aside
        aria-label="Selected Pandals Summary"
        className={cn(
          'relative w-full max-w-4xl mx-auto my-6 px-3 sm:px-4 md:fixed md:bottom-7 md:inset-x-4 md:px-0 md:my-0 md:z-[1040] pointer-events-auto transition-all duration-300',
          className
        )}
      >
        <div className="rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-xl shadow-md p-3 sm:p-3.5 transition-all duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Left: Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#b42323]/10 dark:bg-[#b42323]/20 text-[#b42323] dark:text-[#ff7b7b] flex items-center justify-center font-bold shadow-xs shrink-0">
                <Route className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-[#242424] dark:text-[#ede5dc] truncate">
                  {isBn ? 'কোনো মণ্ডপ নির্বাচিত নেই' : '0 Pandals Selected'}
                </h3>
                <p className="text-[11px] text-[#776d65] dark:text-[#a89e95] truncate sm:whitespace-normal">
                  {isBn ? 'কার্ড থেকে "রুট যোগ" বাটনে চাপ দিন' : 'Click "Add Route" on any card to build your trail'}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <Link
                href="/planner"
                className="flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] text-xs font-bold hover:text-[#242424] dark:hover:text-[#ede5dc] hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Route className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্ল্যানার খুলুন' : 'Open Planner'}</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss empty bar"
                className="p-1.5 sm:p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] hover:text-[#b42323] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // ── 2. Minimized Floating Chip (When user clicks minimize on mobile or desktop) ──
  if (isMinimized) {
    return (
      <div className="fixed z-[1040] right-3 sm:right-6 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-7 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand route summary"
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#eee8e1] dark:border-[#2f2720] bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-xl shadow-lg hover:shadow-xl text-xs font-bold text-[#242424] dark:text-[#ede5dc] transition-all active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-[#b42323] text-white flex items-center justify-center text-[11px] font-black shrink-0">
            <Route className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold">
            {isBn ? `${toBengaliDigits(stopCount)}টি মণ্ডপ` : `${stopCount} Pandals`}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-[#776d65] dark:text-[#a89e95]" />
        </button>
      </div>
    );
  }

  // ── 3. Active Selection Bar: Sleek, Compact Single Row with Drawer ──
  return (
    <aside
      aria-label="Selected Pandals Summary"
      className={cn(
        'fixed z-[1040] inset-x-2.5 sm:inset-x-4 max-w-4xl mx-auto bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-7 pointer-events-auto transition-all duration-300',
        className
      )}
    >
      <div className="rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-200">
        {/* Expanded Drawer: List of selected stops with individual removal */}
        {isExpanded && (
          <div className="p-3 sm:p-4 border-b border-[#eee8e1] dark:border-[#2f2720] bg-[#fdfbf9] dark:bg-[#14110e] space-y-2.5 max-h-52 overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-bold text-[#776d65] dark:text-[#a89e95]">
              <span>
                {isBn
                  ? `নির্বাচিত মণ্ডপসমূহ (${toBengaliDigits(stopCount)}টি):`
                  : `Selected Pandals (${stopCount} stops):`}
              </span>
              <button
                type="button"
                onClick={clearCurrentRoute}
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'সব মুছুন' : 'Clear All'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentRouteStops.map((stop, idx) => (
                <div
                  key={stop.pandalId}
                  className="p-2 sm:p-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] flex items-center justify-between gap-2 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#b42323] text-white text-[11px] font-bold flex items-center justify-center shrink-0 font-sans">
                      {isBn ? toBengaliDigits(idx + 1) : idx + 1}
                    </span>
                    <span className="font-bold text-[#242424] dark:text-[#ede5dc] truncate">
                      {isBn ? stop.pandal.nameBn : stop.pandal.name}
                    </span>
                    {stop.pandal.isUserAdded && (
                      <span className="text-[10px] px-1 py-0.2 rounded-sm bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold shrink-0">
                        {isBn ? 'নিজস্ব' : 'Custom'}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePandalFromRoute(stop.pandalId)}
                    aria-label={`Remove ${stop.pandal.name}`}
                    className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Bar: Compact, Non-Obstructive Row */}
        <div className="p-2 sm:p-3 flex items-center justify-between gap-1 sm:gap-2.5">
          {/* Left: Stop Count & Distance */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#b42323] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Route className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-xs sm:text-sm font-black text-[#242424] dark:text-[#ede5dc] truncate">
                  {isBn
                    ? `${toBengaliDigits(stopCount)}টি নির্বাচিত`
                    : `${stopCount} Selected`}
                </span>
                {stopCount > 1 && (
                  <span className="hidden sm:inline text-[10px] sm:text-xs text-[#776d65] dark:text-[#a89e95] font-sans font-semibold shrink-0">
                    (~{formatDistance(approxDistance, locale)})
                  </span>
                )}
              </div>
              <p className="hidden md:block text-[11px] text-[#776d65] dark:text-[#a89e95] truncate">
                {isBn ? 'পরিক্রমা তৈরি ও সাজাতে প্রস্তুত' : 'Ready to organize and start navigation'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* View Stops Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-[#ede5dc] text-xs font-bold flex items-center gap-1 transition-colors"
              aria-expanded={isExpanded}
              title={isExpanded ? (isBn ? 'সংক্ষেপ' : 'Collapse') : (isBn ? 'তালিকা' : 'View Stops')}
            >
              <span className="hidden sm:inline">
                {isExpanded ? (isBn ? 'সংক্ষেপ' : 'Collapse') : (isBn ? 'তালিকা' : 'View Stops')}
              </span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            {/* Primary Action Button */}
            <Link
              href="/planner"
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white text-[11px] sm:text-xs font-extrabold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
            >
              <Navigation className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="whitespace-nowrap">
                {isBn ? 'পরিক্রমা সাজান →' : 'Plan My Navigation →'}
              </span>
            </Link>

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize bar"
              title={isBn ? 'ছোট করুন' : 'Minimize'}
              className="p-1.5 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-[#ede5dc] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Dismiss */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss bar"
              title={isBn ? 'বন্ধ করুন' : 'Dismiss'}
              className="p-1.5 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] hover:text-[#b42323] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

