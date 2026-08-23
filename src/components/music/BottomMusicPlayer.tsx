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
} from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

export function BottomMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    queue,
    playTrack,
  } = useAudio();

  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [playlistDrawerOpen, setPlaylistDrawerOpen] = useState(false);

  if (!currentTrack) return null;

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
    ? 'ঐতিহ্যবাহী স্তোত্র ও চণ্ডীপাঠ'
    : 'Traditional Stotram & Chandi Path';

  return (
    <>
      {/* ── Wide Floating Frosted Glass Media Player ── */}
      <aside
        aria-label="Media Player"
        className="fixed z-40 left-1/2 -translate-x-1/2 bottom-16 md:bottom-5 pointer-events-auto
                   w-[calc(100%-20px)] md:w-[820px]"
      >
        {/* Glass container */}
        <div
          className="relative overflow-hidden flex items-center"
          style={{
            height: '78px',
            borderRadius: '24px',
            background: 'rgba(255, 250, 244, 0.62)',
            backdropFilter: 'blur(24px) saturate(120%)',
            WebkitBackdropFilter: 'blur(24px) saturate(120%)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow:
              '0 12px 40px rgba(80, 50, 30, 0.12), inset 0 1px 0 rgba(255,255,255,0.70)',
          }}
        >
          {/* Glass top highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 'inherit',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)',
            }}
          />

          {/* ── Desktop layout ── */}
          <div className="hidden sm:flex items-center w-full h-full px-4 gap-4 relative z-10">
            {/* 1. Album Artwork — 48×48 */}
            <div
              className="relative shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 48,
                height: 48,
                border: '1px solid rgba(255,255,255,0.50)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <Image
                src="/images/mahalaya-thumb.jpg"
                alt={displayTitle}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* 2. Track Info — fixed 220px */}
            <div className="min-w-0" style={{ width: 220, flexShrink: 0 }}>
              <h4
                className="truncate leading-tight"
                style={{ fontSize: 13, fontWeight: 700, color: '#292525' }}
              >
                {displayTitle}
              </h4>
              <p
                className="truncate mt-0.5"
                style={{ fontSize: 10, fontWeight: 500, color: 'rgba(41,37,37,0.58)' }}
              >
                {displaySubtitle}
              </p>
            </div>

            {/* 3. Playback Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={prevTrack}
                aria-label="Previous"
                className="p-1 transition-opacity hover:opacity-70 active:scale-95"
                style={{ color: '#292525' }}
              >
                <SkipBack className="w-[18px] h-[18px] fill-current" />
              </button>

              {/* Red circular play button */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex items-center justify-center transition-transform duration-150 active:scale-95 hover:scale-105"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#D52F2F',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(213,47,47,0.30)',
                }}
              >
                {isPlaying ? (
                  <Pause className="w-[18px] h-[18px] fill-current" />
                ) : (
                  <Play className="w-[18px] h-[18px] fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                aria-label="Next"
                className="p-1 transition-opacity hover:opacity-70 active:scale-95"
                style={{ color: '#292525' }}
              >
                <SkipForward className="w-[18px] h-[18px] fill-current" />
              </button>
            </div>

            {/* 4. Progress section — fills remaining space */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span
                className="shrink-0 font-mono tabular-nums"
                style={{ fontSize: 10, color: 'rgba(41,37,37,0.52)' }}
              >
                {formatSeconds(currentTime)}
              </span>

              <div
                className="relative flex-1 cursor-pointer group"
                style={{ height: 4, borderRadius: 4, background: 'rgba(0,0,0,0.08)' }}
              >
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
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
                className="shrink-0 font-mono tabular-nums"
                style={{ fontSize: 10, color: 'rgba(41,37,37,0.52)' }}
              >
                {formatSeconds(duration || 245)}
              </span>
            </div>

            {/* 5. Queue button */}
            <button
              onClick={() => setPlaylistDrawerOpen(!playlistDrawerOpen)}
              className="p-1.5 shrink-0 transition-opacity hover:opacity-70"
              style={{ color: '#292525' }}
              aria-label="Playlist"
            >
              <ListMusic className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* ── Mobile layout ── */}
          <div className="flex sm:hidden flex-col w-full h-full px-3.5 py-2 relative z-10 justify-center gap-1.5">
            {/* Top row: artwork + info + play */}
            <div className="flex items-center gap-2.5">
              <div
                className="relative shrink-0 rounded-lg overflow-hidden"
                style={{
                  width: 40,
                  height: 40,
                  border: '1px solid rgba(255,255,255,0.45)',
                }}
              >
                <Image
                  src="/images/mahalaya-thumb.jpg"
                  alt={displayTitle}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className="truncate leading-tight"
                  style={{ fontSize: 12, fontWeight: 700, color: '#292525' }}
                >
                  {displayTitle}
                </h4>
                <p
                  className="truncate"
                  style={{ fontSize: 10, color: 'rgba(41,37,37,0.55)' }}
                >
                  {displaySubtitle}
                </p>
              </div>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#D52F2F',
                  color: '#fff',
                  boxShadow: '0 3px 10px rgba(213,47,47,0.25)',
                }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setPlaylistDrawerOpen(!playlistDrawerOpen)}
                className="p-1 shrink-0"
                style={{ color: 'rgba(41,37,37,0.55)' }}
                aria-label="Playlist"
              >
                <ListMusic className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom row: progress */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 9, color: 'rgba(41,37,37,0.45)' }} className="font-mono tabular-nums">
                {formatSeconds(currentTime)}
              </span>
              <div
                className="relative flex-1"
                style={{ height: 3, borderRadius: 3, background: 'rgba(0,0,0,0.07)' }}
              >
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${progressPercent}%`, background: '#D52F2F' }}
                />
              </div>
              <span style={{ fontSize: 9, color: 'rgba(41,37,37,0.45)' }} className="font-mono tabular-nums">
                {formatSeconds(duration || 245)}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Playlist Drawer Modal ── */}
      {playlistDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md p-4 space-y-3"
            style={{
              borderRadius: 24,
              background: 'rgba(255, 255, 255, 0.96)',
              border: '1px solid rgba(234, 220, 206, 0.8)',
              boxShadow: '0 20px 60px rgba(70, 35, 15, 0.18)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: '#EADCCE' }}>
              <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#242424' }}>
                <ListMusic className="w-4 h-4 text-[#D52F2F]" />
                <span>{isBn ? 'শারদীয়া গানের তালিকা' : 'Sharodiya Playlist'}</span>
              </h3>
              <button
                onClick={() => setPlaylistDrawerOpen(false)}
                className="p-1 rounded-lg"
                style={{ color: '#665A54' }}
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
                    className="p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    style={{
                      background: isSelected ? '#FDEEEB' : '#F8F0E8',
                      border: `1px solid ${isSelected ? '#F6CECA' : '#EADCCE'}`,
                      color: isSelected ? '#D52F2F' : '#4A423D',
                      fontWeight: isSelected ? 700 : 400,
                    }}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate">{tTitle}</h4>
                      <p className="text-[10px] truncate" style={{ color: '#665A54' }}>{tArtist}</p>
                    </div>
                    <span className="text-[11px] font-mono font-bold" style={{ color: '#D52F2F' }}>
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
