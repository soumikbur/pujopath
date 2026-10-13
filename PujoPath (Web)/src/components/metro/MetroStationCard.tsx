'use client';

import React from 'react';
import Link from 'next/link';
import { Train, MapPin, ArrowRight } from 'lucide-react';
import { MetroStation } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { MetroService } from '@/lib/services/MetroService';
import { PandalCard } from '@/components/pandals/PandalCard';
import { toBengaliDigits } from '@/lib/geo';

interface MetroStationCardProps {
  station: MetroStation;
}

export function MetroStationCard({ station }: MetroStationCardProps) {
  const { locale, t } = useI18n();
  const nearbyPandals = MetroService.getPandalsForStation(station);

  const displayName = locale === 'bn' ? station.nameBn : station.name;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 font-extrabold text-sm border border-sky-200 dark:border-sky-800">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {displayName} Metro
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                {station.line}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{station.address}</span>
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-sindoor-600 dark:text-sindoor-400">
          {locale === 'bn'
            ? `${toBengaliDigits(nearbyPandals.length)} টি সংলগ্ন মণ্ডপ`
            : `${nearbyPandals.length} Mapped Pandals`}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {t('metroNearbyPandals')}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nearbyPandals.slice(0, 3).map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}
