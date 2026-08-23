'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Train } from 'lucide-react';
import { METRO_STATIONS_DATA } from '@/data/metro';
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
        <div className="flex items-center gap-2 text-pujo-red text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Train className="w-4 h-4" />
          <span>{isBn ? 'মেট্রো পরিক্রমা' : 'Transit Access'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-pujo-text-primary mt-1 tracking-tight">
          {isBn ? 'কলকাতা মেট্রো পুজো পরিক্রমা গাইড' : 'Kolkata Metro Puja Hopping Guide'}
        </h1>
        <p className="text-sm sm:text-base text-pujo-text-muted mt-1">
          {isBn
            ? 'যানজটমুক্ত ও সহজে উত্তর, মধ্য ও দক্ষিণ কলকাতার শ্রেষ্ঠ মণ্ডপে পৌঁছানোর জন্য ব্লু ও গ্রীন লাইন মেট্রো রুট ম্যাপ।'
            : 'Reach iconic pandals within minutes using the Blue and Green line Kolkata Metro network.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2.5">
        {[
          { id: 'All', label: isBn ? 'সকল লাইন' : 'All' },
          { id: 'Blue Line (North-South)', label: isBn ? 'ব্লু লাইন (উত্তর-দক্ষিণ)' : 'Blue Line (North-South)' },
          { id: 'Green Line (East-West)', label: isBn ? 'গ্রীন লাইন (পূর্ব-পশ্চিম)' : 'Green Line (East-West)' },
        ].map((line) => (
          <button
            key={line.id}
            onClick={() => setSelectedLine(line.id as typeof selectedLine)}
            className={cn(
              'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-colors shadow-sm',
              selectedLine === line.id
                ? 'bg-pujo-red text-white border-pujo-red'
                : 'bg-white border-pujo-border text-pujo-text-secondary hover:text-pujo-text-primary'
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
            className="p-5 sm:p-6 rounded-3xl bg-white border border-pujo-border shadow-card space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-pujo-border pb-3">
              <div>
                <h3 className="text-lg font-black text-pujo-text-primary">
                  {isBn ? station.nameBn : station.name}
                </h3>
                <span className="text-xs text-pujo-text-muted">{station.address}</span>
              </div>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold shadow-sm',
                  station.line.includes('Blue')
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                )}
              >
                {station.line.includes('Blue') ? (isBn ? 'ব্লু লাইন' : 'Blue Line') : (isBn ? 'গ্রীন লাইন' : 'Green Line')}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-pujo-red">
                {isBn ? 'হাঁটা দূরত্বের পুজোসমূহ' : 'Walkable Pandals'}
              </span>
              <div className="space-y-1.5">
                {station.nearbyPandalIds.map((pandalId) => (
                  <Link
                    key={pandalId}
                    href={`/pandals/${pandalId}`}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-pujo-bg-surface hover:bg-pujo-red-soft border border-pujo-border text-pujo-text-secondary hover:text-pujo-red transition-colors"
                  >
                    <span className="font-bold capitalize text-sm">
                      {pandalId.replace(/-/g, ' ')}
                    </span>
                    <span className="font-sans text-pujo-red font-black text-xs">
                      {isBn ? 'হাঁটা দূরত্ব' : 'Walkable'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
