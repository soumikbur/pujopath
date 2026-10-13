'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Radio,
  ExternalLink,
  ShieldCheck,
  Music2,
  Info,
  Play,
  Pause,
  Loader2,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useAudio } from '@/lib/context/AudioContext';
import { MUSIC_TRACKS_DATA } from '@/data/music';
import { getAssetPath } from '@/lib/utils';

export default function MahalayaPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const { currentTrack, isPlaying, isLoading, playTrack, togglePlay } = useAudio();

  const mahalayaTrack =
    MUSIC_TRACKS_DATA.find((t) => t.id === 'track-mahalaya-original') || MUSIC_TRACKS_DATA[0];

  const isSelected = currentTrack?.id === mahalayaTrack.id;

  const officialListenUrl =
    mahalayaTrack.externalListenUrl ||
    mahalayaTrack.sourceUrl ||
    'https://www.youtube.com/watch?v=kmQEtYOtbmI';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{isBn ? 'দেবীপক্ষের পুণ্য প্রভাত' : 'Dawn Broadcast Heritage'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'মহালয়া ও অমর মহিষাসুরমর্দিনী' : 'Mahalaya & Mahishasura Mardini'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1">
          {isBn
            ? '১৯৩১ সাল থেকে আকাশবাণী কলকাতা থেকে প্রচারিত বীরেন্দ্রকৃষ্ণ ভদ্রের উদাত্ত কণ্ঠের চণ্ডীপাঠ ও বাণীকুমার রচিত মহিষাসুরমর্দিনী।'
            : 'The timeless dawn recitation by Birendra Krishna Bhadra broadcast across Bengal since 1931 on All India Radio.'}
        </p>
      </div>

      {/* Hero Showcase */}
      <div className="p-5 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-3xl overflow-hidden shadow-card border border-[#eee8e1] dark:border-[#2f2720] shrink-0 bg-white dark:bg-[#14110e]">
          <Image
            src={getAssetPath('/images/mahalaya-thumb.jpg')}
            alt="মহালয়া চণ্ডীপাঠ"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 144px, 208px"
          />
        </div>

        <div className="space-y-3.5 text-center md:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#fdeeee] dark:bg-[#341b18] text-[#d52f2f] dark:text-[#e05656] border border-[#f6ceca] dark:border-[#4a2420] shadow-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{isBn ? 'আকাশবাণী কলকাতা মহাফেজখানা' : 'AIR Akashvani Archive (1931)'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? 'অনুমোদিত ইন-পেজ স্ট্রিম' : 'Authorized In-Page Stream'}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#242424] dark:text-[#ede5dc] leading-tight">
            {isBn ? 'মহিষাসুরমর্দিনী — বীরেন্দ্রকৃষ্ণ ভদ্র' : 'Mahishasura Mardini — Birendra Krishna Bhadra'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed max-w-lg font-medium">
            {isBn
              ? 'বীরেন্দ্রকৃষ্ণ ভদ্রের উদাত্ত চণ্ডীপাঠ, বাণীকুমারের কাব্যগ্রন্থনা এবং পঙ্কজ কুমার মল্লিকের অমর সুরসংযোজনায় ৯ দশকের ঐতিহ্যবাহী মহালয়ার প্রভাতী বাণী।'
              : 'Sacred Sanskrit Chandi Mahatmya, script by Bani Kumar, and musical direction by Pankaj Kumar Mullick awakening Bengal for over 90 years.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <button
              type="button"
              onClick={() => (isSelected ? togglePlay() : playTrack(mahalayaTrack))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              {isSelected && isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSelected && isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
              <span>
                {isSelected && isLoading
                  ? (isBn ? 'লোড হচ্ছে...' : 'Buffering...')
                  : isSelected && isPlaying
                  ? (isBn ? 'থামান' : 'Pause Recitation')
                  : (isBn ? 'মহালয়া সরাসরি শুনুন' : 'Play Mahishasura Mardini')}
              </span>
            </button>

            <Link
              href="/music"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#201c18] text-xs font-bold text-[#4a423d] dark:text-[#c4b9ae] hover:text-[#b42323] transition-colors"
            >
              <Music2 className="w-4 h-4 text-[#b42323]" />
              <span>{isBn ? 'শারদীয়া সঙ্গীত সম্ভার' : 'Browse Puja Music'}</span>
            </Link>

            <a
              href={officialListenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs font-semibold text-[#665a54] dark:text-[#a89e95] hover:text-[#b42323] transition-colors"
            >
              <span>{isBn ? 'আর্কাইভ সোর্স' : 'Archive Source'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* In-Page Stream Player Box when playing */}
          {isSelected && isPlaying && mahalayaTrack.embedUrl && (
            <div className="w-full mt-4 rounded-2xl overflow-hidden aspect-video max-w-lg bg-black border border-[#eee8e1] dark:border-[#2f2720] shadow-lg">
              <iframe
                src={`${mahalayaTrack.embedUrl}?autoplay=1&enablejsapi=1`}
                title={mahalayaTrack.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>


      {/* Broadcast Credits Grid */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b42323]" />
          <span>{isBn ? 'কালজয়ী সৃষ্টির কারিগরবৃন্দ' : 'The Creative Legends'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#15120f] border border-[#eee8e1] dark:border-[#2f2720] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b42323]">
              {isBn ? 'বাচন ও চণ্ডীপাঠ' : 'Recitation & Chandi Path'}
            </span>
            <p className="font-bold text-sm text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'বীরেন্দ্রকৃষ্ণ ভদ্র' : 'Birendra Krishna Bhadra'}
            </p>
            <p className="text-[#665a54] dark:text-[#a89e95]">
              {isBn ? 'উদাত্ত কণ্ঠের গম্ভীর মন্ত্রোচ্চারণ' : 'Iconic resonant sacred invocation'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#15120f] border border-[#eee8e1] dark:border-[#2f2720] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b42323]">
              {isBn ? 'গ্রন্থনা ও রচনা' : 'Script & Concept'}
            </span>
            <p className="font-bold text-sm text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'বাণীকুমার' : 'Bani Kumar'}
            </p>
            <p className="text-[#665a54] dark:text-[#a89e95]">
              {isBn ? 'শ্রীশ্রীচণ্ডী অবলম্বনে আলেখ্য' : 'Chandi Mahatmya literary composition'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#15120f] border border-[#eee8e1] dark:border-[#2f2720] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b42323]">
              {isBn ? 'সঙ্গীত পরিচালনা' : 'Music Direction'}
            </span>
            <p className="font-bold text-sm text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'পঙ্কজ কুমার মল্লিক' : 'Pankaj Kumar Mullick'}
            </p>
            <p className="text-[#665a54] dark:text-[#a89e95]">
              {isBn ? 'ধ্রুপদী ও ভক্তিমূলক সুরযোজনা' : 'Timeless orchestral & vocal score'}
            </p>
          </div>
        </div>
      </div>

      {/* Historical Context & Copyright Clarification */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] space-y-3.5 text-xs sm:text-sm text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed font-medium">
        <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc]">
          {isBn ? '১৯৩১ সালের ঐতিহাসিক বেতার সম্প্রচার' : 'About the 1931 Sacred Broadcast'}
        </h3>
        <p>
          {isBn
            ? '১৯৩১ সালে মহালয়ার ভোরে ৪টায় আকাশবাণীর ১ নম্বর গার্স্টিন প্লেসের স্টুডিও থেকে প্রথমবার সরাসরি সম্প্রচারিত হয় মহিষাসুরমর্দিনী। নয় দশক পেরিয়েও মহালয়ার ভোরে বীরেন্দ্রকৃষ্ণ ভদ্রের সেই উদাত্ত মন্ত্রোচ্চারণেই বাঙালির দুর্গাপূজার সূচনা হয়।'
            : 'First broadcast live at 4:00 AM on the dawn of Mahalaya in 1931 from the 1, Garstin Place studio of All India Radio Kolkata. Even after nine decades, Bengal awakens at dawn on Mahalaya to the resonant voice of Birendra Krishna Bhadra reciting the Chandi Mahatmya.'}
        </p>

        <div className="pt-2 border-t border-[#eee8e1] dark:border-[#2f2720] flex items-start gap-2.5 text-xs text-[#776d65] dark:text-[#a89e95]">
          <Info className="w-4 h-4 shrink-0 text-[#b42323] mt-0.5" />
          <p>
            {isBn
              ? 'আইনি স্বত্বাধিকার ও আর্কাইভ তথ্য: অল ইন্ডিয়া রেডিও (প্রসার ভারতী) এবং সারেগামা ইন্ডিয়ার কপিরাইট নীতিমালার প্রতি পূর্ণ শ্রদ্ধা রেখে পূজোপথ কোনো বিভ্রান্তিকর বা অননুমোদিত অডিও রিপ্লেসমেন্ট ব্যবহার করে না। ঐতিহাসিক মূল মহিষাসুরমর্দিনী শোনার জন্য অফিসিয়াল অনুমোদিত চ্যানেল লিঙ্ক প্রদান করা হয়েছে।'
              : 'Copyright & Archival Context: Commercial recording and broadcast rights are held by All India Radio (Prasar Bharati) and Saregama India. In strict accordance with copyright guidelines, PujoPath directs listeners exclusively to official verified streams rather than unauthorized local hosting or deceptive audio substitutions.'}
          </p>
        </div>
      </div>
    </div>
  );
}
