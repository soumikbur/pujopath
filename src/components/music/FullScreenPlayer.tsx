'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Music2 } from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { formatTimeMinutes } from '@/lib/utils/date';

export function FullScreenPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    isFullScreenOpen,
    setIsFullScreenOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    playTrack,
  } = useAudio();
  const { locale, t } = useI18n();

  if (!isFullScreenOpen || !currentTrack) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const title = locale === 'bn' ? currentTrack.titleBn : currentTrack.title;
  const artist = locale === 'bn' ? currentTrack.artistBn : currentTrack.artist;
  const desc = locale === 'bn' ? currentTrack.descriptionBn : currentTrack.description;
  const lyrics = locale === 'bn' ? currentTrack.lyricsSnippetBn : currentTrack.lyricsSnippet;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300 overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
            {t('nowPlaying')}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
        </div>

        <button
          onClick={() => setIsFullScreenOpen(false)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-stone-200" />
        </button>
      </div>

      {/* Main Track Artwork & Info */}
      <div className="my-auto max-w-lg mx-auto w-full text-center space-y-6 py-6">
        <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-3xl bg-gradient-to-tr from-sindoor-800 via-sindoor-600 to-gold-500 shadow-2xl flex items-center justify-center border-2 border-white/20">
          <Music2 className="w-24 h-24 text-white opacity-90" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
          <p className="text-sm text-gold-300 font-medium mt-1">{artist}</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-2 leading-relaxed">{desc}</p>
        </div>

        {lyrics && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs italic text-stone-300 max-w-md mx-auto">
            &ldquo;{lyrics}&rdquo;
          </div>
        )}

        {/* Progress Slider */}
        <div className="space-y-1.5 max-w-md mx-auto">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sindoor-500"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prevTrack}
            className="p-3 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="p-5 rounded-full bg-gradient-to-r from-sindoor-600 to-sindoor-500 text-white shadow-xl shadow-sindoor-600/40 hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-3 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto pt-2 text-stone-400">
          <Volume2 className="w-4 h-4" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sindoor-500"
          />
        </div>
      </div>

      {/* Queue Drawer Preview */}
      <div className="max-w-lg mx-auto w-full pt-4 border-t border-white/10">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
          {t('queueLabel')}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {queue.map((track) => (
            <button
              key={track.id}
              onClick={() => playTrack(track)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left shrink-0 w-36 transition-colors"
            >
              <div className="text-xs font-bold truncate">
                {locale === 'bn' ? track.titleBn : track.title}
              </div>
              <div className="text-[10px] text-stone-400 truncate">{track.artist}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
