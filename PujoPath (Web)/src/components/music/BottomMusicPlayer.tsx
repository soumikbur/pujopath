'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ListMusic,
  X,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { toBengaliDigits } from '@/lib/geo';
import { cn, getAssetPath } from '@/lib/utils';

export function BottomMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    playbackType,
    playbackError,
    currentTime,
    duration,
    volume,
    isMuted,
    toggleMute,
    setVolume,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    queue,
    playTrack,
    isPlayerDismissed,
    closePlayer,
    clearError,
  } = useAudio();

  const { locale } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isBn = locale === 'bn';

  const [playlistDrawerOpen, setPlaylistDrawerOpen] = useState(false);

  // Keep the interface quiet until the visitor chooses to play something, or if explicitly closed
  if (isPlayerDismissed || !currentTrack || (!isPlaying && currentTime === 0 && !playbackError)) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const str = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return isBn ? toBengaliDigits(str) : str;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const displayTitle = isBn
    ? currentTrack.titleBn || currentTrack.title
    : currentTrack.title;
  const displaySubtitle = isBn
    ? currentTrack.artistBn || currentTrack.artist || 'শারদীয়া সুর ও চণ্ডীপাঠ'
    : currentTrack.artist || 'Traditional Soundscape';

  return (
    <>
      {/* ── Compact Floating Frosted Glass Audio Player ── */}
      <aside
        aria-label="Media Player"
        className="fixed z-[1150] pointer-events-auto
                   bottom-[calc(76px+env(safe-area-inset-bottom,0px))] md:bottom-6
                   transition-all duration-300 animate-in fade-in"
        style={{
          boxSizing: 'border-box',
          left: 'max(12px, env(safe-area-inset-left, 0px))',
          right: 'max(12px, env(safe-area-inset-right, 0px))',
          width: 'auto',
          maxWidth: '640px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* Playback Error Alert Banner */}
        {playbackError && (
          <div className="mb-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{playbackError}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  clearError();
                  togglePlay();
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-800 font-bold hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isBn ? 'পুনরায় চেষ্টা' : 'Retry'}</span>
              </button>
              <button
                type="button"
                onClick={clearError}
                aria-label="Dismiss error"
                className="p-1 hover:opacity-70 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Compact audio control bar: strictly between 68px and 84px height */}
        <div
          className="relative overflow-hidden flex items-center transition-colors duration-300 shadow-xl"
          style={{
            height: '72px',
            borderRadius: '22px',
            background: isDark ? 'rgba(26, 22, 19, 0.92)' : 'rgba(255, 250, 244, 0.90)',
            backdropFilter: 'blur(24px) saturate(130%)',
            WebkitBackdropFilter: 'blur(24px) saturate(130%)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.70)',
            boxShadow: isDark
              ? '0 10px 32px rgba(0, 0, 0, 0.50), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 10px 32px rgba(80, 50, 30, 0.14), inset 0 1px 0 rgba(255,255,255,0.70)',
          }}
        >
          {/* Top-edge integrated progress bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-black/10 dark:bg-white/10 z-20">
            <div
              className="h-full transition-all duration-150 rounded-r-full"
              style={{ width: `${progressPercent}%`, background: '#D52F2F' }}
            />
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Seek track position"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Glass top highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 'inherit',
              background: isDark
                ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 50%)',
            }}
          />

          {/* ── Desktop & Tablet layout (sm+) ── */}
          <div className="hidden sm:flex items-center w-full h-full px-4 gap-3.5 relative z-10">
            {/* 1. Album Artwork — 44×44 */}
            <div
              className="relative shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 44,
                height: 44,
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.50)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Image
                src={getAssetPath(currentTrack.id === 'track-mahalaya-original' ? '/images/mahalaya-thumb.jpg' : currentTrack.coverUrl || '/images/mahalaya-thumb.jpg')}
                alt={displayTitle}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>

            {/* 2. Track Info */}
            <div className="min-w-0" style={{ width: 180, flexShrink: 0 }}>
              <h4
                className="truncate leading-tight font-bold text-xs"
                style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              >
                {displayTitle}
              </h4>
              <p
                className="truncate mt-0.5 text-[10px] font-medium"
                style={{ color: isDark ? 'rgba(237,229,220,0.60)' : 'rgba(41,37,37,0.58)' }}
              >
                {displaySubtitle}
              </p>
            </div>

            {/* 3. Playback Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={prevTrack}
                aria-label="Previous track"
                className="p-1.5 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Red circular play button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex items-center justify-center transition-transform duration-150 active:scale-95 hover:scale-105 cursor-pointer"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#D52F2F',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(213,47,47,0.30)',
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                aria-label="Next track"
                className="p-1.5 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* 4. Progress section — fills remaining space */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className="shrink-0 font-mono tabular-nums text-[10px]"
                style={{ color: isDark ? 'rgba(237,229,220,0.55)' : 'rgba(41,37,37,0.52)' }}
              >
                {formatSeconds(currentTime)}
              </span>

              <div
                className="relative flex-1 cursor-pointer group"
                style={{ height: 4, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}
              >
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  aria-label="Seek track position"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
                  style={{ width: `${progressPercent}%`, background: '#D52F2F' }}
                />
                {/* Scrub handle on hover */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: `${progressPercent}%`,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#D52F2F',
                    boxShadow: '0 0 6px rgba(213,47,47,0.4)',
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                  }}
                />
              </div>

              <span
                className="shrink-0 font-mono tabular-nums text-[10px]"
                style={{ color: isDark ? 'rgba(237,229,220,0.55)' : 'rgba(41,37,37,0.52)' }}
              >
                {formatSeconds(duration || 100)}
              </span>
            </div>

            {/* 5. Volume Control Slider & Mute Toggle */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-1 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volume level"
                className="w-14 h-1 bg-black/15 dark:bg-white/15 rounded-full appearance-none cursor-pointer accent-[#D52F2F]"
              />
            </div>

            {/* 6. Queue button */}
            <button
              type="button"
              onClick={() => setPlaylistDrawerOpen(!playlistDrawerOpen)}
              className="p-1.5 shrink-0 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
              style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              aria-label="Sharodiya Playlist"
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {/* 7. Close button */}
            <button
              type="button"
              onClick={closePlayer}
              className="p-1.5 shrink-0 transition-opacity hover:opacity-70 active:scale-95 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              aria-label="Close music player"
              title="Close music player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Ultra-Compact Mobile Layout (< 640px) ── */}
          <div className="flex sm:hidden items-center w-full h-full px-3 gap-2.5 relative z-10">
            {/* 1. Thumbnail — 44×44 */}
            <div
              className="relative shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 44,
                height: 44,
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.45)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
              }}
            >
              <Image
                src={getAssetPath(currentTrack.id === 'track-mahalaya-original' ? '/images/mahalaya-thumb.jpg' : currentTrack.coverUrl || '/images/mahalaya-thumb.jpg')}
                alt={displayTitle}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>

            {/* 2. Track Title, Artist & Time */}
            <div className="flex-1 min-w-0 pr-1">
              <h4
                className="truncate font-bold text-xs leading-tight"
                style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              >
                {displayTitle}
              </h4>
              <p
                className="truncate text-[10px] font-medium mt-0.5"
                style={{ color: isDark ? 'rgba(237,229,220,0.60)' : 'rgba(41,37,37,0.58)' }}
              >
                {displaySubtitle}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="font-mono tabular-nums text-[9px]"
                  style={{ color: isDark ? 'rgba(237,229,220,0.50)' : 'rgba(41,37,37,0.48)' }}
                >
                  {formatSeconds(currentTime)} / {formatSeconds(duration || 100)}
                </span>
              </div>
            </div>

            {/* 3. Mobile Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Play / Pause button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#D52F2F',
                  color: '#fff',
                  boxShadow: '0 3px 10px rgba(213,47,47,0.30)',
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Playlist drawer toggle button */}
              <button
                type="button"
                onClick={() => setPlaylistDrawerOpen(!playlistDrawerOpen)}
                className="p-1.5 shrink-0 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : 'rgba(41,37,37,0.60)' }}
                aria-label="Sharodiya Playlist"
              >
                <ListMusic className="w-4 h-4" />
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={closePlayer}
                className="p-1.5 shrink-0 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : 'rgba(41,37,37,0.60)' }}
                aria-label="Close music player"
                title="Close music player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Playlist Drawer Modal ── */}
      {playlistDrawerOpen && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md p-4 space-y-3 rounded-3xl border border-[#eadcce] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b pb-2.5 border-[#eadcce] dark:border-[#2f2720]">
              <h3 className="font-bold text-sm flex items-center gap-2 text-[#242424] dark:text-[#ede5dc]">
                <ListMusic className="w-4 h-4 text-[#D52F2F]" />
                <span>{isBn ? 'শারদীয়া গানের তালিকা' : 'Sharodiya Playlist'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setPlaylistDrawerOpen(false)}
                className="p-1 rounded-lg text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white cursor-pointer"
                aria-label="Close playlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {queue.map((track) => {
                const isSelected = track.id === currentTrack.id;
                const tTitle = isBn ? track.titleBn || track.title : track.title;
                const tArtist = isBn ? track.artistBn || track.artist : track.artist;

                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      playTrack(track);
                      setPlaylistDrawerOpen(false);
                    }}
                    className={cn(
                      'p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-98',
                      isSelected
                        ? 'bg-[#fdeeee] dark:bg-[#341b18] border border-[#f6ceca] dark:border-[#4a2420] text-[#d52f2f] font-bold'
                        : 'bg-[#f8f0e8] dark:bg-[#201c18] border border-[#eadcce] dark:border-[#2a241f] text-[#4a423d] dark:text-[#c4b9ae] hover:border-[#d52f2f]/40'
                    )}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate">{tTitle}</h4>
                      <p className="text-[10px] truncate text-[#665a54] dark:text-[#a89e95]">{tArtist}</p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#d52f2f]">
                      {formatSeconds(track.durationSeconds)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
