'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, RotateCcw, X, SlidersHorizontal, ChevronDown, MapPin, Train } from 'lucide-react';
import { FilterOptions, LocalityZone, Pandal } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';
import { PandalService } from '@/lib/services/PandalService';

interface PandalFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  totalCount: number;
  allPandals?: Pandal[];
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
      className="inline-flex items-center gap-2.5 cursor-pointer select-none group text-left py-1 px-1 -mx-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42323]"
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out border items-center',
          checked
            ? 'bg-[#b42323] border-[#961b1b]'
            : 'bg-[#ded6ce] dark:bg-[#3d332a] border-[#c7bcaf] dark:border-[#524438]'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
          )}
        />
      </span>
      <span
        className={cn(
          'text-xs sm:text-sm font-semibold transition-colors duration-150',
          checked
            ? 'text-[#b42323] dark:text-[#ff8080] font-bold'
            : 'text-[#4a423d] dark:text-[#c4b9ae] group-hover:text-[#242424] dark:group-hover:text-white'
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function PandalFilters({ filters, onChange, totalCount, allPandals }: PandalFiltersProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const [isFeatureFiltersOpen, setIsFeatureFiltersOpen] = useState(true);

  // Live Search Autocomplete State
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const candidatePandals = useMemo(() => {
    return allPandals || PandalService.getAllPandals();
  }, [allPandals]);

  const queryTrimmed = filters.searchQuery.trim().toLowerCase();

  // Multi-field ranked suggestions matching Google Search autocomplete
  const suggestions = useMemo(() => {
    if (!queryTrimmed) return [];

    const matches: { pandal: Pandal; score: number }[] = [];

    for (const p of candidatePandals) {
      let score = 0;
      const nameEn = p.name.toLowerCase();
      const nameBn = (p.nameBn || '').toLowerCase();
      const localityEn = (p.locality || '').toLowerCase();
      const localityBn = (p.localityBn || '').toLowerCase();
      const neighborhoodEn = (p.neighborhood || '').toLowerCase();
      const neighborhoodBn = (p.neighborhoodBn || '').toLowerCase();
      const addressEn = (p.address || '').toLowerCase();
      const addressBn = (p.addressBn || '').toLowerCase();
      const committeeEn = (p.committeeName || '').toLowerCase();
      const committeeBn = (p.committeeNameBn || '').toLowerCase();
      const zoneEn = (p.zone || '').toLowerCase();
      const themeEn = (p.theme || '').toLowerCase();
      const themeBn = (p.themeBn || '').toLowerCase();

      // 1. Exact name match (highest precedence)
      if (nameEn === queryTrimmed || nameBn === queryTrimmed) {
        score += 300;
      }
      // 2. Name prefix match
      else if (nameEn.startsWith(queryTrimmed) || nameBn.startsWith(queryTrimmed)) {
        score += 200;
      }
      // 3. Word in name starts with query
      else if (
        nameEn.split(/[\s,.-]+/).some((w) => w.startsWith(queryTrimmed)) ||
        nameBn.split(/[\s,.-]+/).some((w) => w.startsWith(queryTrimmed))
      ) {
        score += 150;
      }
      // 4. Name contains substring
      else if (nameEn.includes(queryTrimmed) || nameBn.includes(queryTrimmed)) {
        score += 100;
      }

      // 5. Locality matching
      if (localityEn.startsWith(queryTrimmed) || localityBn.startsWith(queryTrimmed)) {
        score += 85;
      } else if (localityEn.includes(queryTrimmed) || localityBn.includes(queryTrimmed)) {
        score += 50;
      }

      // 6. Neighborhood matching
      if (neighborhoodEn.startsWith(queryTrimmed) || neighborhoodBn.startsWith(queryTrimmed)) {
        score += 75;
      } else if (neighborhoodEn.includes(queryTrimmed) || neighborhoodBn.includes(queryTrimmed)) {
        score += 45;
      }

      // 7. Committee name / verified alias matching
      if (committeeEn.includes(queryTrimmed) || committeeBn.includes(queryTrimmed)) {
        score += 65;
      }

      // 8. Zone matching (e.g. "new town" -> New Town pandals)
      if (zoneEn === queryTrimmed || zoneEn.startsWith(queryTrimmed)) {
        score += 70;
      }

      // 9. Address matching
      if (addressEn.includes(queryTrimmed) || addressBn.includes(queryTrimmed)) {
        score += 40;
      }

      // 10. Metro station matching
      if (
        p.metroLinks &&
        p.metroLinks.some(
          (m) =>
            m.stationName.toLowerCase().includes(queryTrimmed) ||
            Boolean(m.stationNameBn && m.stationNameBn.includes(queryTrimmed))
        )
      ) {
        score += 40;
      }

      // 11. Theme / Bonedi Bari info matching
      if (themeEn.includes(queryTrimmed) || themeBn.includes(queryTrimmed)) {
        score += 25;
      }
      if (
        p.bonediBariInfo &&
        (p.bonediBariInfo.ancestralHouseName.toLowerCase().includes(queryTrimmed) ||
          p.bonediBariInfo.familyLineage.toLowerCase().includes(queryTrimmed))
      ) {
        score += 60;
      }

      if (score > 0) {
        // Tie-breaker based on popularity score
        score += (p.popularityScore || 50) / 100;
        matches.push({ pandal: p, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    // Deduplicate by ID and limit to 7 suggestions
    const seen = new Set<string>();
    const uniqueMatches: Pandal[] = [];
    for (const m of matches) {
      if (!seen.has(m.pandal.id)) {
        seen.add(m.pandal.id);
        uniqueMatches.push(m.pandal);
        if (uniqueMatches.length >= 7) break;
      }
    }

    return uniqueMatches;
  }, [candidatePandals, queryTrimmed]);

  // Close suggestions when clicking or tapping outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const update = (partial: Partial<FilterOptions>) => {
    onChange({ ...filters, ...partial });
  };

  const handleSelectSuggestion = (pandal: Pandal) => {
    const selectedText = isBn && pandal.nameBn ? pandal.nameBn : pandal.name;
    update({ searchQuery: selectedText });
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClearSearch = () => {
    update({ searchQuery: '' });
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && filters.searchQuery.trim().length >= 1) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

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
    setIsOpen(false);
    setHighlightedIndex(-1);
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
      {/* Search Bar + Combobox Autocomplete Suggestions */}
      <div
        ref={searchContainerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="pandal-search-suggestions"
        aria-label={isBn ? 'প্যান্ডেল অনুসন্ধান' : 'Search pandals'}
        className="relative flex items-center"
      >
        <Search className="absolute left-4 w-4 h-4 text-[#8a8179] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-autocomplete="list"
          aria-controls="pandal-search-suggestions"
          aria-activedescendant={
            highlightedIndex >= 0 && suggestions[highlightedIndex]
              ? `pandal-suggestion-${suggestions[highlightedIndex].id}`
              : undefined
          }
          aria-label={isBn ? 'প্যান্ডেল অনুসন্ধান' : 'Search pandals'}
          value={filters.searchQuery}
          onFocus={() => {
            if (filters.searchQuery.trim().length >= 1) {
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            update({ searchQuery: e.target.value });
            setIsOpen(e.target.value.trim().length >= 1);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isBn
              ? 'প্যান্ডেলের নাম, বনেদি বাড়ি, এলাকা, থিম বা মেট্রো স্টেশন দিয়ে খুঁজুন...'
              : 'Search pandals by name, Bonedi Bari, theme, locality or metro...'
          }
          className="w-full rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] py-3 pl-11 pr-10 text-sm text-[#242424] dark:text-[#ede5dc] placeholder:text-[#8a8179] transition-all focus:border-[#b42323] focus:bg-white dark:focus:bg-[#1a1613] focus:outline-none"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label={isBn ? 'অনুসন্ধান মুছুন' : 'Clear search'}
            className="absolute right-3 p-1 rounded-lg text-[#8a8179] hover:text-[#b42323] hover:bg-[#f5f1ec] dark:hover:bg-[#251e18] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Live Search Suggestions Dropdown */}
        {isOpen && queryTrimmed.length >= 1 && (
          <div
            id="pandal-search-suggestions"
            role="listbox"
            aria-label={isBn ? 'প্যান্ডেল সাজেশন' : 'Pandal suggestions'}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-80 overflow-y-auto rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xl backdrop-blur-md transition-all"
          >
            {suggestions.length > 0 ? (
              <ul className="divide-y divide-[#f2ece4] dark:divide-[#26201a]">
                {suggestions.map((p, index) => {
                  const isHighlighted = index === highlightedIndex;
                  const primaryName = isBn && p.nameBn ? p.nameBn : p.name;
                  const secondaryDetail = [p.locality || p.neighborhood, p.zone]
                    .filter(Boolean)
                    .join(' • ');
                  const nearestMetro =
                    p.metroLinks && p.metroLinks[0]
                      ? isBn && p.metroLinks[0].stationNameBn
                        ? p.metroLinks[0].stationNameBn
                        : p.metroLinks[0].stationName
                      : null;

                  return (
                    <li
                      key={p.id}
                      id={`pandal-suggestion-${p.id}`}
                      role="option"
                      aria-selected={isHighlighted}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(p);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        'flex items-center justify-between gap-3 px-3.5 py-2.5 cursor-pointer text-left transition-colors select-none',
                        isHighlighted
                          ? 'bg-[#fbf2ed] dark:bg-[#2b1f1a] text-[#b42323] dark:text-[#ff9494]'
                          : 'text-[#242424] dark:text-[#ede5dc] hover:bg-[#faf6f2] dark:hover:bg-[#221c17]'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <MapPin
                          className={cn(
                            'w-4 h-4 shrink-0 transition-colors',
                            isHighlighted ? 'text-[#b42323] dark:text-[#ff9494]' : 'text-[#8a8179]'
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate">
                            {primaryName}
                          </div>
                          <div className="text-xs text-[#776d65] dark:text-[#a89e95] truncate">
                            {secondaryDetail}
                          </div>
                        </div>
                      </div>

                      {nearestMetro && (
                        <div className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-[#776d65] dark:text-[#a89e95] bg-[#f5f0eb] dark:bg-[#262019] px-2 py-0.5 rounded-md">
                          <Train className="w-3 h-3 text-[#b42323]" />
                          <span className="truncate max-w-[110px]">{nearestMetro}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : queryTrimmed.length >= 2 ? (
              <div className="px-4 py-3.5 text-center text-xs sm:text-sm text-[#776d65] dark:text-[#a89e95]">
                {isBn ? (
                  <>
                    <span className="font-bold text-[#b42323]">&ldquo;{filters.searchQuery}&rdquo;</span> দিয়ে কোনো প্যান্ডেল পাওয়া যায়নি
                  </>
                ) : (
                  <>
                    No matching pandals found for <span className="font-bold text-[#b42323]">&ldquo;{filters.searchQuery}&rdquo;</span>
                  </>
                )}
              </div>
            ) : null}
          </div>
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
        <button
          id="feature-filters-heading"
          type="button"
          onClick={() => setIsFeatureFiltersOpen((prev) => !prev)}
          aria-expanded={isFeatureFiltersOpen}
          aria-controls="feature-filters-content"
          aria-label={
            isBn
              ? isFeatureFiltersOpen
                ? 'সুবিধা ও বৈশিষ্ট্য ফিল্টার সংকুচিত করুন'
                : 'সুবিধা ও বৈশিষ্ট্য ফিল্টার প্রসারিত করুন'
              : isFeatureFiltersOpen
                ? 'Collapse feature filters'
                : 'Expand feature filters'
          }
          className={cn(
            'flex items-center justify-between w-full text-left py-1 rounded-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42323] cursor-pointer select-none transition-all',
            isFeatureFiltersOpen ? 'mb-2.5' : 'mb-1.5'
          )}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95] group-hover:text-[#242424] dark:group-hover:text-[#ede5dc] transition-colors">
            {isBn ? 'সুবিধা ও বৈশিষ্ট্য সুইচ' : 'Feature Filters'}
          </span>
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-[#f2ece4] dark:bg-[#251e18] text-[#524942] dark:text-[#c4b9ae] group-hover:text-[#b42323] dark:group-hover:text-white group-hover:bg-[#ebe3d9] dark:group-hover:bg-[#342b23] border border-[#ded5cb] dark:border-[#382f26] group-hover:border-[#b42323]/40 dark:group-hover:border-[#b42323]/60 transition-all shadow-2xs">
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200 text-current',
                !isFeatureFiltersOpen && '-rotate-90'
              )}
              aria-hidden="true"
            />
          </span>
        </button>

        <div
          id="feature-filters-content"
          role="region"
          aria-labelledby="feature-filters-heading"
          className={cn(
            'transition-all duration-200 ease-in-out overflow-hidden',
            isFeatureFiltersOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 invisible'
          )}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pb-0.5">
            <ToggleSwitch
              id="switch-bonedi-bari"
              checked={Boolean(filters.bonediBariOnly)}
              onChange={(val) =>
                update({
                  bonediBariOnly: val,
                  category: val ? 'Bonedi Bari' : (filters.category === 'Bonedi Bari' ? 'All' : filters.category),
                })
              }
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
