'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Music2 } from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { MUSIC_TRACKS_DATA } from '@/data/music';
import { toBengaliDigits } from '@/lib/geo';
import { cn, getAssetPath } from '@/lib/utils';

export default function MusicPage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
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
        <div className="flex items-center gap-2 text-pujo-red text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Music2 className="w-4 h-4" />
          <span>{isBn ? 'শারদীয়া সুর ও ঢাক' : 'Sharodiya Soundscape'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-pujo-text-primary mt-1 tracking-tight">
          {isBn ? 'শারদীয়া সঙ্গীত, চণ্ডীপাঠ ও ঢাকের বোল' : 'Festive Puja Music & Chandi Path'}
        </h1>
        <p className="text-sm sm:text-base text-pujo-text-muted mt-1">
          {isBn
            ? 'বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ, খাঁটি ঢাকের গমগমে তাল এবং মনমাতানো আগমনী গানের সুরতরঙ্গ।'
            : 'Sacred Mahishasura Mardini, traditional Dhak beats, and festive Agomoni tracks with real-time procedural audio synthesis.'}
        </p>
      </div>

      {/* Featured Showcase */}
      {currentTrack && (
        <div className="p-6 sm:p-8 rounded-3xl bg-pujo-bg-hero border border-pujo-border shadow-card flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-card border border-pujo-border shrink-0 bg-white">
            <Image
              src={getAssetPath('/images/mahalaya-thumb.jpg')}
              alt={currentTrack.title}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>

          <div className="space-y-3.5 flex-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-pujo-red">
              {isBn ? 'বর্তমানে বাজছে' : 'Now Playing'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-pujo-text-primary leading-tight">
              {isBn ? currentTrack.titleBn || currentTrack.title : currentTrack.title}
            </h2>
            <p className="text-sm sm:text-base text-pujo-text-secondary font-medium">
              {isBn ? currentTrack.artistBn || currentTrack.artist : currentTrack.artist} • {isBn ? 'শারদীয়া বিশেষ' : currentTrack.category}
            </p>

            <button
              onClick={togglePlay}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-pujo-red hover:bg-pujo-red-hover text-white font-bold text-sm shadow-subtle transition-all active:scale-95 mt-2"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              <span>{isPlaying ? (isBn ? 'গান থামান' : 'Pause Audio') : (isBn ? 'গান শুনুন' : 'Play Soundscape')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tracks Grid */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-pujo-text-primary pt-2">
          {isBn ? 'শারদীয়া গানের সম্ভার' : 'Curated Sound Library'}
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
                  'p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all duration-150 shadow-sm',
                  isSelected
                    ? 'bg-pujo-red-soft border-pujo-red-border text-pujo-red'
                    : 'bg-white border-pujo-border hover:bg-pujo-bg-surface text-pujo-text-secondary'
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm',
                      isSelected
                        ? 'bg-pujo-red text-white border-pujo-red'
                        : 'bg-pujo-bg-surface text-pujo-red border-pujo-border'
                    )}
                  >
                    {isSelected && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold truncate text-pujo-text-primary">
                      {tTitle}
                    </h4>
                    <p className="text-xs text-pujo-text-muted truncate mt-0.5">{tArtist}</p>
                  </div>
                </div>

                <span className="text-sm font-sans text-pujo-red font-bold shrink-0">
                  {formatSeconds(track.durationSeconds)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
