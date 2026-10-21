'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFestival } from '@/lib/context/FestivalContext';
import { getAssetPath } from '@/lib/utils';

export function PujaHighlights() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { isKali } = useFestival();

  const durgaHighlights = [
    {
      title: isBn ? 'ঐতিহ্য ও মণ্ডপ শিল্পকলা' : 'Traditions & Pandal Art',
      desc: isBn
        ? 'শতবর্ষের বনেদি বাড়ির পুজো ও কলকাতার সেরা সৃজনশীল শিল্পকর্ম।'
        : "Discover Bengal's timeless heritage celebrations and creative installations.",
      image: getAssetPath('/images/pandals/sovabazar-rajbari.webp'),
      href: '/explore',
      badge: isBn ? 'ঐতিহ্য ও শিল্প' : 'Traditions & Art',
    },
    {
      title: isBn ? 'পুজোর নির্ঘণ্ট ও পঞ্জিকা' : 'Sacred Almanac & Timings',
      desc: isBn
        ? 'মহাষ্টমীর সন্ধিপূজা, পুষ্পাঞ্জলি ও তিথির সঠিক সময়সূচি।'
        : 'Accurate Ashtami Sandhi Puja, Pushpanjali, and tithi timings.',
      image: getAssetPath('/images/pandals/bagbazar-sarbojanin.webp'),
      href: '/calendar',
      badge: isBn ? 'পঞ্জিকা' : 'Almanac',
    },
    {
      title: isBn ? 'সন্ধ্যায় পুজো পরিক্রমা' : 'Pujo Evenings & Routes',
      desc: isBn
        ? 'আলোকসজ্জা ও রাতের মণ্ডপ দর্শন সহজে পরিকল্পনা করুন।'
        : 'Plan your route for the best evening hopping and illumination.',
      image: getAssetPath('/images/pandals/college-square.webp'),
      href: '/planner',
      badge: isBn ? 'পরিক্রমা' : 'Routes',
    },
  ];

  const kaliHighlights = [
    {
      title: isBn ? 'বারাসাত কালীপূজা পরিক্রমা' : 'Barasat Kali Puja Guide',
      desc: isBn
        ? 'পাইওনিয়ার, নবপল্লী, রেজিমেন্ট, সন্ধানী ও সেরা মণ্ডপের আলোকসজ্জা।'
        : 'Pioneer Park, Nabapally Byam Samity, Regiment, Sandhani & top pandals across Barasat.',
      image: getAssetPath('/images/kali-hero.jpg'),
      href: '/explore?festival=kali',
      badge: isBn ? 'বারাসাত বিশেষ' : 'Barasat Special',
    },
    {
      title: isBn ? 'নিশীথ কাল মহানির্ঘণ্ট ২০২৬' : 'Sacred Midnight Muhurat 2026',
      desc: isBn
        ? 'অমাবস্যা তিথি ও নিশীথ কাল পূজা লগ্ন — নির্ঘণ্ট ও ব্রতকথা।'
        : 'Amavasya Tithi & sacred Nishita Kaal midnight worship window.',
      image: getAssetPath('/images/kali-miniplayer.jpg'),
      href: '/kali-puja',
      badge: isBn ? 'পঞ্জিকা' : 'Almanac',
    },
    {
      title: isBn ? 'ঐতিহাসিক কালীক্ষেত্র ও সতীপীঠ' : 'Revered Shaktipeeths & Shrines',
      desc: isBn
        ? 'কালীঘাট, দক্ষিণেশ্বর, তারাপীঠ ও প্রাচীন জাগ্রত কালীমন্দির দর্শন।'
        : 'Kalighat, Dakshineswar, Tarapith & centuries-old Shakti sanctuaries.',
      image: getAssetPath('/images/pandals/kalighat-temple.webp'),
      href: '/explore?category=Temple',
      badge: isBn ? 'সতীপীঠ ও তীর্থ' : 'Sanctuaries',
    },
  ];

  const highlights = isKali ? kaliHighlights : durgaHighlights;

  return (
    <section className="space-y-3 pt-1">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] tracking-tight flex items-center gap-1.5">
            <span className={isKali ? 'text-amber-500 font-black text-lg' : 'text-[#b42323] font-black text-lg'}>
              {isKali ? '🪔' : '✣'}
            </span>
            <span>{isKali ? (isBn ? 'শ্যামাপূজা ও বারাসাত বিশেষ আকর্ষণ' : 'Kali Puja & Barasat Highlights') : (isBn ? 'পূজার বিশেষ আকর্ষণ' : 'Puja Highlights')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#776d65] dark:text-[#a89e95] mt-0.5 font-medium">
            {isKali
              ? (isBn ? 'বারাসাত আলোকসজ্জা, পবিত্র সতীপীঠ ও শ্যামাসঙ্গীত' : 'Barasat illumination, sacred Shaktipeeths & Shyama Sangeet')
              : (isBn ? 'বাংলার দুর্গাপূজা সংস্কৃতির একটি ঝলক' : "A glimpse of Bengal's Durga Puja culture")}
          </p>
        </div>

        <Link
          href={isKali ? '/explore?festival=kali' : '/explore'}
          className={
            isKali
              ? 'inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors'
              : 'inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#b42323] hover:text-[#971c1c] transition-colors'
          }
        >
          <span>{isBn ? 'সব দেখুন' : 'Explore all'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {highlights.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#eee8e1]/95 dark:border-[#2f2720]/95 bg-white/90 dark:bg-[#1a1613]/90 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-[#b42323]/50 hover:shadow-lg active:scale-95"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#f0eae1] dark:bg-[#251f1a]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm border border-white/20">
                  {item.badge}
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc] group-hover:text-pujo-red dark:group-hover:text-[#ff8787] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[#776d65] dark:text-[#a89e95] leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
