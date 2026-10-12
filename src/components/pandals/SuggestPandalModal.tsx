'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Check,
  AlertCircle,
  Building,
  Navigation,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { PANDALS_DATA } from '@/data/pandals';
import { GeocodingService } from '@/lib/services/GeocodingService';
import { LocalityZone, Pandal } from '@/types';
import { cn } from '@/lib/utils/cn';

export interface CommunitySubmission {
  id: string;
  name: string;
  nameBn?: string;
  locality: string;
  zone: LocalityZone;
  address: string;
  latitude?: number;
  longitude?: number;
  sourceUrl?: string;
  submitterName?: string;
  submittedAt: string;
  status: 'Pending Community Verification' | 'Locally Active';
}

const STORAGE_KEY = 'pujopath_community_submissions';

interface SuggestPandalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPandalSubmitted?: (pandal: Pandal) => void;
}

export function SuggestPandalModal({
  isOpen,
  onClose,
  onPandalSubmitted,
}: SuggestPandalModalProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { addCustomPandal } = useFavorites();

  const [activeTab, setActiveTab] = useState<'submit' | 'my_submissions'>('submit');

  // Form Fields
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [locality, setLocality] = useState('');
  const [zone, setZone] = useState<LocalityZone>('North Kolkata');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [submitterName, setSubmitterName] = useState('');

  // Status & Validation states
  const [isResolving, setIsResolving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSubmission, setSuccessSubmission] = useState<CommunitySubmission | null>(null);

  // Stored Submissions
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);

  // Load existing submissions from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSubmissions(JSON.parse(raw));
      }
    } catch {
      // safe fallback
    }
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const resetForm = () => {
    setName('');
    setNameBn('');
    setLocality('');
    setZone('North Kolkata');
    setAddress('');
    setLat('');
    setLng('');
    setSourceUrl('');
    setSubmitterName('');
    setErrorMessage(null);
    setSuccessSubmission(null);
  };

  const handleResolveCoords = async () => {
    const query = address.trim() || locality.trim();
    if (!query) {
      setErrorMessage(
        isBn
          ? 'স্থানাঙ্ক অনুসন্ধানের জন্য অনুগ্রহ করে ঠিকানা বা এলাকা লিখুন।'
          : 'Please enter an address or locality to resolve coordinates.'
      );
      return;
    }
    setIsResolving(true);
    setErrorMessage(null);
    try {
      const result = await GeocodingService.resolveAddress(query);
      if (result) {
        setLat(result.latitude.toFixed(6));
        setLng(result.longitude.toFixed(6));
        if (result.zone) setZone(result.zone);
      } else {
        setErrorMessage(
          isBn
            ? 'ঠিকানা থেকে স্থানাঙ্ক পাওয়া যায়নি। আপনি চাইলে সরাসরি অক্ষাংশ-দ্রাঘিমাংশ লিখতে পারেন।'
            : 'Could not resolve exact coordinates for this address. You can optionally enter them manually.'
        );
      }
    } catch {
      setErrorMessage(
        isBn
          ? 'স্থানাঙ্ক খোঁজার সময় সমস্যা হয়েছে।'
          : 'Failed to resolve address coordinates.'
      );
    } finally {
      setIsResolving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedLocality = locality.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName) {
      setErrorMessage(isBn ? 'পূজামণ্ডপের নাম আবশ্যক।' : 'Pandal name is required.');
      return;
    }
    if (!trimmedLocality) {
      setErrorMessage(isBn ? 'এলাকা / পাড়ার নাম আবশ্যক।' : 'Locality / neighborhood is required.');
      return;
    }
    if (!trimmedAddress) {
      setErrorMessage(isBn ? 'ঠিকানা বা ল্যান্ডমার্ক আবশ্যক।' : 'Address or landmark is required.');
      return;
    }

    // 1. Check for duplicates in verified database
    const existingVerified = PANDALS_DATA.find(
      (p) =>
        p.name.toLowerCase() === trimmedName.toLowerCase() ||
        (p.nameBn && trimmedName && p.nameBn === trimmedName)
    );
    if (existingVerified) {
      setErrorMessage(
        isBn
          ? `এই নামে একটি মণ্ডপ (${existingVerified.name}) ইতিমধ্যে PujoPath ডিরেক্টরিতে অন্তর্ভুক্ত রয়েছে।`
          : `A pandal with this name ("${existingVerified.name}") is already cataloged in the PujoPath directory.`
      );
      return;
    }

    // 2. Check for duplicates in existing community submissions
    const existingSubmission = submissions.find(
      (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existingSubmission) {
      setErrorMessage(
        isBn
          ? 'এই মণ্ডপটি ইতিমধ্যে আপনার প্রস্তাব তালিকায় জমা দেওয়া রয়েছে।'
          : 'This pandal has already been submitted in your community suggestions list.'
      );
      return;
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const validCoords = !isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat > 0 && parsedLng > 0;

    const submissionId = `community-${Date.now()}`;
    const newSubmission: CommunitySubmission = {
      id: submissionId,
      name: trimmedName,
      nameBn: nameBn.trim() || undefined,
      locality: trimmedLocality,
      zone,
      address: trimmedAddress,
      latitude: validCoords ? parsedLat : undefined,
      longitude: validCoords ? parsedLng : undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      submitterName: submitterName.trim() || undefined,
      submittedAt: new Date().toISOString(),
      status: 'Locally Active',
    };

    // Update local storage
    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage quota safe
    }

    // Simultaneously register into custom pandals so it is active in Explore, Map, and Route Planner
    const slug = submissionId;
    const customPandal: Pandal = {
      id: submissionId,
      slug,
      name: trimmedName,
      nameBn: nameBn.trim() || trimmedName,
      zone,
      locality: trimmedLocality,
      localityBn: trimmedLocality,
      address: trimmedAddress,
      addressBn: trimmedAddress,
      latitude: validCoords ? parsedLat : 22.5726,
      longitude: validCoords ? parsedLng : 88.3639,
      theme: 'Community Submitted Neighborhood Puja',
      themeBn: 'জনসাধারণ দ্বারা প্রস্তাবিত পাড়ার দুর্গাপূজা',
      category: 'Community',
      description: `Community submitted pandal from ${trimmedLocality}. Verification pending by PujoPath curators.`,
      descriptionBn: `${trimmedLocality} এলাকার প্রস্তাবিত দুর্গাপূজা। পুজোটি স্থানীয় তালিকায় সক্রিয়।`,
      openingTime: '07:00 AM',
      closingTime: '01:00 AM',
      crowdLevel: 'Moderate',
      popularityScore: 85,
      rating: 4.5,
      reviewCount: 1,
      imageUrl: '',
      hasVerifiedPhoto: false,
      photoMetadata: {
        pandalId: submissionId,
        imageUrl: '',
        isAvailable: false,
        photoYear: null,
        verificationStatus: 'Photo Unavailable',
        sourceName: 'Community Submission (PujoPath User Registry)',
        verifiedDate: new Date().toISOString().split('T')[0],
        notes: 'Community-suggested pandal awaiting authentic 2025 photograph verification.',
      },
      galleryImages: [],
      isFeatured: false,
      isHeritage: false,
      isCustom: true,
      isUserAdded: true,
      isCommunitySubmitted: true,
      hasUnresolvedCoordinates: !validCoords,
      verificationStatus: 'Partially verified',
      coordinateConfidence: validCoords ? 'High' : 'Needs verification',
      verificationDate: new Date().toISOString().split('T')[0],
      sourceUrl: sourceUrl.trim() || undefined,
      sourceName: 'Community Submission (PujoPath User Registry)',
      metroLinks: [],
      facilities: {
        wheelchairAccessible: true,
        drinkingWater: true,
        medicalBooth: false,
        vipPassEntry: false,
        parkingAvailable: false,
      },
    };

    addCustomPandal(customPandal);
    if (onPandalSubmitted) onPandalSubmitted(customPandal);

    setSuccessSubmission(newSubmission);
  };

  const handleDeleteSubmission = (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe
    }
  };

  const handleExportJSON = () => {
    if (submissions.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `pujopath-community-submissions-${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggest-pandal-title"
      className="fixed inset-0 z-[1300] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eee8e1] dark:border-[#2f2720] shrink-0 bg-linear-to-r from-red-50/50 to-amber-50/30 dark:from-red-950/20 dark:to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#b42323]/10 dark:bg-[#b42323]/20 flex items-center justify-center text-[#b42323] shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="suggest-pandal-title"
                className="text-lg sm:text-xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight"
              >
                {isBn ? 'নতুন মণ্ডপ প্রস্তাব করুন' : 'Suggest a Missing Pandal'}
              </h2>
              <p className="text-xs text-[#776d65] dark:text-[#a89e95]">
                {isBn
                  ? 'আপনার এলাকার বা পাড়ার অজানা পুজো যোগ করে ডিরেক্টরি সমৃদ্ধ করুন'
                  : 'Help discover local neighborhood and para pujas missing from directories'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            className="p-2 rounded-xl text-[#776d65] hover:text-[#242424] dark:hover:text-[#ede5dc] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#eee8e1] dark:border-[#2f2720] px-5 bg-[#fcfaf7] dark:bg-[#15120f] shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('submit');
              setSuccessSubmission(null);
            }}
            className={cn(
              'py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'submit'
                ? 'border-[#b42323] text-[#b42323]'
                : 'border-transparent text-[#776d65] dark:text-[#a89e95] hover:text-[#242424]'
            )}
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'প্রস্তাব ফর্ম' : 'Submit Pandal'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_submissions')}
            className={cn(
              'py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'my_submissions'
                ? 'border-[#b42323] text-[#b42323]'
                : 'border-transparent text-[#776d65] dark:text-[#a89e95] hover:text-[#242424]'
            )}
          >
            <span>{isBn ? 'আমার প্রস্তাব তালিকা' : 'My Submissions'}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#b42323]/10 text-[#b42323] font-black">
              {submissions.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
          {activeTab === 'submit' ? (
            successSubmission ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                    {isBn ? 'মণ্ডপ প্রস্তাব সফলভাবে সংরক্ষিত হয়েছে!' : 'Pandal Suggestion Successfully Saved!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                    {isBn
                      ? `"${successSubmission.name}" আপনার ব্রাউজারে সংরক্ষিত হয়েছে এবং তাৎক্ষণিকভাবে আপনার এক্সপ্লোর ও রুট প্ল্যানারে যুক্ত করা হয়েছে।`
                      : `"${successSubmission.name}" is genuinely saved to your device and immediately activated in your local Explore and Route Planner trails.`}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#1a1613] border border-emerald-100 dark:border-emerald-900 text-left text-xs space-y-1">
                  <div>
                    <span className="font-bold">{isBn ? 'মণ্ডপ:' : 'Pandal:'}</span> {successSubmission.name}
                  </div>
                  <div>
                    <span className="font-bold">{isBn ? 'এলাকা:' : 'Neighborhood:'}</span> {successSubmission.locality} ({successSubmission.zone})
                  </div>
                  <div>
                    <span className="font-bold">{isBn ? 'স্ট্যাটাস:' : 'Status:'}</span>{' '}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
                      {isBn ? 'পাড়ায় সক্রিয় (স্থানীয় সংস্করণ)' : 'Locally Active in Trail'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 font-bold text-xs hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 transition-colors cursor-pointer"
                  >
                    {isBn ? '+ আরেকটি প্রস্তাব যোগ করুন' : '+ Suggest Another Pandal'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    {isBn ? 'সম্পন্ন' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? 'মণ্ডপের নাম *' : 'Pandal Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isBn ? 'উদা: বিবেকানন্দ স্মৃতি সংঘ' : 'e.g. Vivekananda Smriti Sangha'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? 'বাংলা নাম (ঐচ্ছিক)' : 'Bengali Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={nameBn}
                      onChange={(e) => setNameBn(e.target.value)}
                      placeholder="বাংলায় নাম"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? 'অঞ্চল (জোন) *' : 'Zone *'}
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value as LocalityZone)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323]"
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

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? 'পাড়া বা এলাকা *' : 'Locality / Neighborhood *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder={isBn ? 'উদা: হাতিবাগান, গড়িয়াহাট, বেহালা চৌরাস্তা' : 'e.g. Hatibagan, Gariahat, Behala Chowrasta'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#242424] dark:text-[#ede5dc]">
                        {isBn ? 'ঠিকানা বা ল্যান্ডমার্ক *' : 'Address or Landmark *'}
                      </label>
                      <button
                        type="button"
                        onClick={handleResolveCoords}
                        disabled={isResolving}
                        className="text-[11px] font-bold text-[#b42323] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{isResolving ? (isBn ? 'খোঁজা হচ্ছে...' : 'Resolving...') : (isBn ? 'ঠিকানা যাচাই করুন' : 'Resolve Coordinates')}</span>
                      </button>
                    </div>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={isBn ? 'রাস্তার নাম, ল্যান্ডমার্ক বা পিনকোড' : 'Street name, landmark, nearby crossroads'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323] resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#776d65] dark:text-[#a89e95]">
                      {isBn ? 'অক্ষাংশ (Latitude - ঐচ্ছিক)' : 'Latitude (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="e.g. 22.5726"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs font-mono text-[#242424] dark:text-[#ede5dc]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#776d65] dark:text-[#a89e95]">
                      {isBn ? 'দ্রাঘিমাংশ (Longitude - ঐচ্ছিক)' : 'Longitude (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="e.g. 88.3639"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs font-mono text-[#242424] dark:text-[#ede5dc]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? 'রেফারেন্স / নিউজ লিংক (ঐচ্ছিক)' : 'Source / Committee Link (Optional)'}
                    </label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://facebook.com/... or official news link"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-[#242424] dark:text-[#ede5dc]">
                      {isBn ? 'আপনার নাম / পরিচয় (ঐচ্ছিক)' : 'Your Name / Para Resident (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      placeholder={isBn ? 'উদা: সুমিত বসু, স্থানীয় বাসিন্দা' : 'e.g. Local resident, committee member'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#14110e] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] text-xs font-bold text-[#776d65] hover:text-[#242424] dark:hover:text-[#ede5dc] transition-colors cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{isBn ? 'মণ্ডপ প্রস্তাব জমা দিন' : 'Submit & Add to Trail'}</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Tab: My Submissions */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#776d65] dark:text-[#a89e95]">
                  {isBn
                    ? `মোট সংরক্ষিত প্রস্তাব: ${submissions.length} টি`
                    : `Locally Saved Submissions: ${submissions.length}`}
                </span>
                {submissions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] text-xs font-bold text-[#b42323] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isBn ? 'JSON ডাউনলোড' : 'Export (.JSON)'}</span>
                  </button>
                )}
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-[#eee8e1] dark:border-[#2f2720] text-center space-y-2">
                  <ShieldAlert className="w-8 h-8 text-[#776d65] mx-auto opacity-40" />
                  <p className="text-xs sm:text-sm font-semibold text-[#776d65] dark:text-[#a89e95]">
                    {isBn
                      ? 'এখনও কোনো মণ্ডপ প্রস্তাব করা হয়নি।'
                      : 'You haven’t submitted any community pandals yet.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('submit')}
                    className="font-bold text-xs text-[#b42323] underline cursor-pointer"
                  >
                    {isBn ? 'প্রথম প্রস্তাবটি যুক্ত করুন' : 'Submit your first recommendation'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#15120f] flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#242424] dark:text-[#ede5dc] truncate">
                            {sub.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-[#776d65] dark:text-[#a89e95]">
                          {sub.locality} • <span className="font-semibold">{sub.zone}</span>
                        </p>
                        <p className="text-[11px] text-[#8d8278] dark:text-[#7d736a] line-clamp-1">
                          {sub.address}
                        </p>
                        {sub.sourceUrl && (
                          <a
                            href={sub.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#b42323] hover:underline"
                          >
                            <span>{isBn ? 'সোর্স লিংক' : 'Source Link'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubmission(sub.id)}
                        aria-label={isBn ? 'মুছে ফেলুন' : 'Delete'}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
