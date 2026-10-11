'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Train,
  Clock,
  Navigation,
  Check,
  ChevronLeft,
  Heart,
} from 'lucide-react';
import { Pandal } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { formatDistance } from '@/lib/geo';
import { cn, getAssetPath } from '@/lib/utils';

interface PandalDetailClientProps {
  pandal: Pandal;
}

export function PandalDetailClient({ pandal }: PandalDetailClientProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { isPandalInRoute, addPandalToRoute, removePandalFromRoute, isPandalSaved, toggleSavePandal } = useFavorites();

  const [imgSrc, setImgSrc] = useState(() => getAssetPath(pandal.imageUrl || '/images/pandals/pandal-fallback.webp'));

  React.useEffect(() => {
    setImgSrc(getAssetPath(pandal.imageUrl || '/images/pandals/pandal-fallback.webp'));
  }, [pandal.imageUrl]);

  const inRoute = isPandalInRoute(pandal.id);
  const isSaved = isPandalSaved(pandal.id);

  const displayName = isBn ? pandal.nameBn : pandal.name;
  const displayTheme = isBn ? pandal.themeBn : pandal.theme;
  const displayDesc = isBn ? pandal.descriptionBn : pandal.description;
  const displayHistory = isBn ? pandal.historyBn : pandal.history;
  const displayAddress = isBn ? pandal.addressBn : pandal.address;
  const primaryMetro = pandal.metroLinks?.[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Link & Save */}
      <div className="flex items-center justify-between">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#625b55] dark:text-[#a89e95] hover:text-[#b42323] transition-colors active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{isBn ? 'প্যান্ডেল তালিকায় ফিরুন' : 'Back to Explore'}</span>
        </Link>

        <button
          onClick={() => toggleSavePandal(pandal.id)}
          className={cn(
            'px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xs',
            isSaved
              ? 'bg-[#b42323] text-white border-[#b42323]'
              : 'bg-white dark:bg-[#1a1613] text-[#625b55] dark:text-[#a89e95] border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323] hover:text-[#b42323]'
          )}
        >
          <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
          <span>{isSaved ? (isBn ? 'সংরক্ষিত' : 'Saved') : (isBn ? 'সংরক্ষণ করুন' : 'Save')}</span>
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-[#eee8e1] dark:border-[#2f2720] shadow-sm">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <Image
            src={imgSrc}
            alt={displayName}
            fill
            priority
            onError={() => setImgSrc(getAssetPath('/images/pandals/pandal-fallback.webp'))}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-[#242424] border border-white/60 shadow-xs">
              {pandal.zone}
            </span>
            {pandal.isHeritage && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                {isBn ? 'ঐতিহ্যবাহী সাবেকি' : 'Heritage Sabeki'}
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-1.5 text-white">
            <h1 className="text-2xl sm:text-4xl font-black drop-shadow-md">
              {displayName}
            </h1>
            <p className="text-sm sm:text-base text-white/90 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#b42323] shrink-0" />
              <span>{displayAddress}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 sm:p-7 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#b42323]">
                {isBn ? 'মণ্ডপ ও প্রতিমার শিল্প ভাবনা' : 'Theme & Art Concept'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-1">
                {displayTheme}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed">
              {displayDesc}
            </p>

            {displayHistory && (
              <div className="pt-4 border-t border-[#eee8e1] dark:border-[#2f2720] space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b42323]">
                  {isBn ? 'ইতিহাস ও ঐতিহ্য' : 'Heritage & History'}
                </h3>
                <p className="text-sm text-[#776d65] dark:text-[#a89e95] leading-relaxed">
                  {displayHistory}
                </p>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="p-6 sm:p-7 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-3.5">
            <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'প্রধান আকর্ষণসমূহ' : 'Key Highlights'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#4a423d] dark:text-[#c4b9ae]">
              {(isBn ? pandal.highlightsBn : pandal.highlights)?.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#b42323] shrink-0" />
                  <span className="font-semibold">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-xs space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'দর্শনার্থীদের প্রবেশের সময়' : 'Viewing Timings'}
              </span>
              <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc] mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#b42323]" />
                <span>{pandal.openingTime} – {pandal.closingTime}</span>
              </div>
            </div>

            {primaryMetro && (
              <div className="pt-3 border-t border-[#eee8e1] dark:border-[#2f2720]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                  {isBn ? 'নিকটতম মেট্রো স্টেশন' : 'Nearest Metro'}
                </span>
                <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc] mt-1 flex items-center gap-2">
                  <Train className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{isBn ? primaryMetro.stationNameBn : primaryMetro.stationName} ({formatDistance(primaryMetro.walkingDistanceMeters / 1000, locale)})</span>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#eee8e1] dark:border-[#2f2720] flex flex-col gap-2.5">
              <button
                onClick={() => (inRoute ? removePandalFromRoute(pandal.id) : addPandalToRoute(pandal))}
                className={cn(
                  'w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-xs active:scale-95',
                  inRoute
                    ? 'bg-[#b42323] text-white hover:bg-[#971c1c]'
                    : 'bg-[#fcfaf7] dark:bg-[#14110e] border border-[#eee8e1] dark:border-[#2f2720] text-[#242424] dark:text-[#ede5dc] hover:border-[#b42323]'
                )}
              >
                {inRoute ? <Check className="w-4 h-4" /> : <Navigation className="w-4 h-4 text-[#b42323]" />}
                <span>{inRoute ? (isBn ? 'রুটে যোগ করা আছে' : 'Added to Route') : (isBn ? 'রুটে যোগ করুন' : 'Add to Route')}</span>
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-center font-bold text-[#242424] dark:text-[#ede5dc] hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] flex items-center justify-center gap-2 text-sm transition-all active:scale-95 shadow-xs"
              >
                <MapPin className="w-4 h-4 text-[#b42323]" />
                <span>{isBn ? 'গুগল ম্যাপে দিকনির্দেশ' : 'Get Directions'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
