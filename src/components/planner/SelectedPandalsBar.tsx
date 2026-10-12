'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Navigation,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  ArrowRight,
  Route,
  MapPin,
} from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits, formatDistance } from '@/lib/geo';
import { AddCustomPandalModal } from '@/components/planner/AddCustomPandalModal';
import { cn } from '@/lib/utils/cn';

interface SelectedPandalsBarProps {
  className?: string;
  showCustomPandalTrigger?: boolean;
}

export function SelectedPandalsBar({
  className,
  showCustomPandalTrigger = true,
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
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // If already on the planner page, the full interactive planner is rendered on screen.
  // We can hide or simplify the floating bar on /planner to avoid duplicate sticky UI.
  const isPlannerPage = pathname === '/planner';

  const stopCount = currentRouteStops.length;

  if (isPlannerPage) {
    return (
      <>
        {customModalOpen && (
          <AddCustomPandalModal
            isOpen={customModalOpen}
            onClose={() => setCustomModalOpen(false)}
          />
        )}
      </>
    );
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

  return (
    <>
      {/* ── Persistent Floating Selection Bar ── */}
      <aside
        aria-label="Selected Pandals Summary"
        className={cn(
          'fixed z-[1040] left-1/2 -translate-x-1/2 bottom-20 md:bottom-7 pointer-events-auto w-[calc(100%-24px)] max-w-4xl transition-all duration-300 animate-in slide-in-from-bottom-3',
          className
        )}
      >
        <div className="rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-200">
          {/* Expanded Drawer: List of selected stops with individual removal */}
          {isExpanded && stopCount > 0 && (
            <div className="p-4 border-b border-[#eee8e1] dark:border-[#2f2720] bg-[#fdfbf9] dark:bg-[#14110e] space-y-2.5 max-h-56 overflow-y-auto">
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
                    className="p-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] flex items-center justify-between gap-2 text-xs shadow-2xs"
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

          {/* Main Bar: Summary Stats + Add Custom Pandal + Primary 'Plan My Navigation' CTA */}
          <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Stop Count & Expand Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#b42323] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Route className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#242424] dark:text-[#ede5dc]">
                      {stopCount === 0
                        ? (isBn ? 'কোনো মণ্ডপ নির্বাচিত নেই' : '0 Pandals Selected')
                        : isBn
                        ? `${toBengaliDigits(stopCount)}টি মণ্ডপ নির্বাচিত`
                        : `${stopCount} Pandals Selected`}
                    </span>
                    {stopCount > 1 && (
                      <span className="text-xs text-[#776d65] dark:text-[#a89e95] font-sans font-semibold">
                        (~{formatDistance(approxDistance, locale)})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#776d65] dark:text-[#a89e95]">
                    {stopCount === 0
                      ? (isBn ? 'কার্ড থেকে "রুট যোগ" বাটনে চাপ দিন' : 'Click "Add Route" on any card to build your trail')
                      : (isBn ? 'পরিক্রমা তৈরি ও সাজাতে প্রস্তুত' : 'Ready to organize and start navigation')}
                  </p>
                </div>
              </div>

              {stopCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="sm:ml-2 p-1.5 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] hover:text-[#242424] text-xs font-bold flex items-center gap-1 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <span className="hidden sm:inline">{isExpanded ? (isBn ? 'সংক্ষেপ' : 'Collapse') : (isBn ? 'তালিকা' : 'View Stops')}</span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {showCustomPandalTrigger && (
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#201a15] hover:border-[#b42323] text-[#b42323] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{isBn ? 'নিজস্ব মণ্ডপ' : 'Add Custom'}</span>
                  <span className="xs:hidden">{isBn ? 'নতুন' : 'Custom'}</span>
                </button>
              )}

              {/* HIGH PRIORITY USABILITY REQUIREMENT: Direct "Plan My Navigation" Button */}
              {stopCount > 0 ? (
                <Link
                  href="/planner"
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>{isBn ? 'পুজো পরিক্রমা সাজান →' : 'Plan My Navigation →'}</span>
                </Link>
              ) : (
                <Link
                  href="/planner"
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] text-xs font-bold hover:text-[#242424] flex items-center justify-center gap-1.5"
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>{isBn ? 'প্ল্যানার খুলুন' : 'Open Planner'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Add Custom Pandal Modal */}
      <AddCustomPandalModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
      />
    </>
  );
}
