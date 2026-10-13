'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Plus,
  Check,
  AlertCircle,
  Building,
  ShieldAlert,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { GeocodingService, determineKolkataZone } from '@/lib/services/GeocodingService';
import { LocalityZone, Pandal } from '@/types';

interface AddCustomPandalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPandalAdded?: (pandal: Pandal) => void;
}

const KOLKATA_ZONES: LocalityZone[] = [
  'Central Kolkata',
  'North Kolkata',
  'South Kolkata',
  'Salt Lake',
  'New Town',
  'Behala',
  'Dum Dum',
  'Howrah',
];

export function AddCustomPandalModal({
  isOpen,
  onClose,
  onPandalAdded,
}: AddCustomPandalModalProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { addCustomPandal } = useFavorites();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [zone, setZone] = useState<LocalityZone>('Central Kolkata');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'warn' | 'error'; text: string } | null>(null);
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setNameBn('');
      setAddress('');
      setLocality('');
      setZone('Central Kolkata');
      setLat('');
      setLng('');
      setStatusMessage(null);
      setSuccessPandal(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Coordinate resolution helper
  const handleResolveCoordinates = async () => {
    if (!address.trim()) {
      setStatusMessage({
        type: 'warn',
        text: isBn ? 'স্থানাঙ্ক খুঁজতে অনুগ্রহ করে একটি ঠিকানা বা ল্যান্ডমার্ক লিখুন।' : 'Please enter an address or landmark to resolve coordinates.',
      });
      return;
    }

    setIsResolvingAddress(true);
    setStatusMessage(null);
    try {
      const query = locality ? `${address}, ${locality}, Kolkata` : `${address}, Kolkata`;
      const res = await GeocodingService.resolveAddress(query);

      if (res) {
        setLat(res.latitude.toFixed(5));
        setLng(res.longitude.toFixed(5));
        setZone(res.zone);
        if (!locality) setLocality(res.locality);
        setStatusMessage({
          type: 'success',
          text: isBn
            ? `স্থানাঙ্ক পাওয়া গেছে: ${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)} (${res.zone})`
            : `Coordinates resolved: ${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)} (${res.zone})`,
        });
      } else {
        setStatusMessage({
          type: 'warn',
          text: isBn
            ? 'নির্দিষ্ট স্থানাঙ্ক স্বয়ংক্রিয়ভাবে পাওয়া যায়নি। আপনি ম্যানুয়াল স্থানাঙ্ক লিখতে পারেন।'
            : 'Could not resolve exact coordinates automatically. You may specify them manually or proceed.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: isBn ? 'স্থানাঙ্ক খোঁজার সময় সমস্যা হয়েছে।' : 'Error resolving coordinates.',
      });
    } finally {
      setIsResolvingAddress(false);
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();

    // Validation
    if (!trimmedName || trimmedName.length < 3) {
      setStatusMessage({
        type: 'error',
        text: isBn ? 'মণ্ডপের নাম কমপক্ষে ৩ অক্ষরের হতে হবে।' : 'Pandal name must be at least 3 characters.',
      });
      return;
    }

    if (!trimmedAddress) {
      setStatusMessage({
        type: 'error',
        text: isBn ? 'ঠিকানা বা ল্যান্ডমার্ক প্রদান করা আবশ্যক।' : 'Address or landmark is required.',
      });
      return;
    }

    let latNum = parseFloat(lat);
    let lngNum = parseFloat(lng);
    let hasCoords = false;

    if (lat && lng) {
      if (isNaN(latNum) || isNaN(lngNum) || latNum < 22.0 || latNum > 23.2 || lngNum < 88.0 || lngNum > 89.2) {
        setStatusMessage({
          type: 'error',
          text: isBn
            ? 'অবাস্তব স্থানাঙ্ক! কলকাতা ও আশেপাশের জন্য অক্ষাংশ (22.0–23.2) ও দ্রাঘিমাংশ (88.0–89.2) আবশ্যক।'
            : 'Coordinates out of bounds! Kolkata area requires latitude (22.0–23.2) and longitude (88.0–89.2).',
        });
        return;
      }
      hasCoords = true;
    }

    const calculatedZone = hasCoords ? determineKolkataZone(latNum, lngNum) : zone;

    try {
      const added = addCustomPandal(
        {
          name: trimmedName,
          nameBn: nameBn.trim() || trimmedName,
          address: trimmedAddress,
          locality: locality.trim() || trimmedAddress.split(',')[0].trim(),
          zone: calculatedZone,
          latitude: hasCoords ? latNum : 0,
          longitude: hasCoords ? lngNum : 0,
          hasUnresolvedCoordinates: !hasCoords,
        },
        true
      );

      setSuccessPandal(added);
      if (onPandalAdded) onPandalAdded(added);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setStatusMessage({
        type: 'error',
        text: isBn
          ? 'স্থানীয় ডিভাইসে তথ্য সংরক্ষণ ব্যর্থ হয়েছে। ব্রাউজারের স্টোরেজ পরীক্ষা করুন।'
          : 'Failed to save to device local storage. Please check browser storage settings.',
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-new-pandal-title"
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#eee8e1] dark:border-[#2f2720] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#b42323]/10 text-[#b42323] flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="add-new-pandal-title" className="text-base sm:text-lg font-black text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'নতুন মণ্ডপ যোগ করুন' : 'Add New Pandal'}
              </h3>
              <p className="text-xs text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'আপনার ব্যক্তিগত পরিক্রমায় নতুন স্টপ যুক্ত করুন' : 'Create a personal stop for your private route planner'}
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

        {/* Privacy & Safety Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-950 dark:text-amber-100">
              {isBn ? 'ব্যক্তিগত স্টপ — পুজোপথ কর্তৃক যাচাইকৃত নয়' : 'Personal stop — not verified by PujoPath'}
            </span>
            <span>
              {isBn
                ? 'এই স্টপটি শুধুমাত্র আপনার এই ডিভাইসের নিজস্ব পরিক্রমায় সংরক্ষিত হবে। এটি মূল পাবলিক ক্যাটালগে যুক্ত বা প্রকাশিত হবে না।'
                : 'This stop is saved only to your device for personal route planning. It will not be added to the public catalogue or shared with other visitors.'}
            </span>
          </div>
        </div>

        {/* Success Toast */}
        {successPandal && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p>{isBn ? `"${successPandal.name}" ব্যক্তিগত স্টপ হিসেবে যুক্ত হয়েছে!` : `"${successPandal.name}" added as a personal stop!`}</p>
              <p className="text-[11px] font-normal opacity-90 mt-0.5">
                {isBn ? 'আপনার ব্যক্তিগত পরিক্রমা তালিকা হালনাগাদ করা হয়েছে।' : 'Personal itinerary automatically updated.'}
              </p>
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && !successPandal && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : statusMessage.type === 'warn'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'মণ্ডপের নাম (ইংরেজি) *' : 'Pandal Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isBn ? 'যেমন: Netaji Sangha' : 'e.g., Netaji Sangha'}
                className="w-full px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs sm:text-sm font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'বাংলা নাম (ঐচ্ছিক)' : 'Name in Bengali (Optional)'}
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder={isBn ? 'যেমন: নেতাজী সংঘ' : 'e.g., নেতাজী সংঘ'}
                className="w-full px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs sm:text-sm font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              />
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isBn ? 'যেমন: 12 Lake Road, Near Lake Market' : 'e.g., 12 Lake Road, Near Lake Market'}
                className="flex-1 px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs sm:text-sm font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              />
              <button
                type="button"
                onClick={handleResolveCoordinates}
                disabled={isResolvingAddress || !address.trim()}
                className="px-3 py-2 rounded-xl border border-[#b42323] text-[#b42323] hover:bg-[#b42323] hover:text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
                title="Resolve GPS coordinates from address"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isResolvingAddress ? '...' : (isBn ? 'স্থানাঙ্ক খুঁজুন' : 'Find GPS')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'এলাকা / লোকালিটি' : 'Locality / Area'}
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder={isBn ? 'যেমন: কালীঘাট, ভবানীপুর' : 'e.g., Kalighat, Bhowanipore'}
                className="w-full px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs sm:text-sm font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'কলকাতার জোন' : 'Kolkata Zone'}
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as LocalityZone)}
                className="w-full px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs sm:text-sm font-medium text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              >
                {KOLKATA_ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'অক্ষাংশ (Latitude)' : 'Latitude'}
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="22.5200"
                className="w-full px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] mb-1">
                {isBn ? 'দ্রাঘিমাংশ (Longitude)' : 'Longitude'}
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="88.3500"
                className="w-full px-3 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-medium text-[#242424] dark:text-[#ede5dc] placeholder-[#a89e95] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] text-xs font-bold text-[#776d65] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={Boolean(successPandal)}
              className="px-5 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'ব্যক্তিগত স্টপ যোগ করুন' : 'Add New Pandal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
