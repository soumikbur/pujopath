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
  ChevronDown,
  Tv,
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
    isStreamExpanded,
    setIsStreamExpanded,
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
      {/* ── Wide Floating Frosted Glass Media Player Container ── */}
      <aside
        aria-label="Media Player"
        className="fixed z-[1150] left-1/2 -translate-x-1/2 bottom-[calc(68px+env(safe-area-inset-bottom,0px))] sm:bottom-5 pointer-events-auto
                   w-[calc(100%-20px)] md:w-[840px] transition-all duration-300 animate-in slide-in-from-bottom-3"
      >
        {/* Playback Error Alert Banner */}
        {playbackError && (
          <div className="mb-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg backdrop-blur-md">
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

        {/* Authorized In-Page Stream Player Box (Docked right above bottom bar) */}
        {playbackType === 'embed' && isStreamExpanded && currentTrack.embedUrl && (
          <div
            className="mb-2 w-full max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
            style={{
              background: isDark ? 'rgba(26, 22, 19, 0.96)' : 'rgba(255, 250, 244, 0.96)',
              backdropFilter: 'blur(24px)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(213, 47, 47, 0.25)',
            }}
          >
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#D52F2F] animate-pulse" />
                <span className="text-[11px] font-bold text-[#b42323] truncate">
                  {isBn ? 'অনুমোদিত ইন-পেজ প্লেয়ার' : 'Authorized In-Page Player'}
                </span>
                <span className="text-[10px] text-[#776d65] dark:text-[#a89e95] truncate hidden xs:inline">
                  • {displayTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsStreamExpanded(false)}
                className="p-1 rounded-lg text-xs font-semibold text-[#665a54] dark:text-[#a89e95] hover:text-[#b42323] flex items-center gap-1 cursor-pointer transition-colors"
                aria-label="Minimize stream player"
              >
                <span>{isBn ? 'সংক্ষিপ্ত করুন' : 'Minimize'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${currentTrack.embedUrl}?autoplay=1&enablejsapi=1`}
                title={displayTitle}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Glass container bar */}
        <div
          className="relative overflow-hidden flex items-center transition-colors duration-300"
          style={{
            height: '78px',
            borderRadius: '24px',
            background: isDark ? 'rgba(26, 22, 19, 0.88)' : 'rgba(255, 250, 244, 0.82)',
            backdropFilter: 'blur(24px) saturate(130%)',
            WebkitBackdropFilter: 'blur(24px) saturate(130%)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow: isDark
              ? '0 12px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 12px 40px rgba(80, 50, 30, 0.12), inset 0 1px 0 rgba(255,255,255,0.70)',
          }}
        >
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

          {/* ── Desktop layout ── */}
          <div className="hidden sm:flex items-center w-full h-full px-4 gap-3.5 relative z-10">
            {/* 1. Album Artwork — 48×48 */}
            <div
              className="relative shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 48,
                height: 48,
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.50)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Image
                src={getAssetPath(currentTrack.id === 'track-mahalaya-original' ? '/images/mahalaya-thumb.jpg' : currentTrack.coverUrl || '/images/mahalaya-thumb.jpg')}
                alt={displayTitle}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* 2. Track Info */}
            <div className="min-w-0" style={{ width: 190, flexShrink: 0 }}>
              <h4
                className="truncate leading-tight"
                style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#EDE5DC' : '#292525' }}
              >
                {displayTitle}
              </h4>
              <p
                className="truncate mt-0.5"
                style={{ fontSize: 10, fontWeight: 500, color: isDark ? 'rgba(237,229,220,0.60)' : 'rgba(41,37,37,0.58)' }}
              >
                {displaySubtitle}
              </p>
            </div>

            {/* 3. Playback Controls */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={prevTrack}
                aria-label="Previous track"
                className="p-1 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              >
                <SkipBack className="w-[18px] h-[18px] fill-current" />
              </button>

              {/* Red circular play button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex items-center justify-center transition-transform duration-150 active:scale-95 hover:scale-105 cursor-pointer"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#D52F2F',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(213,47,47,0.30)',
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-[18px] h-[18px] fill-current" />
                ) : (
                  <Play className="w-[18px] h-[18px] fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                aria-label="Next track"
                className="p-1 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              >
                <SkipForward className="w-[18px] h-[18px] fill-current" />
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

            {/* 5. In-Page Stream Toggle Button (when track has embed stream) */}
            {playbackType === 'embed' && (
              <button
                type="button"
                onClick={() => setIsStreamExpanded(!isStreamExpanded)}
                className="p-1.5 shrink-0 transition-opacity hover:opacity-70 active:scale-95 text-[#D52F2F] cursor-pointer"
                aria-label={isStreamExpanded ? 'Hide in-page stream video' : 'Show in-page stream video'}
                title={isStreamExpanded ? (isBn ? 'ভিডিও বন্ধ করুন' : 'Hide video') : (isBn ? 'ভিডিও দেখুন' : 'View video')}
              >
                <Tv className="w-[18px] h-[18px]" />
              </button>
            )}

            {/* 6. Volume Control Slider & Mute Toggle */}
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

            {/* 7. Queue button */}
            <button
              type="button"
              onClick={() => setPlaylistDrawerOpen(!playlistDrawerOpen)}
              className="p-1.5 shrink-0 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
              style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              aria-label="Sharodiya Playlist"
            >
              <ListMusic className="w-[18px] h-[18px]" />
            </button>

            {/* 8. Close button */}
            <button
              type="button"
              onClick={closePlayer}
              className="p-1.5 shrink-0 transition-opacity hover:opacity-70 active:scale-95 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              style={{ color: isDark ? '#EDE5DC' : '#292525' }}
              aria-label="Close music player"
              title="Close music player"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* ── Mobile layout ── */}
          <div className="flex sm:hidden flex-col w-full h-full px-3 py-1.5 relative z-10 justify-center gap-1">
            {/* Top row: artwork + info + play + close */}
            <div className="flex items-center gap-2">
              <div
                className="relative shrink-0 rounded-lg overflow-hidden"
                style={{
                  width: 38,
                  height: 38,
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.45)',
                }}
              >
                <Image
                  src={getAssetPath(currentTrack.id === 'track-mahalaya-original' ? '/images/mahalaya-thumb.jpg' : currentTrack.coverUrl || '/images/mahalaya-thumb.jpg')}
                  alt={displayTitle}
                  fill
                  className="object-cover"
                  sizes="38px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className="truncate leading-tight text-xs font-bold"
                  style={{ color: isDark ? '#EDE5DC' : '#292525' }}
                >
                  {displayTitle}
                </h4>
                <p
                  className="truncate text-[10px]"
                  style={{ color: isDark ? 'rgba(237,229,220,0.55)' : 'rgba(41,37,37,0.55)' }}
                >
                  {displaySubtitle}
                </p>
              </div>

              {playbackType === 'embed' && (
                <button
                  type="button"
                  onClick={() => setIsStreamExpanded(!isStreamExpanded)}
                  className="p-1 shrink-0 text-[#D52F2F] active:scale-95"
                  aria-label="Toggle in-page stream viewer"
                >
                  <Tv className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="shrink-0 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#D52F2F',
                  color: '#fff',
                  boxShadow: '0 3px 10px rgba(213,47,47,0.25)',
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
                onClick={() => setPlaylistDrawerOpen(!playlistDrawerOpen)}
                className="p-1 shrink-0 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : 'rgba(41,37,37,0.55)' }}
                aria-label="Sharodiya Playlist"
              >
                <ListMusic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={closePlayer}
                className="p-1 shrink-0 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-opacity hover:opacity-70 active:scale-95 cursor-pointer"
                style={{ color: isDark ? '#EDE5DC' : 'rgba(41,37,37,0.55)' }}
                aria-label="Close music player"
                title="Close music player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom row: progress bar */}
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 9, color: isDark ? 'rgba(237,229,220,0.50)' : 'rgba(41,37,37,0.45)' }} className="font-mono tabular-nums">
                {formatSeconds(currentTime)}
              </span>
              <div
                className="relative flex-1"
                style={{ height: 3, borderRadius: 3, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)' }}
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
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${progressPercent}%`, background: '#D52F2F' }}
                />
              </div>
              <span style={{ fontSize: 9, color: isDark ? 'rgba(237,229,220,0.50)' : 'rgba(41,37,37,0.45)' }} className="font-mono tabular-nums">
                {formatSeconds(duration || 100)}
              </span>
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

