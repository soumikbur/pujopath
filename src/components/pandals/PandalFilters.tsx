'use client';

import React from 'react';
import { Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { FilterOptions, LocalityZone } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

interface PandalFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  totalCount: number;
}

/**
 * Accessible, animated toggle switch component
 */
function ToggleSwitch({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 cursor-pointer select-none group text-left"
    >
      <span
        className={cn(
          'relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out',
          checked ? 'bg-[#b42323]' : 'bg-[#ded6ce] dark:bg-[#3f3833]'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out mt-0.5',
            checked ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'
          )}
        />
      </span>
      <span className="text-xs sm:text-sm font-semibold text-[#4a423d] dark:text-[#c4b9ae] group-hover:text-[#242424] dark:group-hover:text-white transition-colors">
        {label}
      </span>
    </button>
  );
}

export function PandalFilters({ filters, onChange, totalCount }: PandalFiltersProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const zoneOptions: { value: LocalityZone | 'All'; label: string }[] = [
    { value: 'All', label: isBn ? 'সব এলাকা' : 'All Zones' },
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
      bonediBariOnly: false,
      sortBy: 'recommended',
    });
  };

  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.zone !== 'All' ||
    filters.metroAccessibleOnly ||
    filters.heritageOnly ||
    filters.bonediBariOnly ||
    filters.wheelchairAccessibleOnly ||
    filters.featuredOnly ||
    filters.sortBy !== 'recommended';

  return (
    <div className="space-y-4 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] p-4 sm:p-5 shadow-xs transition-colors">
      {/* Search Bar + Clear button */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-[#8a8179] pointer-events-none" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => update({ searchQuery: e.target.value })}
          placeholder={
            isBn
              ? 'প্যান্ডেলের নাম, বনেদি বাড়ি, এলাকা, থিম বা মেট্রো স্টেশন দিয়ে খুঁজুন...'
              : 'Search pandals by name, Bonedi Bari, theme, locality or metro...'
          }
          className="w-full rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] py-3 pl-11 pr-10 text-sm text-[#242424] dark:text-[#ede5dc] placeholder:text-[#8a8179] transition-all focus:border-[#b42323] focus:bg-white dark:focus:bg-[#1a1613] focus:outline-none"
        />
        {filters.searchQuery && (
          <button
            onClick={() => update({ searchQuery: '' })}
            aria-label="Clear search"
            className="absolute right-3 p-1 rounded-lg text-[#8a8179] hover:text-[#b42323] hover:bg-[#f5f1ec] dark:hover:bg-[#251e18] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Zone Filter Horizontal Scroll */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95] mb-2">
          {isBn ? 'এলাকা অনুযায়ী ফিল্টার' : 'Filter by Zone'}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {zoneOptions.map((z) => (
            <button
              key={z.value}
              onClick={() => update({ zone: z.value })}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-150',
                filters.zone === z.value
                  ? 'bg-[#b42323] text-white border-[#b42323] shadow-xs'
                  : 'bg-white dark:bg-[#1a1613] border-[#eee8e1] dark:border-[#2f2720] text-[#625b55] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white hover:border-[#b42323]/50'
              )}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Feature Switches Grid */}
      <div className="pt-2 border-t border-[#eee8e1] dark:border-[#2f2720]">
        <div className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95] mb-2.5">
          {isBn ? 'সুবিধা ও বৈশিষ্ট্য সুইচ' : 'Feature Filters'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <ToggleSwitch
            id="switch-bonedi-bari"
            checked={Boolean(filters.bonediBariOnly)}
            onChange={(val) => update({ bonediBariOnly: val })}
            label={isBn ? 'বনেদি বাড়ির পুজো' : 'Bonedi Bari'}
          />

          <ToggleSwitch
            id="switch-metro"
            checked={filters.metroAccessibleOnly}
            onChange={(val) => update({ metroAccessibleOnly: val })}
            label={isBn ? 'মেট্রোর কাছে' : 'Near Metro'}
          />

          <ToggleSwitch
            id="switch-heritage"
            checked={filters.heritageOnly}
            onChange={(val) => update({ heritageOnly: val })}
            label={isBn ? 'ঐতিহ্যবাহী সাবেকি' : 'Heritage Sabeki'}
          />

          <ToggleSwitch
            id="switch-wheelchair"
            checked={filters.wheelchairAccessibleOnly}
            onChange={(val) => update({ wheelchairAccessibleOnly: val })}
            label={isBn ? 'হুইলচেয়ার সুবিধা' : 'Wheelchair Access'}
          />

          <ToggleSwitch
            id="switch-featured"
            checked={filters.featuredOnly}
            onChange={(val) => update({ featuredOnly: val })}
            label={isBn ? 'বিশেষ সেরা মণ্ডপ' : 'Featured Only'}
          />
        </div>
      </div>


      {/* Footer Summary + Sort By + Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#eee8e1] dark:border-[#2f2720] text-xs sm:text-sm">
        {/* Results Counter */}
        <div className="flex items-center gap-2">
          <span className="text-[#776d65] dark:text-[#a89e95] font-semibold">
            {isBn ? (
              <>মোট <strong className="text-[#b42323] text-sm font-black">{toBengaliDigits(totalCount)}</strong> টি প্যান্ডেল পাওয়া গেছে</>
            ) : (
              <>Showing <strong className="text-[#b42323] text-sm font-black">{totalCount}</strong> pandals</>
            )}
          </span>
        </div>

        {/* Sort By Dropdown + Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#776d65] dark:text-[#a89e95] font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as FilterOptions['sortBy'] })}
              aria-label="Sort pandals"
              className="rounded-lg border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] px-2 py-1 text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] focus:border-[#b42323] focus:outline-none"
            >
              <option value="recommended">{isBn ? 'সুপারিশকৃত' : 'Recommended'}</option>
              <option value="popularity">{isBn ? 'জনপ্রিয়তা' : 'Most Popular'}</option>
              <option value="name">{isBn ? 'নাম অনুযায়ী' : 'Alphabetical'}</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#b42323] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'রিসেট' : 'Reset All'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
