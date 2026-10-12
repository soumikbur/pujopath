'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Music2, ExternalLink, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { MUSIC_TRACKS_DATA } from '@/data/music';
import { toBengaliDigits } from '@/lib/geo';
import { cn, getAssetPath } from '@/lib/utils';

export default function MusicPage() {
  const { currentTrack, isPlaying, isLoading, playbackError, playTrack, togglePlay, clearError } =
    useAudio();
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const str = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return isBn ? toBengaliDigits(str) : str;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Music2 className="w-4 h-4" />
          <span>{isBn ? 'শারদীয়া সুর ও ঢাক' : 'Sharodiya Soundscape'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'শারদীয়া সঙ্গীত, চণ্ডীপাঠ ও ঢাকের বোল' : 'Festive Puja Music & Chandi Path'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1">
          {isBn
            ? 'খাঁটি শারদীয়া ঢাকের বোল, মঙ্গল শঙ্খধ্বনি, শাস্ত্রীয় আগমনী বাঁশি এবং মহালয়ার ঐতিহাসিক চণ্ডীপাঠ।'
            : 'Authentic recorded Durga Puja soundscapes — traditional Dhaak beats, sacred conch calls, classical flute, and verified Mahalaya archives.'}
        </p>
      </div>

      {/* Playback Error Alert if any */}
      {playbackError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{playbackError}</span>
          </div>
          <button
            onClick={clearError}
            className="font-bold underline text-xs cursor-pointer ml-2"
          >
            {isBn ? 'বাতিল' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Featured Showcase / Now Playing */}
      {currentTrack && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-card border border-[#eee8e1] dark:border-[#2f2720] shrink-0 bg-white dark:bg-[#14110e]">
            <Image
              src={getAssetPath('/images/mahalaya-thumb.jpg')}
              alt={currentTrack.title}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>

          <div className="space-y-3.5 flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b42323]">
                {isBn ? 'বর্তমানে বাজছে' : 'Now Playing'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{currentTrack.licenseType}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#242424] dark:text-[#ede5dc] leading-tight truncate">
              {isBn ? currentTrack.titleBn || currentTrack.title : currentTrack.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95]">
              {isBn ? currentTrack.artistBn || currentTrack.artist : currentTrack.artist} •{' '}
              <span className="font-semibold">{currentTrack.category}</span>
            </p>
            <p className="text-xs text-[#776d65] dark:text-[#998e84] line-clamp-2">
              {isBn ? currentTrack.descriptionBn : currentTrack.description}
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {currentTrack.playbackMethod === 'external_listen_link' ? (
                <a
                  href={currentTrack.externalListenUrl || currentTrack.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isBn ? 'অফিসিয়াল স্ট্রিমে শুনুন' : 'Listen on Official Stream'}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                  <span>
                    {isLoading
                      ? (isBn ? 'লোড হচ্ছে...' : 'Buffering...')
                      : isPlaying
                      ? (isBn ? 'থামান' : 'Pause Audio')
                      : (isBn ? 'গান শুনুন' : 'Play Soundscape')}
                  </span>
                </button>
              )}

              {currentTrack.sourceUrl && (
                <a
                  href={currentTrack.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs font-semibold text-[#665a54] dark:text-[#a89e95] hover:text-[#b42323] transition-colors"
                >
                  <span>{isBn ? 'লাইসেন্স ও সোর্স' : 'Source & License'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tracks Grid */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] pt-2">
          {isBn ? 'শারদীয়া গানের সম্ভার (যাচাইকৃত লাইসেন্স)' : 'Curated Sound Library (Verified Sources)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {MUSIC_TRACKS_DATA.map((track) => {
            const isSelected = currentTrack?.id === track.id;
            const tTitle = isBn ? track.titleBn || track.title : track.title;
            const tArtist = isBn ? track.artistBn || track.artist : track.artist;

            return (
              <div
                key={track.id}
                onClick={() => (isSelected ? togglePlay() : playTrack(track))}
                className={cn(
                  'p-4 sm:p-5 rounded-2xl border flex flex-col justify-between gap-3 cursor-pointer transition-all duration-150 shadow-sm',
                  isSelected
                    ? 'bg-[#fdeeee] dark:bg-[#341b18] border-[#f6ceca] dark:border-[#4a2420] text-[#d52f2f]'
                    : 'bg-white dark:bg-[#1a1613] border-[#eee8e1] dark:border-[#2f2720] hover:bg-[#fcfaf7] dark:hover:bg-[#221c17] text-[#4a423d] dark:text-[#c4b9ae]'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm mt-0.5',
                        isSelected
                          ? 'bg-[#b42323] text-white border-[#b42323]'
                          : 'bg-[#fcfaf7] dark:bg-[#201c18] text-[#b42323] border-[#eee8e1] dark:border-[#2f2720]'
                      )}
                    >
                      {isSelected && isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isSelected && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : track.playbackMethod === 'external_listen_link' ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold truncate text-[#242424] dark:text-[#ede5dc]">
                        {tTitle}
                      </h4>
                      <p className="text-xs text-[#776d65] dark:text-[#a89e95] truncate mt-0.5">
                        {tArtist}
                      </p>
                      <p className="text-[11px] text-[#8d8278] dark:text-[#7d736a] line-clamp-1 mt-1">
                        {isBn ? track.descriptionBn : track.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-sans text-[#b42323] font-bold shrink-0">
                    {formatSeconds(track.durationSeconds)}
                  </span>
                </div>

                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-[10px] text-[#776d65] dark:text-[#a89e95]">
                  <span className="truncate">{track.licenseType}</span>
                  <a
                    href={track.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-[#b42323] underline shrink-0 font-medium"
                  >
                    {isBn ? 'সোর্স' : 'Source'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
