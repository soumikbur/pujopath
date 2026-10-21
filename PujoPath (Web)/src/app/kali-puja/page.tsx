'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Calendar,
  Clock,
  Moon,
  Sparkles,
  MapPin,
  CheckCircle,
  AlertCircle,
  Compass,
  Building,
  Navigation,
  ExternalLink,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import {
  AVAILABLE_KALI_PUJA_YEARS,
  getKaliPujaSchedule,
  KALI_PUJA_TRADITIONS,
  KALI_PRANAM_MANTRA,
} from '@/data/calendar/kaliPuja';
import { KALI_TEMPLES_DATA, KaliTemple } from '@/data/pandals/kaliTemples';
import { KALI_PANDALS_DATA } from '@/data/pandals/kaliPandals';

export default function KaliPujaPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [templeCategory, setTempleCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const schedule = getKaliPujaSchedule(selectedYear);

  const categories = useMemo(
    () => [
      { id: 'All', label: isBn ? 'সকল তীর্থক্ষেত্র' : 'All Sites' },
      { id: 'Historic Shaktipeeth', label: isBn ? 'মহাপীঠ' : 'Shaktipeeths' },
      { id: 'Heritage Mandir', label: isBn ? 'বনেদি মন্দির' : 'Heritage' },
      { id: 'Riverside Shrine', label: isBn ? 'গঙ্গাতীরবর্তী' : 'Riverside' },
      { id: 'Celebrated Pandal', label: isBn ? 'বিখ্যাত সর্বজনীন' : 'Celebrated' },
    ],
    [isBn]
  );

  const filteredTemples = useMemo(() => {
    let list = [...KALI_TEMPLES_DATA];
    if (templeCategory !== 'All') {
      list = list.filter((t) => t.category === templeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.nameBn.includes(q) ||
          t.zone.toLowerCase().includes(q) ||
          t.zoneBn.includes(q) ||
          t.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [templeCategory, searchQuery]);

  // Featured Barasat Pandals
  const barasatPandals = useMemo(() => {
    return KALI_PANDALS_DATA.filter((p) => p.zone === 'Barasat').slice(0, 6);
  }, []);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16 px-1">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-7 sm:p-10 bg-gradient-to-br from-[#1b0a2a] via-[#2d1245] to-[#12071d] text-white border border-[#4c1d7a]/50 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'দীপান্বিতা অমাবস্যা' : 'Dipanwita Amavasya'}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold">
              {selectedYear}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-purple-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isBn ? schedule.locationBn : schedule.location}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {isBn ? 'মা শ্যামা পূজা ও বারাসাত পরিক্রমা' : 'Sacred Kali Puja & Barasat Circuit'}
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium">
            {isBn ? 'অন্ধকার বিনাশিনী আদ্যাশক্তি মহামায়ার পুণ্য আরাধনা' : 'Shyama Puja • Adoration of Adya Shakti & Grand Illumination'}
          </p>

          <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed">
            {isBn
              ? 'কার্তিক মাসের অমাবস্যার পুণ্য মহানিশায় অনুষ্ঠিত হয় মা কালীর আরাধনা। কালীঘাট মহাপীঠ, রানী রাসমণির দক্ষিণেশ্বর ও বারাসাতের বিশ্বখ্যাত আলোকসজ্জা—বাঙালির দীপাবলি ও শ্যামাপূজার পূর্ণাঙ্গ নির্দেশিকা।'
              : 'Celebrated on the sacred new moon night of Kartik (Mahanisha), Kali Puja honors Goddess Shyama. From Kalighat Shaktipeeth and Dakshineswar to Barasat’s world-famous multi-kilometer light corridors and colossal theme pandals.'}
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. YEAR SELECTOR & VERIFICATION BADGE */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#b42323] dark:text-[#e05656]" />
          <span className="text-sm font-bold text-[#242424] dark:text-[#ede5dc]">
            {isBn ? 'পঞ্জিকা বছর নির্বাচন করুন:' : 'Select Panjika Year:'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {AVAILABLE_KALI_PUJA_YEARS.map((yr) => {
            const isSelected = yr === selectedYear;
            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-[#b42323] text-white shadow-md scale-105'
                    : 'bg-[#faf7f2] dark:bg-[#251e18] text-[#554b44] dark:text-[#c4b9ae] border border-[#ded4c8] dark:border-[#382e25] hover:border-[#b42323]'
                }`}
              >
                {yr}
                {yr === 2026 && (
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            schedule.verified
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          }`}
        >
          {schedule.verified ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          <span>
            {schedule.verified
              ? isBn
                ? 'বিশুদ্ধ পঞ্জিকা দ্বারা নিশ্চিত'
                : 'Verified Panjika Muhurat'
              : isBn
              ? 'সাময়িক সময়সূচী'
              : 'Provisional'}
          </span>
        </div>
      </div>

      {/* 3. NISHITA KAAL & AMAVASYA TIMINGS CARD */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#fffbf5] to-[#fff3e5] dark:from-[#21160e] dark:to-[#1a110a] border border-amber-300/60 dark:border-amber-900/40 shadow-card space-y-6">
        <div className="flex items-center gap-3 border-b border-amber-200/60 dark:border-amber-900/40 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                {isBn ? 'প্রধান নিশীথ লগ্ন' : 'Primary Puja Muhurat'}
              </span>
              <span className="text-xs text-[#78350f] dark:text-amber-200/80 font-medium">
                {isBn ? schedule.nishitaKaalPuja.applicableNightBn : schedule.nishitaKaalPuja.applicableNight}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-0.5">
              {isBn ? 'মহানিশা ও নিশীথ কাল পূজা সময়' : 'Mahanisha & Nishita Kaal Timing'}
            </h2>
          </div>
        </div>

        {/* Highlight Box */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-400/40 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#92400e] dark:text-amber-400">
                {isBn ? 'পূজার পুণ্য সময়সীমা (কলকাতা):' : 'Auspicious Midnight Window (Kolkata):'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#78350f] dark:text-amber-300 mt-0.5">
                {isBn ? schedule.nishitaKaalPuja.windowStringBn : schedule.nishitaKaalPuja.windowString}
              </div>
            </div>
            {schedule.nishitaKaalPuja.durationMinutes > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold text-xs self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isBn
                    ? `${schedule.nishitaKaalPuja.durationMinutes} মিনিট`
                    : `${schedule.nishitaKaalPuja.durationMinutes} mins`}
                </span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#78350f] dark:text-amber-200/90 leading-relaxed">
            {isBn ? schedule.nishitaKaalPuja.descriptionBn : schedule.nishitaKaalPuja.description}
          </p>
        </div>

        {/* Amavasya Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#2b1f15] border border-amber-200/50 dark:border-amber-900/40">
            <span className="text-xs font-bold text-[#8a7f76] dark:text-[#a89e95]">
              {isBn ? 'অমাবস্যা তিথি আরম্ভ' : 'Amavasya Begins'}
            </span>
            <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc] mt-1">
              {isBn ? schedule.amavasyaTithi.beginsBn : schedule.amavasyaTithi.begins}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#2b1f15] border border-amber-200/50 dark:border-amber-900/40">
            <span className="text-xs font-bold text-[#8a7f76] dark:text-[#a89e95]">
              {isBn ? 'অমাবস্যা তিথি সমাপ্তি' : 'Amavasya Ends'}
            </span>
            <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc] mt-1">
              {isBn ? schedule.amavasyaTithi.endsBn : schedule.amavasyaTithi.ends}
            </div>
          </div>
        </div>

        {/* Source info */}
        <div className="flex items-start gap-2 text-xs text-[#776d65] dark:text-[#a89e95] pt-1">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {isBn
              ? `উৎস: ${schedule.sourceBn} • বিশুদ্ধ সিদ্ধান্ত ও দৃক সিদ্ধান্ত পঞ্জিকা মান মন্দির হিসাব অনুযায়ী।`
              : `Source: ${schedule.source}. Derived according to astronomical panjika calculations.`}
          </span>
        </div>
      </div>

      {/* 4. BHOOT CHATURDASHI & 14 DIYAS */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              {isBn ? 'কালীপূজার পূর্বদিন' : 'Preceding Eve of Kali Puja'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'ভূত চতুর্দশী ও ১৪ প্রদীপ' : 'Bhoot Chaturdashi & 14 Lamps'}
            </h3>
            <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] leading-relaxed max-w-xl">
              {isBn ? schedule.bhootChaturdashi.ritualsBn : schedule.bhootChaturdashi.rituals}
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#ded4c8] dark:border-[#382e25] text-xs font-bold text-[#242424] dark:text-[#ede5dc] shrink-0">
          {isBn ? schedule.bhootChaturdashi.dateStringBn : schedule.bhootChaturdashi.dateString}
        </div>
      </div>

      {/* 5. SACRED PRANAM MANTRA */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] dark:from-[#1d1226] dark:to-[#160d1e] border border-purple-300/60 dark:border-purple-900/40 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{isBn ? 'শ্রী শ্রী কালী প্রণাম মন্ত্র' : 'Sacred Kali Pranam Mantra'}</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#130b1a] border border-purple-200 dark:border-purple-900/50 space-y-3 text-center sm:text-left">
          <div className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-200 font-serif leading-relaxed whitespace-pre-line">
            {KALI_PRANAM_MANTRA.sanskrit}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-mono italic whitespace-pre-line">
            {KALI_PRANAM_MANTRA.transliteration}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-purple-950/80 dark:text-purple-200/80 leading-relaxed">
          {isBn ? KALI_PRANAM_MANTRA.meaningBn : KALI_PRANAM_MANTRA.meaningEn}
        </p>
      </div>

      {/* 6. FOUR TRADITIONS PILLARS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
            {isBn ? 'কালীপূজার ঐতিহ্য ও রীতি' : 'Traditions & Sacred Rituals'}
          </h2>
          <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-1">
            {isBn
              ? 'চৌদ্দ প্রদীপ থেকে মহানিশার সাধনা—বাঙালির চিরায়ত ভক্তি ও আলোক উৎসব'
              : 'From 14 ancestral lamps to midnight Mahanisha worship and citywide illumination'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KALI_PUJA_TRADITIONS.map((tradition) => (
            <div
              key={tradition.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card space-y-2.5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${tradition.color}15`,
                    borderColor: `${tradition.color}35`,
                    color: tradition.color,
                  }}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                  {isBn ? tradition.titleBn : tradition.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                {isBn ? tradition.descBn : tradition.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. BARASAT PUBLIC PANDAL CIRCUIT HIGHLIGHTS */}
      <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#fff7f0] to-[#fbf0e4] dark:from-[#24170d] dark:to-[#1c1109] border border-orange-300/50 dark:border-orange-900/40 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>{isBn ? 'বারাসাত শ্যামাপূজা পরিক্রমা' : 'Barasat Kali Puja Circuit'}</span>
            </div>
            <h2 className="text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-1">
              {isBn ? 'বারাসাতের বিশ্বখ্যাত সর্বজনীন মণ্ডপ' : 'Barasat Iconic Theme Pandals'}
            </h2>
            <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-1 max-w-xl">
              {isBn
                ? 'বারাসাত পুলিশ ডিস্ট্রিক্ট গাইডম্যাপের অফিসিয়াল তথ্য অনুযায়ী ভেরিফায়েড ঐতিহাসিক ক্লাবসমূহ।'
                : 'Verified public pandals and light corridors from the official Barasat Kali Puja guide.'}
            </p>
          </div>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>{isBn ? 'ম্যাপে বারাসাত দেখুন' : 'Explore on Map'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {barasatPandals.map((pandal) => (
            <div
              key={pandal.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1b140e] border border-orange-200/50 dark:border-orange-900/40 shadow-xs flex flex-col justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                  {pandal.locality}
                </span>
                <h4 className="text-sm font-bold text-[#242424] dark:text-[#ede5dc] mt-1.5 line-clamp-1">
                  {isBn ? pandal.nameBn : pandal.name}
                </h4>
                <p className="text-xs text-[#665a54] dark:text-[#a89e95] mt-1 line-clamp-2">
                  {isBn ? pandal.themeBn : pandal.theme}
                </p>
              </div>

              <div className="pt-2 border-t border-orange-100 dark:border-orange-900/30 flex items-center justify-between text-[11px] text-[#8a7f76] dark:text-[#a89e95]">
                <span>Est. {pandal.establishedYear}</span>
                <Link
                  href={`/explore?q=${encodeURIComponent(pandal.name)}`}
                  className="font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                >
                  <span>{isBn ? 'বিস্তারিত' : 'View'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. HISTORIC SHAKTIPEETHS & TEMPLES DIRECTORY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
              {isBn ? 'ঐতিহাসিক কালীক্ষেত্র ও শক্তিপীঠ' : 'Revered Kali Shrines & Shaktipeeths'}
            </h2>
            <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-1">
              {isBn
                ? 'কালীঘাট সতীপীঠ থেকে রানী রাসমণির দক্ষিণেশ্বর ও প্রাচীন ঠনঠনিয়া কালীবাড়ি'
                : 'From Kalighat Shaktipeeth to Dakshineswar and 300-year-old Thanthania Kalibari'}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7f76]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'মন্দির বা এলাকা খুঁজুন...' : 'Search shrines or zones...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:border-[#b42323]"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setTempleCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                templeCategory === cat.id
                  ? 'bg-[#b42323] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1a1613] text-[#665a54] dark:text-[#a89e95] border border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Shrines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTemples.map((temple) => (
            <div
              key={temple.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-900/40">
                      {isBn ? temple.categoryBn : temple.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] mt-1.5">
                      {isBn ? temple.nameBn : temple.name}
                    </h3>
                    <p className="text-xs text-[#8a7f76] dark:text-[#7f746b] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isBn ? temple.zoneBn : temple.zone}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] leading-relaxed line-clamp-3">
                  {isBn ? temple.historyBn : temple.history}
                </p>

                <div className="p-3 rounded-xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#eee8e1] dark:border-[#382e25] text-xs space-y-1">
                  <div className="font-semibold text-[#242424] dark:text-[#ede5dc]">
                    {isBn ? 'বিশেষ নির্ঘণ্ট ও সময়:' : 'Festival Timing:'}
                  </div>
                  <div className="text-[#665a54] dark:text-[#a89e95]">
                    {isBn ? temple.specialTimingBn : temple.specialTiming}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f2ece4] dark:border-[#27211c] flex items-center justify-between text-xs">
                <span className="text-[#8a7f76] dark:text-[#7f746b]">
                  {temple.nearestMetro ? (isBn ? temple.nearestMetroBn : temple.nearestMetro) : ''}
                </span>
                <Link
                  href={`/map?q=${encodeURIComponent(temple.name)}`}
                  className="font-bold text-[#b42323] dark:text-[#e05656] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>{isBn ? 'ম্যাপে দেখুন' : 'View on Map'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
