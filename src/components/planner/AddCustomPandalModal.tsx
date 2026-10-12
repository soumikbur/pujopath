'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  MapPin,
  Plus,
  Check,
  Compass,
  AlertCircle,
  Building,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { GeocodingService, GeocodedLocation, determineKolkataZone } from '@/lib/services/GeocodingService';
import { LocalityZone, Pandal } from '@/types';
import { cn } from '@/lib/utils/cn';

interface AddCustomPandalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPandalAdded?: (pandal: Pandal) => void;
}

export function AddCustomPandalModal({
  isOpen,
  onClose,
  onPandalAdded,
}: AddCustomPandalModalProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { addCustomPandal } = useFavorites();

  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');

  // Option A: Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [selectedResult, setSelectedResult] = useState<GeocodedLocation | null>(null);
  const [searchPandalName, setSearchPandalName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Option B: Manual States
  const [manualName, setManualName] = useState('');
  const [manualNameBn, setManualNameBn] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualLocality, setManualLocality] = useState('');
  const [manualZone, setManualZone] = useState<LocalityZone>('Central Kolkata');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [resolveMessage, setResolveMessage] = useState<{ type: 'success' | 'warn' | 'error'; text: string } | null>(null);

  // Success state
  const [successPandal, setSuccessPandal] = useState<Pandal | null>(null);

  // Keyboard Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      setSuccessPandal(null);
      setSelectedResult(null);
      setResolveMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Search Execution
  const handlePerformSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setSelectedResult(null);
    try {
      const results = await GeocodingService.searchLocations(searchQuery);
      setSearchResults(results);
      if (results.length > 0 && !searchPandalName) {
        setSearchPandalName(searchQuery.trim());
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Option A: Select Result (User must confirm, not auto-added)
  const handleSelectSearchResult = (res: GeocodedLocation) => {
    setSelectedResult(res);
    if (!searchPandalName) {
      setSearchPandalName(res.name);
    }
  };

  // Option A: Confirm and Add Pandal
  const handleConfirmAddSearchedPandal = () => {
    if (!selectedResult) return;
    const finalName = searchPandalName.trim() || selectedResult.name;

    const added = addCustomPandal(
      {
        name: finalName,
        nameBn: selectedResult.nameBn || finalName,
        address: selectedResult.address,
        addressBn: selectedResult.addressBn || selectedResult.address,
        locality: selectedResult.locality,
        localityBn: selectedResult.localityBn || selectedResult.locality,
        zone: selectedResult.zone,
        latitude: selectedResult.latitude,
        longitude: selectedResult.longitude,
        hasUnresolvedCoordinates: false,
      },
      true
    );

    setSuccessPandal(added);
    if (onPandalAdded) onPandalAdded(added);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  // Option B: Resolve Coordinates for Manual Address
  const handleResolveManualAddress = async () => {
    if (!manualAddress.trim()) {
      setResolveMessage({
        type: 'warn',
        text: isBn ? 'অনুগ্রহ করে ঠিকানা প্রদান করুন।' : 'Please enter an address to resolve.',
      });
      return;
    }

    setIsResolvingAddress(true);
    setResolveMessage(null);
    try {
      const query = manualLocality ? `${manualAddress}, ${manualLocality}` : manualAddress;
      const res = await GeocodingService.resolveAddress(query);

      if (res) {
        setManualLat(res.latitude.toFixed(5));
        setManualLng(res.longitude.toFixed(5));
        setManualZone(res.zone);
        if (!manualLocality) setManualLocality(res.locality);
        setResolveMessage({
          type: 'success',
          text: isBn
            ? `স্থানাঙ্ক সঠিকভাবে পাওয়া গেছে: ${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)} (${res.zone})`
            : `Coordinates resolved: ${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)} (${res.zone})`,
        });
      } else {
        setResolveMessage({
          type: 'warn',
          text: isBn
            ? 'ঠিকানাটির নির্দিষ্ট স্থানাঙ্ক স্বয়ংক্রিয়ভাবে পাওয়া যায়নি। আপনি ম্যানুয়ালি স্থানাঙ্ক দিতে পারেন বা সরাসরি যোগ করতে পারেন।'
            : 'Could not pinpoint exact coordinates for this address. You may enter coordinates manually or proceed. (Unresolved stops are visited at the end during optimization.)',
        });
      }
    } catch {
      setResolveMessage({
        type: 'error',
        text: isBn
          ? 'স্থানাঙ্ক খোঁজার সময় সমস্যা হয়েছে। আপনি ম্যানুয়াল মান দিতে পারেন।'
          : 'Failed to resolve location. You may specify manual coordinates or add without coordinates.',
      });
    } finally {
      setIsResolvingAddress(false);
    }
  };

  // Option B: Submit Manual Pandal
  const handleSubmitManualPandal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualAddress.trim()) {
      setResolveMessage({
        type: 'warn',
        text: isBn ? 'মণ্ডপের নাম এবং ঠিকানা আবশ্যক।' : 'Pandal name and address are required.',
      });
      return;
    }

    const latNum = parseFloat(manualLat);
    const lngNum = parseFloat(manualLng);
    const hasValidCoords = !isNaN(latNum) && !isNaN(lngNum) && latNum > 20 && latNum < 25 && lngNum > 85 && lngNum < 92;

    const zone = hasValidCoords ? determineKolkataZone(latNum, lngNum) : manualZone;

    const added = addCustomPandal(
      {
        name: manualName.trim(),
        nameBn: manualNameBn.trim() || manualName.trim(),
        address: manualAddress.trim(),
        locality: manualLocality.trim() || manualAddress.split(',')[0].trim(),
        zone,
        latitude: hasValidCoords ? latNum : 0,
        longitude: hasValidCoords ? lngNum : 0,
        hasUnresolvedCoordinates: !hasValidCoords,
      },
      true
    );

    setSuccessPandal(added);
    if (onPandalAdded) onPandalAdded(added);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-pandal-title"
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#eee8e1] dark:border-[#2f2720] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#b42323]/10 text-[#b42323] flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="custom-pandal-title" className="text-base sm:text-lg font-black text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'নতুন মণ্ডপ যোগ করুন' : 'Add Custom Pandal'}
              </h3>
              <p className="text-xs text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'ডাটাবেসে নেই এমন যেকোনো মণ্ডপ আপনার পরিক্রমায় যুক্ত করুন' : 'Add any pandal missing from directory directly to your route'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-[#776d65] hover:text-[#242424] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Toast Banner */}
        {successPandal && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p>{isBn ? `"${successPandal.name}" সফলভাবে যুক্ত হয়েছে!` : `"${successPandal.name}" successfully added to your trail!`}</p>
              <p className="text-[11px] font-normal opacity-90 mt-0.5">
                {isBn ? 'আপনার পরিক্রমা তালিকা হালনাগাদ করা হয়েছে।' : 'Itinerary automatically updated.'}
              </p>
            </div>
          </div>
        )}

        {/* Tabs: Option A (Search) vs Option B (Manual) */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#f5efe8] dark:bg-[#251e18] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={cn(
              'py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5',
              activeTab === 'search'
                ? 'bg-white dark:bg-[#1a1613] text-[#b42323] shadow-xs'
                : 'text-[#776d65] dark:text-[#a89e95] hover:text-[#242424]'
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isBn ? 'স্থান খুঁজুন (Option A)' : 'Search Place (Option A)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={cn(
              'py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5',
              activeTab === 'manual'
                ? 'bg-white dark:bg-[#1a1613] text-[#b42323] shadow-xs'
                : 'text-[#776d65] dark:text-[#a89e95] hover:text-[#242424]'
            )}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{isBn ? 'ম্যানুয়াল এন্ট্রি (Option B)' : 'Manual Entry (Option B)'}</span>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            OPTION A: SEARCH FOR A PLACE
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'search' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'মণ্ডপের নাম, ল্যান্ডমার্ক বা এলাকা খুঁজুন:' : 'Search by pandal name, landmark, address, or locality:'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#776d65] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePerformSearch();
                      }
                    }}
                    placeholder={isBn ? 'যেমন: দেশপ্রিয় পার্ক, শ্যামবাজার, কলেজ স্কয়ার...' : 'e.g., Deshapriya Park, Shyambazar, College Street...'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs sm:text-sm font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePerformSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white text-xs font-bold shrink-0 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSearching ? (isBn ? 'খোঁজা হচ্ছে...' : 'Searching...') : (isBn ? 'সন্ধান' : 'Search')}
                </button>
              </div>
            </div>

            {/* Matching Results List */}
            {hasSearched && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                  {isBn ? `পাওয়া গেছে (${searchResults.length}টি ফলাফল):` : `Matching Results (${searchResults.length}):`}
                </span>

                {searchResults.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-[#eee8e1] dark:border-[#2f2720] text-center text-xs text-[#776d65] dark:text-[#a89e95]">
                    {isBn
                      ? 'কোনো ফলাফল পাওয়া যায়নি। আপনি Option B ব্যবহার করে সরাসরি ঠিকানা ও নাম লিখতে পারেন।'
                      : 'No matches found. You can switch to Option B to manually enter the name and address.'}
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {searchResults.map((res) => {
                      const isSelected = selectedResult?.id === res.id;
                      return (
                        <button
                          key={res.id}
                          type="button"
                          onClick={() => handleSelectSearchResult(res)}
                          className={cn(
                            'w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5',
                            isSelected
                              ? 'border-[#b42323] bg-[#b42323]/5 dark:bg-[#b42323]/15'
                              : 'border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] hover:border-[#b42323]/40'
                          )}
                        >
                          <MapPin className={cn('w-4 h-4 shrink-0 mt-0.5', isSelected ? 'text-[#b42323]' : 'text-[#776d65]')} />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#242424] dark:text-[#ede5dc] flex items-center justify-between">
                              <span className="truncate">{res.name}</span>
                              <span className="text-[10px] font-bold text-[#b42323] px-1.5 py-0.2 rounded-full bg-[#b42323]/10 shrink-0 ml-1">
                                {res.zone}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#776d65] dark:text-[#a89e95] truncate mt-0.5">
                              {res.address}
                            </p>
                            <p className="text-[10px] text-[#8d837a] mt-0.5">
                              {res.latitude.toFixed(4)}° N, {res.longitude.toFixed(4)}° E
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#b42323] shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Verification & Confirmation Box (Required Confirmation) */}
            {selectedResult && (
              <div className="p-4 rounded-xl border-2 border-[#b42323]/30 bg-[#fdfbf9] dark:bg-[#1f1915] space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#b42323]">
                  <Sparkles className="w-4 h-4" />
                  <span>{isBn ? 'নিশ্চিতকরণ: নির্বাচিত অবস্থান' : 'Verification: Selected Location'}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-[#776d65] dark:text-[#a89e95] block">
                      {isBn ? 'মণ্ডপের প্রদর্শিত নাম (প্রয়োজনে পরিবর্তন করুন):' : 'Pandal Display Name (edit if needed):'}
                    </label>
                    <input
                      type="text"
                      value={searchPandalName}
                      onChange={(e) => setSearchPandalName(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs font-bold text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
                    />
                  </div>
                  <div className="pt-1 text-[11px] text-[#776d65] dark:text-[#a89e95]">
                    <span className="font-semibold">{isBn ? 'ঠিকানা: ' : 'Address: '}</span>
                    {selectedResult.address}
                  </div>
                  <div className="text-[11px] text-[#776d65] dark:text-[#a89e95]">
                    <span className="font-semibold">{isBn ? 'স্থানাঙ্ক: ' : 'Coordinates: '}</span>
                    {selectedResult.latitude.toFixed(4)}° N, {selectedResult.longitude.toFixed(4)}° E ({selectedResult.zone})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAddSearchedPandal}
                  className="w-full py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নিশ্চিত করুন ও পরিক্রমায় যোগ করুন' : 'Confirm & Add to Trail'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            OPTION B: ENTER A LOCATION MANUALLY
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'manual' && (
          <form onSubmit={handleSubmitManualPandal} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'মণ্ডপের নাম *' : 'Pandal Name *'}
              </label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder={isBn ? 'যেমন: নেতাজী নগর সার্বজনীন দুর্গোৎসব' : 'e.g., Netaji Nagar Sarbojanin Durgotsav'}
                className="w-full p-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs sm:text-sm font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                  {isBn ? 'এলাকা / পাড়া' : 'Locality / Neighborhood'}
                </label>
                <input
                  type="text"
                  value={manualLocality}
                  onChange={(e) => setManualLocality(e.target.value)}
                  placeholder={isBn ? 'যেমন: টালিগঞ্জ, ভবানীপুর' : 'e.g., Tollygunge, Bhowanipore'}
                  className="w-full p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                  {isBn ? 'কলকাতা অঞ্চল' : 'Kolkata Zone'}
                </label>
                <select
                  value={manualZone}
                  onChange={(e) => setManualZone(e.target.value as LocalityZone)}
                  className="w-full p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-semibold text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
                >
                  <option value="North Kolkata">North Kolkata</option>
                  <option value="South Kolkata">South Kolkata</option>
                  <option value="Central Kolkata">Central Kolkata</option>
                  <option value="Salt Lake">Salt Lake</option>
                  <option value="New Town">New Town</option>
                  <option value="Behala">Behala</option>
                  <option value="Dum Dum">Dum Dum</option>
                  <option value="Howrah">Howrah</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'ঠিকানা বা ল্যান্ডমার্ক *' : 'Address or Landmark *'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder={isBn ? 'যেমন: রাসবিহারী অ্যাভিনিউ, প্রিয় সিনেমার কাছে' : 'e.g., 42 Rashbehari Ave, near Priya Cinema'}
                  className="flex-1 p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
                />
                <button
                  type="button"
                  onClick={handleResolveManualAddress}
                  disabled={isResolvingAddress || !manualAddress.trim()}
                  className="px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] hover:border-[#b42323] text-[#b42323] text-xs font-bold shrink-0 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  title="Resolve latitude and longitude automatically"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isResolvingAddress ? (isBn ? 'খোঁজা হচ্ছে...' : 'Resolving...') : (isBn ? 'স্থানাঙ্ক খুঁজুন' : 'Find Coords')}</span>
                </button>
              </div>
            </div>

            {/* Coordinates Fields (Optional manual entry or resolved) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#776d65] dark:text-[#a89e95] mb-0.5">
                  Latitude (অক্ষাংশ)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="e.g., 22.5186"
                  className="w-full p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-mono text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#776d65] dark:text-[#a89e95] mb-0.5">
                  Longitude (দ্রাঘিমাংশ)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="e.g., 88.3654"
                  className="w-full p-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-mono text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-1 focus:ring-[#b42323]"
                />
              </div>
            </div>

            {/* Resolution Message or Help Alert */}
            {resolveMessage && (
              <div
                className={cn(
                  'p-3 rounded-xl text-xs font-medium flex items-start gap-2',
                  resolveMessage.type === 'success' && 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200',
                  resolveMessage.type === 'warn' && 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200',
                  resolveMessage.type === 'error' && 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200'
                )}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resolveMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs pt-3"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'মণ্ডপটি পরিক্রমা তালিকায় যোগ করুন' : 'Add Custom Pandal to Trail'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
