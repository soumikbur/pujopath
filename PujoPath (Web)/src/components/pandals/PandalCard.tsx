'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Train, Star, Navigation, Check, Heart, Camera, CameraOff, Landmark } from 'lucide-react';
import { Pandal } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { toBengaliDigits, formatDistance } from '@/lib/geo';
import { cn, getAssetPath } from '@/lib/utils';

interface PandalCardProps {
  pandal: Pandal;
  variant?: 'grid' | 'horizontal' | 'compact';
}

export const PandalCard = React.memo(function PandalCard({ pandal, variant = 'grid' }: PandalCardProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { isPandalInRoute, addPandalToRoute, removePandalFromRoute, isPandalSaved, toggleSavePandal } = useFavorites();

  const [imgError, setImgError] = useState(false);
  const hasPhotoUrl = Boolean(pandal.imageUrl && pandal.imageUrl.trim() !== '');
  const hasVerifiedPhoto = Boolean(pandal.hasVerifiedPhoto && hasPhotoUrl && !imgError);

  const imgSrc = hasPhotoUrl ? getAssetPath(pandal.imageUrl) : '';

  React.useEffect(() => {
    setImgError(false);
  }, [pandal.imageUrl]);

  const inRoute = isPandalInRoute(pandal.id);
  const isSaved = isPandalSaved(pandal.id);
  const primaryMetro = pandal.metroLinks?.[0];

  const displayName = isBn ? pandal.nameBn : pandal.name;
  const displayLocality = isBn ? pandal.localityBn : pandal.locality;
  const displayMetroName = isBn ? (primaryMetro?.stationNameBn || primaryMetro?.stationName) : primaryMetro?.stationName;

  const displayRating = typeof pandal.rating === 'number' && pandal.rating > 0
    ? (isBn ? toBengaliDigits(pandal.rating.toFixed(1)) : pandal.rating.toFixed(1))
    : null;

  const handleRouteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inRoute) {
      removePandalFromRoute(pandal.id);
    } else {
      addPandalToRoute(pandal);
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavePandal(pandal.id);
  };

  if (variant === 'compact') {
    return (
      <Link
        href={`/pandals/${pandal.slug}`}
        className="group flex items-center gap-3 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] p-3 transition-all hover:bg-[#fcfaf7] dark:hover:bg-[#251e18] shadow-xs active:scale-98"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f5efe8] dark:bg-[#241d17] border border-[#e8ded2] dark:border-[#382d23] flex items-center justify-center">
          {hasVerifiedPhoto ? (
            <Image
              src={imgSrc}
              alt={displayName}
              fill
              onError={() => setImgError(true)}
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <CameraOff className="w-5 h-5 text-[#8c8075] dark:text-[#a09488]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc] truncate">{displayName}</h4>
          <p className="text-xs text-[#776d65] dark:text-[#a89e95] truncate">{displayLocality} • {pandal.zone}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] transition-all duration-200 md:hover:-translate-y-1 hover:shadow-lg hover:border-[#b42323]/40 shadow-xs">
      <div className="relative">
        {/* Pandal Thumbnail Header (16:9 ratio, object-fit cover or honest neutral unavailable placeholder) */}
        <Link href={`/pandals/${pandal.slug}`} className="block relative aspect-video w-full overflow-hidden">
          {hasVerifiedPhoto ? (
            <>
              <Image
                src={imgSrc}
                alt={displayName}
                fill
                onError={() => setImgError(true)}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Verified 2025 Photo Badge */}
              <div className="absolute left-3 bottom-10 z-10">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-800/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md shadow-xs flex items-center gap-1">
                  <Camera className="w-2.5 h-2.5" />
                  {isBn ? '২০২৫ ছবি' : '2025 Photo'}
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-[#f7f2eb] dark:bg-[#201a14] border-b border-[#eee8e1] dark:border-[#2f2720] flex flex-col items-center justify-center p-4 text-center">
              <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none flex items-center justify-center">
                <Landmark className="w-44 h-44" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-[#e8ded2] dark:bg-[#2d241c] text-[#7d7165] dark:text-[#a5998d] flex items-center justify-center mb-0.5">
                  <CameraOff className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#63574c] dark:text-[#b3a699]">
                  {isBn ? '২০২৫ ছবি অপ্রাপ্য' : '2025 Photo Unavailable'}
                </span>
                <span className="text-[10px] text-[#85796f] dark:text-[#8f8275] max-w-[90%] truncate">
                  {isBn ? 'যাচাইকৃত তালিকা • গবেষণা চলছে' : 'Verified Listing • Research Ongoing'}
                </span>
              </div>
            </div>
          )}

          {/* Top Left Badges */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 flex-wrap max-w-[80%] z-20">
            <span className="rounded-full border border-white/60 dark:border-black/40 bg-white/95 dark:bg-[#1a1613]/90 px-2.5 py-1 text-xs font-bold text-[#242424] dark:text-[#ede5dc] backdrop-blur-md shadow-xs">
              {pandal.zone}
            </span>
            {Boolean(pandal.isBonediBari || pandal.category === 'Bonedi Bari') && (
              <span className="rounded-full bg-[#800020] text-amber-200 border border-amber-300/40 px-2.5 py-1 text-xs font-black shadow-xs">
                {isBn ? 'বনেদি বাড়ি' : 'Bonedi Bari'}
              </span>
            )}
            {pandal.isHeritage && !pandal.isBonediBari && (
              <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                {isBn ? 'সাবেকি' : 'Heritage'}
              </span>
            )}
          </div>

          {/* Bottom Title on Header */}
          <div className="absolute bottom-2.5 left-3.5 right-3.5 z-20">
            <h3 className={cn(
              'text-base sm:text-lg font-black truncate',
              hasVerifiedPhoto ? 'text-white drop-shadow-md' : 'text-[#242424] dark:text-[#ede5dc]'
            )}>
              {displayName}
            </h3>
          </div>
        </Link>

        {/* Favorite Heart Button */}
        <button
          onClick={handleSaveToggle}
          className={cn(
            'absolute right-3 top-3 z-30 rounded-xl p-2 backdrop-blur-md transition-all active:scale-90 shadow-xs',
            isSaved
              ? 'bg-[#b42323] text-white'
              : 'bg-white/90 dark:bg-black/60 text-[#625b55] dark:text-gray-300 hover:text-[#b42323]'
          )}
          title={isBn ? 'প্যান্ডেল সংরক্ষণ করুন' : 'Save Pandal'}
          aria-label={isSaved ? 'Remove from saved' : 'Save pandal'}
        >
          <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
        </button>

        {/* Info Content with Typography */}
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between text-sm text-[#4a423d] dark:text-[#c4b9ae]">
            <div className="flex items-center gap-1.5 truncate font-medium">
              <MapPin className="w-4 h-4 text-[#b42323] shrink-0" />
              <span className="truncate">{displayLocality}</span>
            </div>

            {displayRating ? (
              <div className="flex items-center gap-1 text-amber-500 font-bold font-sans text-sm sm:text-base shrink-0">
                <Star className="w-4 h-4 fill-current" />
                <span>{displayRating}</span>
              </div>
            ) : (
              (pandal.coordinateConfidence === 'Needs verification' || pandal.hasUnresolvedCoordinates) && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 shrink-0">
                  {isBn ? 'যাচাই প্রয়োজন' : 'Unverified'}
                </span>
              )
            )}
          </div>

          {primaryMetro && (
            <div className="flex items-center gap-1.5 text-[#776d65] dark:text-[#a89e95] text-xs sm:text-[13px] font-medium">
              <Train className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="truncate">
                {displayMetroName} {isBn ? 'মেট্রো' : 'Metro'} ({formatDistance(primaryMetro.walkingDistanceMeters / 1000, locale)})
              </span>
            </div>
          )}

          {pandal.bonediBariInfo && (
            <div className="pt-1 flex items-center justify-between gap-1 text-[11px]">
              <span className="font-semibold text-amber-900 dark:text-amber-200 truncate">
                {isBn ? (pandal.bonediBariInfo.ancestralHouseNameBn || pandal.bonediBariInfo.ancestralHouseName) : pandal.bonediBariInfo.ancestralHouseName}
              </span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0',
                  pandal.bonediBariInfo.visitorAccessStatus === 'Visitor access confirmed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                )}
              >
                {isBn ? pandal.bonediBariInfo.visitorAccessStatusBn : pandal.bonediBariInfo.visitorAccessStatus}
              </span>
            </div>
          )}
        </div>
      </div>


      {/* Footer Actions Aligned at Bottom */}
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#eee8e1] dark:border-[#2f2720] p-4 pt-3">
        <Link
          href={`/pandals/${pandal.slug}`}
          className="text-sm font-bold text-[#b42323] hover:text-[#971c1c] transition-colors"
        >
          {isBn ? 'বিস্তারিত দেখুন →' : 'View Details →'}
        </Link>

        <button
          onClick={handleRouteToggle}
          className={cn(
            'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs',
            inRoute
              ? 'bg-[#b42323] text-white border-[#b42323]'
              : 'bg-white dark:bg-[#1a1613] text-[#625b55] dark:text-[#a89e95] border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323] hover:text-[#b42323]'
          )}
        >
          {inRoute ? <Check className="w-4 h-4" /> : <Navigation className="w-4 h-4 text-[#b42323]" />}
          <span>{inRoute ? (isBn ? 'যোগ হয়েছে' : 'Added') : (isBn ? 'রুট যোগ' : 'Add Route')}</span>
        </button>
      </div>
    </div>
  );
});
