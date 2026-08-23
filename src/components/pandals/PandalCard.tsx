'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Train, Star, Navigation, Check, Heart } from 'lucide-react';
import { Pandal } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { toBengaliDigits, formatDistance } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

interface PandalCardProps {
  pandal: Pandal;
  variant?: 'grid' | 'horizontal' | 'compact';
}

export function PandalCard({ pandal, variant = 'grid' }: PandalCardProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { isPandalInRoute, addPandalToRoute, removePandalFromRoute, isPandalSaved, toggleSavePandal } = useFavorites();

  const [imgSrc, setImgSrc] = useState(pandal.imageUrl || '/images/pandals/ekchala-traditional.jpg');

  const inRoute = isPandalInRoute(pandal.id);
  const isSaved = isPandalSaved(pandal.id);
  const primaryMetro = pandal.metroLinks[0];

  const displayName = isBn ? pandal.nameBn : pandal.name;
  const displayLocality = isBn ? pandal.localityBn : pandal.locality;
  const displayMetroName = isBn ? (primaryMetro?.stationNameBn || primaryMetro?.stationName) : primaryMetro?.stationName;

  const displayRating = isBn ? toBengaliDigits(pandal.rating.toFixed(1)) : pandal.rating.toFixed(1);

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
        className="flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-pujo-bg-surface border border-pujo-border shadow-card transition-all group"
      >
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={imgSrc}
            alt={displayName}
            fill
            onError={() => setImgSrc('/images/pandals/pandal-fallback.jpg')}
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-pujo-text-primary truncate">{displayName}</h4>
          <p className="text-xs text-pujo-text-muted truncate">{displayLocality}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="group rounded-3xl bg-white hover:bg-pujo-bg-surface border border-pujo-border hover:border-pujo-red-border overflow-hidden shadow-card transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        {/* Pandal Image (16:9 ratio, object-fit cover) */}
        <Link href={`/pandals/${pandal.slug}`} className="block relative aspect-video w-full bg-gray-100 overflow-hidden">
          <Image
            src={imgSrc}
            alt={displayName}
            fill
            onError={() => setImgSrc('/images/pandals/pandal-fallback.jpg')}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-pujo-text-primary border border-white/60 shadow-sm">
              {pandal.zone}
            </span>
            {pandal.isHeritage && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                {isBn ? 'সাবেকি' : 'Heritage'}
              </span>
            )}
          </div>

          <button
            onClick={handleSaveToggle}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all active:scale-95 shadow-sm',
              isSaved
                ? 'bg-pujo-red text-white'
                : 'bg-white/90 text-pujo-text-secondary hover:text-pujo-red'
            )}
            title={isBn ? 'প্যান্ডেল সংরক্ষণ করুন' : 'Save Pandal'}
          >
            <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
          </button>

          {/* Bottom Title in Image */}
          <div className="absolute bottom-3 left-3.5 right-3.5">
            <h3 className="text-base sm:text-lg font-black text-white truncate drop-shadow-md">
              {displayName}
            </h3>
          </div>
        </Link>

        {/* Info Content with 14-16px Typography */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-sm text-pujo-text-secondary">
            <div className="flex items-center gap-1.5 truncate font-medium">
              <MapPin className="w-4 h-4 text-pujo-red shrink-0" />
              <span className="truncate">{displayLocality}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-500 font-bold font-sans text-sm sm:text-base">
              <Star className="w-4 h-4 fill-current" />
              <span>{displayRating}</span>
            </div>
          </div>

          {primaryMetro && (
            <div className="flex items-center gap-1.5 text-pujo-text-muted text-xs sm:text-[13px] font-medium">
              <Train className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="truncate">
                {displayMetroName} {isBn ? 'মেট্রো' : 'Metro'} ({formatDistance(primaryMetro.walkingDistanceMeters / 1000, locale)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions Aligned at Bottom */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-pujo-border/60 mt-2">
        <Link
          href={`/pandals/${pandal.slug}`}
          className="text-sm font-bold text-pujo-red hover:text-pujo-red-hover transition-colors"
        >
          {isBn ? 'বিস্তারিত দেখুন →' : 'View Details →'}
        </Link>

        <button
          onClick={handleRouteToggle}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5',
            inRoute
              ? 'bg-pujo-red text-white border-pujo-red'
              : 'bg-white text-pujo-text-secondary border-pujo-border hover:border-pujo-red hover:text-pujo-red'
          )}
        >
          {inRoute ? <Check className="w-4 h-4" /> : <Navigation className="w-4 h-4 text-pujo-red" />}
          <span>{inRoute ? (isBn ? 'যোগ করা হয়েছে' : 'Added') : (isBn ? 'রুট যোগ করুন' : 'Add Route')}</span>
        </button>
      </div>
    </div>
  );
}
