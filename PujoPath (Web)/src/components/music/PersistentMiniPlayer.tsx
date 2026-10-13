'use client';

import React from 'react';
import { Play, Pause, SkipForward, Maximize2, Music2 } from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

export function PersistentMiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    setIsFullScreenOpen,
    currentTime,
    duration,
  } = useAudio();
  const { locale } = useI18n();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const title = locale === 'bn' ? currentTrack.titleBn : currentTrack.title;
  const artist = locale === 'bn' ? currentTrack.artistBn : currentTrack.artist;

  return (
    <div className="fixed bottom-16 lg:bottom-4 inset-x-3 sm:inset-x-6 lg:left-auto lg:right-6 lg:w-96 z-30 animate-in slide-in-from-bottom duration-300">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-white p-3 flex items-center justify-between gap-3">
        {/* Progress Bar Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-sindoor-600 to-gold-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Track Info */}
        <div
          onClick={() => setIsFullScreenOpen(true)}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sindoor-600 to-gold-600 flex items-center justify-center shrink-0 shadow-md">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-white rounded-full animate-equalizer" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 bg-white rounded-full animate-equalizer" style={{ animationDelay: '0.3s' }} />
                <span className="w-1 bg-white rounded-full animate-equalizer" style={{ animationDelay: '0.2s' }} />
              </div>
            ) : (
              <Music2 className="w-5 h-5 text-white" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold truncate group-hover:text-gold-300 transition-colors">
              {title}
            </h4>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="p-2 rounded-xl bg-sindoor-600 hover:bg-sindoor-500 text-white shadow-md transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            aria-label="Next Track"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullScreenOpen(true)}
            aria-label="Expand Player"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
