'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Train,
  Clock,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Moon,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { PANDALS_DATA } from '@/data/pandals';
import { MetroService } from '@/lib/services/MetroService';
import { useI18n } from '@/lib/i18n/I18nContext';
import { AnimatedSegmentedControl } from '@/components/ui/AnimatedSegmentedControl';
import { cn } from '@/lib/utils/cn';

type MetroViewTab = 'special' | 'normal' | 'stations';

export default function MetroPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [activeTab, setActiveTab] = useState<MetroViewTab>('special');
  const [selectedStationLine, setSelectedStationLine] = useState<
    'All' | 'Blue Line (North-South)' | 'Green Line (East-West)'
  >('All');

  const festivalTimetables = MetroService.getFestivalSpecialTimetables();
  const normalTimetables = MetroService.getNormalTimetables();

  const filteredStations =
    selectedStationLine === 'All'
      ? METRO_STATIONS_DATA
      : METRO_STATIONS_DATA.filter((s) => s.line === selectedStationLine);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Train className="w-4 h-4" />
          <span>{isBn ? 'মেট্রো রেল সময়সূচি' : 'Transit Schedules'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'কলকাতা মেট্রো পুজো পরিক্রমা ও সময়সূচি' : 'Kolkata Metro Timetable & Puja Guide'}
        </h1>
        <p className="text-sm sm:text-base text-[#776d65] dark:text-[#a89e95] mt-1">
          {isBn
            ? 'স্বাভাবিক ট্রেনের সূচি এবং ২০২৬ দুর্গাপূজায় সারারাত মেট্রো পরিষেবার অফিশিয়াল সময়তালিকা।'
            : 'Official Kolkata Metro Railway operating hours, first/last trains, and 2026 Durga Puja all-night special services.'}
        </p>
      </div>

      {/* Segmented Control Navigation */}
      <div className="pt-1">
        <AnimatedSegmentedControl<MetroViewTab>
          options={[
            {
              id: 'special',
              label: isBn ? '🌙 শারদীয়া বিশেষ সারারাত সূচি' : '🌙 2026 Puja Night Special',
              badge: isBn ? 'ভোর ৪টা' : 'Till 4 AM',
            },
            {
              id: 'normal',
              label: isBn ? '⏱️ নিয়মিত ট্রেনের সূচি' : '⏱️ Regular Timetables',
            },
            {
              id: 'stations',
              label: isBn ? '🚇 স্টেশন ও সংলগ্ন মণ্ডপ' : '🚇 Stations & Pandals',
            },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          ariaLabel={isBn ? 'মেট্রো সেকশন নির্বাচন' : 'Metro Section Navigation'}
        />
      </div>

      {/* =========================================================================
          TAB 1: DURGA PUJA 2026 SPECIAL TIMETABLE (All-Night Service Lead)
         ========================================================================= */}
      {activeTab === 'special' && (
        <div className="space-y-5">
          {/* Highlight Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#8d1c1c] via-[#b42323] to-[#701515] text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5" />
                <span>{isBn ? 'সারারাত মেট্রো পরিষেবা' : 'All-Night Metro Service'}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-900 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'সপ্তমী • অষ্টমী • নবমী' : 'Saptami • Ashtami • Navami'}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {isBn
                ? 'দুপুর ১:০০টা থেকে পরের দিন ভোর ৪:০০টা পর্যন্ত নিরবচ্ছিন্ন ট্রেন'
                : 'Overnight Trains Running 1:00 PM to 4:00 AM Next Morning'}
            </h2>

            <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
              {isBn
                ? 'ব্লু লাইন (দক্ষিণেশ্বর - কবি সুভাষ) এবং গ্রীন লাইনে (হাওড়া ময়দান - সেক্টর ৫) ১৭ থেকে ১৯ অক্টোবর গভীর রাত পর্যন্ত প্রতি ৬ মিনিটে ট্রেন চলবে। যাত্রীদের সুবিধার জন্য অফিসিয়াল রেলওয়ে বিজ্ঞপ্তির ভিত্তিতে প্রস্তুত।'
                : 'Special overnight operations on the Blue Line (Dakshineswar – Kavi Subhash) and Green Line (Howrah Maidan – Salt Lake Sector V) with 6-minute peak frequency for pandal hoppers.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/80 border-t border-white/20">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{isBn ? 'যাচাই তারিখ: ১২ অক্টোবর ২০২৬' : 'Verified: 12 October 2026'}</span>
              </div>
              <a
                href="https://mtp.indianrailways.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white hover:underline font-bold"
              >
                <span>{isBn ? 'অফিসিয়াল পোর্টাল (MTP Indian Railways)' : 'Official Indian Railways Notice'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Cards Grid for Festival Schedules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {festivalTimetables.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'p-5 sm:p-6 rounded-2xl border bg-white dark:bg-[#1a1613] shadow-xs space-y-3.5 transition-all',
                  item.status === 'suspended'
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                    : 'border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323]/40'
                )}
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#eee8e1] dark:border-[#2f2720] pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? item.lineNameBn : item.lineName}
                    </h3>
                    <div className="text-xs text-[#776d65] dark:text-[#a89e95] flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-[#b42323]" />
                      <span>{isBn ? item.dateRangeBn : item.dateRange}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0',
                      item.status === 'overnight_special'
                        ? 'bg-rose-100 dark:bg-rose-950/50 text-[#b42323] dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : item.status === 'suspended'
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    )}
                  >
                    {item.status === 'overnight_special'
                      ? (isBn ? '🌙 সারারাত স্পেশাল' : '🌙 All-Night')
                      : item.status === 'suspended'
                      ? (isBn ? 'স্থগিত বিজ্ঞপ্তি' : 'Suspended')
                      : (isBn ? 'বিশেষ বর্ধিত' : 'Extended')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#fcfaf7] dark:bg-[#14110e] p-3 rounded-xl border border-[#f0eae1] dark:border-[#27201a]">
                  <div>
                    <span className="text-[#776d65] dark:text-[#8d8277] block font-medium">
                      {isBn ? 'প্রথম ট্রেন' : 'First Train'}
                    </span>
                    <span className="font-bold text-[#242424] dark:text-[#ede5dc] text-sm font-sans">
                      {item.firstTrain}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#776d65] dark:text-[#8d8277] block font-medium">
                      {isBn ? 'সর্বশেষ ট্রেন' : 'Last Train'}
                    </span>
                    <span className="font-bold text-[#b42323] text-sm font-sans">
                      {item.lastTrain}
                    </span>
                  </div>
                </div>

                {item.peakFrequencyMinutes && (
                  <div className="flex items-center gap-2 text-xs text-[#776d65] dark:text-[#a89e95]">
                    <Clock className="w-3.5 h-3.5 text-[#b42323]" />
                    <span>
                      {isBn
                        ? `সর্বোচ্চ ভিড়ের সময় ব্যবধান: প্রতি ${item.peakFrequencyMinutes} মিনিট`
                        : `Peak Headway: Every ${item.peakFrequencyMinutes} minutes`}
                    </span>
                  </div>
                )}

                <p className="text-xs text-[#625b55] dark:text-[#a89e95] leading-relaxed">
                  {isBn ? item.notesBn : item.notes}
                </p>

                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-[#776d65] dark:text-[#8d8277]">
                  <span>{item.sourceName}</span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#b42323] underline flex items-center gap-1 font-medium"
                  >
                    <span>{isBn ? 'বিজ্ঞপ্তি দেখুন' : 'Notice'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: REGULAR OPERATING TIMETABLES (Standard Calendar)
         ========================================================================= */}
      {activeTab === 'normal' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              {isBn
                ? 'নিয়মিত দিনগুলোতে প্রযোজ্য সাধারণ সূচি। উৎসবের বিশেষ দিনগুলোতে উৎসব স্পেশাল ট্যাব দেখুন।'
                : 'Standard non-festival operating hours verified from Metro Railway Kolkata official records.'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {normalTimetables.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#eee8e1] dark:border-[#2f2720] pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? item.lineNameBn : item.lineName}
                    </h3>
                    <div className="text-xs text-[#776d65] dark:text-[#a89e95] mt-0.5">
                      {isBn ? item.dayTypeBn : item.dayType}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shrink-0">
                    {isBn ? 'স্বাভাবিক সূচি' : 'Standard'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#fcfaf7] dark:bg-[#14110e] p-3 rounded-xl border border-[#f0eae1] dark:border-[#27201a]">
                  <div>
                    <span className="text-[#776d65] dark:text-[#8d8277] block font-medium">
                      {isBn ? 'প্রথম ট্রেন' : 'First Train'}
                    </span>
                    <span className="font-bold text-[#242424] dark:text-[#ede5dc] text-sm font-sans">
                      {item.firstTrain}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#776d65] dark:text-[#8d8277] block font-medium">
                      {isBn ? 'সর্বশেষ ট্রেন' : 'Last Train'}
                    </span>
                    <span className="font-bold text-[#b42323] text-sm font-sans">
                      {item.lastTrain}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[#625b55] dark:text-[#a89e95]">
                  <p>
                    <span className="font-bold text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? 'দিকসমূহ:' : 'Directions:'}
                    </span>{' '}
                    {(isBn ? item.directionsBn : item.directions).join(' • ')}
                  </p>
                  {item.peakFrequencyMinutes && (
                    <p>
                      <span className="font-bold text-[#242424] dark:text-[#ede5dc]">
                        {isBn ? 'ব্যবধান:' : 'Frequency:'}
                      </span>{' '}
                      {item.peakFrequencyMinutes}–{item.offPeakFrequencyMinutes}{' '}
                      {isBn ? 'মিনিট' : 'mins'}
                    </p>
                  )}
                  <p className="pt-1">{isBn ? item.notesBn : item.notes}</p>
                </div>

                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-[#776d65] dark:text-[#8d8277]">
                  <span>{item.sourceName}</span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#b42323] underline flex items-center gap-1 font-medium"
                  >
                    <span>{isBn ? 'অফিসিয়াল সূচি' : 'Official Page'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: STATIONS AND WALKABLE PANDALS
         ========================================================================= */}
      {activeTab === 'stations' && (
        <div className="space-y-4">
          {/* Line Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'All', label: isBn ? 'সকল লাইন' : 'All Lines' },
              {
                id: 'Blue Line (North-South)',
                label: isBn ? 'ব্লু লাইন (উত্তর-দক্ষিণ)' : 'Blue Line (North-South)',
              },
              {
                id: 'Green Line (East-West)',
                label: isBn ? 'গ্রীন লাইন (পূর্ব-পশ্চিম)' : 'Green Line (East-West)',
              },
            ].map((line) => (
              <button
                key={line.id}
                onClick={() => setSelectedStationLine(line.id as typeof selectedStationLine)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-150 whitespace-nowrap active:scale-95 shadow-xs',
                  selectedStationLine === line.id
                    ? 'bg-[#b42323] text-white border-[#b42323]'
                    : 'bg-white dark:bg-[#1a1613] border-[#eee8e1] dark:border-[#2f2720] text-[#625b55] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white hover:border-[#b42323]/50'
                )}
              >
                {line.label}
              </button>
            ))}
          </div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className="p-5 sm:p-6 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-3.5 transition-all hover:border-[#b42323]/30"
              >
                <div className="flex items-center justify-between border-b border-[#eee8e1] dark:border-[#2f2720] pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? station.nameBn : station.name}
                    </h3>
                    <span className="text-xs text-[#776d65] dark:text-[#a89e95]">
                      {station.address}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold shadow-xs',
                      station.line.includes('Blue')
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    )}
                  >
                    {station.line.includes('Blue')
                      ? isBn
                        ? 'ব্লু লাইন'
                        : 'Blue Line'
                      : isBn
                      ? 'গ্রীন লাইন'
                      : 'Green Line'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b42323] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isBn ? 'হাঁটা দূরত্বের পুজোসমূহ' : 'Walkable Iconic Pandals'}</span>
                  </span>
                  <div className="space-y-1.5">
                    {station.nearbyPandalIds.map((pandalId) => {
                      const pandal = PANDALS_DATA.find(
                        (p) => p.id === pandalId || p.slug === pandalId
                      );
                      const displayName = pandal
                        ? isBn
                          ? pandal.nameBn
                          : pandal.name
                        : pandalId.replace(/-/g, ' ');
                      const targetSlug = pandal?.slug || pandalId;

                      return (
                        <Link
                          key={pandalId}
                          href={`/pandals/${targetSlug}`}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] hover:bg-[#fcfaf7] dark:hover:bg-[#201c18] transition-all group shadow-xs"
                        >
                          <span className="font-bold text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] group-hover:text-[#b42323] transition-colors truncate">
                            {displayName}
                          </span>
                          <span className="text-xs text-[#b42323] font-bold group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                            {isBn ? 'বিস্তারিত →' : 'View →'}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
