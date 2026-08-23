'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { FilterOptions, LocalityZone } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

interface PandalFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  totalCount: number;
}

export function PandalFilters({ filters, onChange, totalCount }: PandalFiltersProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const zoneOptions: { value: LocalityZone | 'All'; label: string }[] = [
    { value: 'All', label: isBn ? 'সব' : 'All' },
    { value: 'North Kolkata', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
    { value: 'South Kolkata', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
    { value: 'Central Kolkata', label: isBn ? 'মধ্য কলকাতা' : 'Central Kolkata' },
    { value: 'Salt Lake', label: isBn ? 'সল্টলেক' : 'Salt Lake' },
    { value: 'Dum Dum', label: isBn ? 'দমদম' : 'Dum Dum' },
    { value: 'Behala', label: isBn ? 'বেহালা' : 'Behala' },
    { value: 'Howrah', label: isBn ? 'হাওড়া' : 'Howrah' },
  ];

  const update = (partial: Partial<FilterOptions>) => {
    onChange({ ...filters, ...partial });
  };

  const handleReset = () => {
    onChange({
      searchQuery: '',
      zone: 'All',
      crowdLevel: 'All',
      category: 'All',
      metroAccessibleOnly: false,
      wheelchairAccessibleOnly: false,
      featuredOnly: false,
      heritageOnly: false,
      sortBy: 'recommended',
    });
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-pujo-border shadow-card space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pujo-text-muted" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => update({ searchQuery: e.target.value })}
          placeholder={
            isBn
              ? 'প্যান্ডেলের নাম, এলাকা, থিম বা মেট্রো স্টেশন দিয়ে খুঁজুন...'
              : 'Search pandals by name, theme, locality or metro station...'
          }
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-pujo-bg-surface border border-pujo-border text-sm sm:text-base text-pujo-text-primary placeholder:text-pujo-text-muted focus:outline-none focus:border-pujo-red transition-colors"
        />
      </div>

      {/* Zone Pills */}
      <div>
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-pujo-text-muted mb-2.5">
          {isBn ? 'এলাকা অনুযায়ী ফিল্টার' : 'Filter by Zone'}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {zoneOptions.map((z) => (
            <button
              key={z.value}
              onClick={() => update({ zone: z.value })}
              className={cn(
                'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border shadow-sm',
                filters.zone === z.value
                  ? 'bg-pujo-red text-white border-pujo-red'
                  : 'bg-white border-pujo-border text-pujo-text-secondary hover:text-pujo-text-primary hover:border-pujo-red/40'
              )}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-pujo-border text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <label className="inline-flex items-center gap-2 cursor-pointer text-pujo-text-secondary font-semibold">
            <input
              type="checkbox"
              checked={filters.metroAccessibleOnly}
              onChange={(e) => update({ metroAccessibleOnly: e.target.checked })}
              className="w-4 h-4 rounded accent-pujo-red"
            />
            <span>{isBn ? 'মেট্রোর কাছে' : 'Near Metro Station'}</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer text-pujo-text-secondary font-semibold">
            <input
              type="checkbox"
              checked={filters.heritageOnly}
              onChange={(e) => update({ heritageOnly: e.target.checked })}
              className="w-4 h-4 rounded accent-pujo-red"
            />
            <span>{isBn ? 'ঐতিহ্যবাহী পুজো' : 'Heritage Sabeki'}</span>
          </label>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-pujo-text-muted font-bold">
            {isBn ? (
              <>মোট <strong className="text-pujo-red text-base">{toBengaliDigits(totalCount)}</strong> টি প্যান্ডেল</>
            ) : (
              <>Found <strong className="text-pujo-red text-base">{totalCount}</strong> pandals</>
            )}
          </span>
          <button
            onClick={handleReset}
            className="text-xs sm:text-sm text-pujo-red hover:underline flex items-center gap-1 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isBn ? 'রিসেট' : 'Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
