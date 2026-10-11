'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Train } from 'lucide-react';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { PANDALS_DATA } from '@/data/pandals';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

export default function MetroPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [selectedLine, setSelectedLine] = useState<'All' | 'Blue Line (North-South)' | 'Green Line (East-West)'>('All');

  const filteredStations =
    selectedLine === 'All'
      ? METRO_STATIONS_DATA
      : METRO_STATIONS_DATA.filter((s) => s.line === selectedLine);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Train className="w-4 h-4" />
          <span>{isBn ? 'মেট্রো পরিক্রমা' : 'Transit Access'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'কলকাতা মেট্রো পুজো পরিক্রমা গাইড' : 'Kolkata Metro Puja Hopping Guide'}
        </h1>
        <p className="text-sm sm:text-base text-[#776d65] dark:text-[#a89e95] mt-1">
          {isBn
            ? 'যানজটমুক্ত ও সহজে উত্তর, মধ্য ও দক্ষিণ কলকাতার শ্রেষ্ঠ মণ্ডপে পৌঁছানোর জন্য ব্লু ও গ্রীন লাইন মেট্রো রুট ম্যাপ।'
            : 'Reach iconic pandals within minutes using the Blue and Green line Kolkata Metro network.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'All', label: isBn ? 'সকল লাইন' : 'All Lines' },
          { id: 'Blue Line (North-South)', label: isBn ? 'ব্লু লাইন (উত্তর-দক্ষিণ)' : 'Blue Line (North-South)' },
          { id: 'Green Line (East-West)', label: isBn ? 'গ্রীন লাইন (পূর্ব-পশ্চিম)' : 'Green Line (East-West)' },
        ].map((line) => (
          <button
            key={line.id}
            onClick={() => setSelectedLine(line.id as typeof selectedLine)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-150 whitespace-nowrap active:scale-95 shadow-xs',
              selectedLine === line.id
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
                <span className="text-xs text-[#776d65] dark:text-[#a89e95]">{station.address}</span>
              </div>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold shadow-xs',
                  station.line.includes('Blue')
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                )}
              >
                {station.line.includes('Blue') ? (isBn ? 'ব্লু লাইন' : 'Blue Line') : (isBn ? 'গ্রীন লাইন' : 'Green Line')}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b42323]">
                {isBn ? 'হাঁটা দূরত্বের পুজোসমূহ' : 'Walkable Iconic Pandals'}
              </span>
              <div className="space-y-1.5">
                {station.nearbyPandalIds.map((pandalId) => {
                  const pandal = PANDALS_DATA.find((p) => p.id === pandalId || p.slug === pandalId);
                  const displayName = pandal
                    ? (isBn ? pandal.nameBn : pandal.name)
                    : pandalId.replace(/-/g, ' ');
                  const targetSlug = pandal?.slug || pandalId;

                  return (
                    <Link
                      key={pandalId}
                      href={`/pandals/${targetSlug}`}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] hover:border-[#b42323]/50 hover:bg-[#f9e9e7] dark:hover:bg-[#341b18] text-[#4a423d] dark:text-[#c4b9ae] hover:text-[#b42323] transition-all group active:scale-95"
                    >
                      <span className="font-bold text-sm group-hover:text-[#b42323] transition-colors truncate pr-2">
                        {displayName}
                      </span>
                      <span className="font-sans text-[#b42323] font-bold text-xs shrink-0">
                        {isBn ? 'বিস্তারিত →' : 'Details →'}
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
  );
}
