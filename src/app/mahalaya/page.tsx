'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Play, Radio, Volume2 } from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { MUSIC_TRACKS_DATA } from '@/data/music';
import { getAssetPath } from '@/lib/utils';

export default function MahalayaPage() {
  const { playTrack, isPlaying, togglePlay, currentTrack } = useAudio();
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const mahalayaTrack = MUSIC_TRACKS_DATA[0]; // Mahishasura Mardini
  const isCurrentPlaying = currentTrack?.id === mahalayaTrack.id && isPlaying;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
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
            ? '১৯৩১ সাল থেকে আকাশবাণী কলকাতা থেকে প্রচারিত বীরেন্দ্রকৃষ্ণ ভদ্রের উদাত্ত কণ্ঠের চণ্ডীপাঠ ও বাণী কুমার রচিত মহিষাসুরমর্দিনী।'
            : 'The timeless dawn recitation by Birendra Krishna Bhadra broadcast across Bengal since 1931 on All India Radio.'}
        </p>
      </div>

      {/* Hero Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-card border border-[#eee8e1] dark:border-[#2f2720] shrink-0 bg-white dark:bg-[#14110e]">
          <Image
            src={getAssetPath('/images/mahalaya-thumb.jpg')}
            alt="মহালয়া চণ্ডীপাঠ"
            fill
            priority
            className="object-cover"
            sizes="220px"
          />
        </div>

        <div className="space-y-3.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#fdeeee] dark:bg-[#341b18] text-[#d52f2f] dark:text-[#e05656] border border-[#f6ceca] dark:border-[#4a2420] shadow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{isBn ? 'আকাশবাণী কলকাতা মহাফেজখানা' : 'AIR Akashvani Archive'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#242424] dark:text-[#ede5dc]">
            {isBn ? 'মহিষাসুরমর্দিনী (বীরেন্দ্রকৃষ্ণ ভদ্র)' : 'Mahishasura Mardini (Chandi Path)'}
          </h2>
          <p className="text-sm sm:text-base text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed max-w-lg font-medium">
            {isBn
              ? 'বীরেন্দ্রকৃষ্ণ ভদ্রের গম্ভীর কণ্ঠের চণ্ডীপাঠ, পঙ্কজ কুমার মল্লিকের সুরে গান ও দ্বিজেন মুখোপাধ্যায়, শ্যামল মিত্রের কালজয়ী গীতিধারা।'
              : 'Narrated by Birendra Krishna Bhadra with sacred shlokas, invocations of Goddess Durga, and celestial songs composed by Pankaj Kumar Mullick.'}
          </p>

          <button
            onClick={() => {
              if (currentTrack?.id === mahalayaTrack.id) {
                togglePlay();
              } else {
                playTrack(mahalayaTrack);
              }
            }}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-sm shadow-sm transition-all active:scale-95 mt-2"
          >
            {isCurrentPlaying ? <Volume2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isCurrentPlaying ? (isBn ? 'প্রচার থামান' : 'Pause Broadcast') : (isBn ? 'ভোরের চণ্ডীপাঠ শুনুন' : 'Listen to Dawn Chandi Path')}</span>
          </button>
        </div>
      </div>

      {/* Historical Context */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] space-y-3 text-sm text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed font-medium">
        <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc]">
          {isBn ? '১৯৩১ সালের ঐতিহাসিক বেতার সম্প্রচার' : 'About the 1931 Sacred Broadcast'}
        </h3>
        <p>
          {isBn
            ? '১৯৩১ সালে মহালয়ার ভোরে ৪টায় আকাশবাণীর ১ নম্বর গার্স্টিন প্লেসের স্টুডিও থেকে প্রথমবার সরাসরি সম্প্রচারিত হয় মহিষাসুরমর্দিনী। নয় দশক পেরিয়েও মহালয়ার ভোরে বীরেন্দ্রকৃষ্ণ ভদ্রের সেই উদাত্ত মন্ত্রোচ্চারণেই বাঙালির দুর্গাপূজার সূচনা হয়।'
            : 'First broadcast live at 4:00 AM on the dawn of Mahalaya in 1931 from the 1, Garstin Place studio of All India Radio Kolkata. Even after nine decades, Bengal awakens at dawn on Mahalaya to the resonant voice of Birendra Krishna Bhadra reciting the Chandi Mahatmya.'}
        </p>
      </div>
    </div>
  );
}
