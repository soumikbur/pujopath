'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Route,
  Train,
  Heart,
  Play,
  Pause,
  ArrowRight,
} from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { CalendarService } from '@/lib/services/CalendarService';
import { toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

interface SmartwatchViewProps {
  onExitWatchMode?: () => void;
}

export function SmartwatchView({ onExitWatchMode }: SmartwatchViewProps) {
  const { currentTrack, isPlaying, togglePlay } = useAudio();
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [activeScreen, setActiveScreen] = useState<'home' | 'quick' | 'music'>('home');
  const [watchShape, setWatchShape] = useState<'round' | 'rect'>('round');

  const countdown = CalendarService.getCountdown();

  return (
    <div className="fixed inset-0 z-50 bg-[#141210] flex flex-col items-center justify-center p-4">
      {/* Top Device Switcher */}
      <div className="flex items-center gap-3 mb-4 z-10">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#221e1a] border border-[#38322b] text-xs">
          <button
            onClick={() => setWatchShape('round')}
            className={cn(
              'px-3 py-1 rounded-lg transition-colors font-semibold',
              watchShape === 'round' ? 'bg-pujo-red text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            Wear OS (গোলাকার)
          </button>
          <button
            onClick={() => setWatchShape('rect')}
            className={cn(
              'px-3 py-1 rounded-lg transition-colors font-semibold',
              watchShape === 'rect' ? 'bg-pujo-red text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            Apple Watch (আয়তাকার)
          </button>
        </div>

        {onExitWatchMode && (
          <button
            onClick={onExitWatchMode}
            className="px-3 py-1.5 rounded-xl bg-[#221e1a] border border-[#38322b] text-xs font-bold text-gray-300 hover:text-white"
          >
            ঘড়ি বন্ধ &times;
          </button>
        )}
      </div>

      {/* Watch Screen Chassis */}
      <div
        className={cn(
          'relative w-[320px] h-[320px] bg-black text-white border-[10px] border-[#2a241e] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between select-none transition-all duration-300',
          watchShape === 'round' ? 'rounded-full p-6' : 'rounded-[44px] w-[300px] h-[350px] p-5'
        )}
      >
        {/* Top Watch Bar: 10:09 */}
        <div className="text-center text-[12px] font-mono text-gray-400 font-bold tracking-wider pt-1">
          ১০:০৯
        </div>

        {/* SCREEN 1: Home Countdown Screen in Bengali */}
        {activeScreen === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-1 text-xs font-bold tracking-tight text-white">
              <span className="text-pujo-red font-black">ψ</span>
              <span>পুজোপথ</span>
            </div>

            <div className="text-[11px] text-gray-300 font-bold">
              {isBn ? 'শারদীয়া দুর্গাপূজা ২০২৬' : 'Durga Puja 2026'}
            </div>

            <div className="flex items-center justify-center gap-3 py-0.5">
              <div className="text-left">
                <div className="text-4xl font-black text-amber-400 font-sans leading-none">
                  {isBn ? toBengaliDigits(countdown.days) : countdown.days}
                </div>
                <div className="text-[10px] text-gray-300 font-bold mt-0.5">
                  {isBn ? 'দিন বাকি' : 'Days to Pujo'}
                </div>
              </div>

              {/* Small Durga Artwork Avatar */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/40 shadow-sm shrink-0 bg-[#2a241e]">
                <Image
                  src="/images/durga-mandala.jpg"
                  alt="Durga Face"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('quick')}
              className="mt-1 px-4 py-1.5 rounded-full bg-pujo-red hover:bg-pujo-red-hover text-white text-[11px] font-bold shadow-md flex items-center gap-1 transition-transform active:scale-95"
            >
              <span>{isBn ? 'ঘুরে দেখুন' : 'Explore'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* SCREEN 2: Quick Access 2x2 Grid in Bengali */}
        {activeScreen === 'quick' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in">
            <div className="text-xs font-bold text-gray-200">
              {isBn ? 'দ্রুত প্রবেশ' : 'Quick Access'}
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-w-[170px]">
              <div
                onClick={() => setActiveScreen('home')}
                className="w-16 h-16 rounded-2xl bg-[#1c1814] border border-[#332b24] flex flex-col items-center justify-center p-1 cursor-pointer active:scale-95"
              >
                <MapPin className="w-4 h-4 text-red-500 mb-0.5" />
                <span className="text-[10px] text-gray-200 font-bold">{isBn ? 'মানচিত্র' : 'Map'}</span>
              </div>

              <div
                onClick={() => setActiveScreen('home')}
                className="w-16 h-16 rounded-2xl bg-[#1c1814] border border-[#332b24] flex flex-col items-center justify-center p-1 cursor-pointer active:scale-95"
              >
                <Route className="w-4 h-4 text-emerald-500 mb-0.5" />
                <span className="text-[10px] text-gray-200 font-bold">{isBn ? 'পরিকল্পনা' : 'Planner'}</span>
              </div>

              <div
                onClick={() => setActiveScreen('home')}
                className="w-16 h-16 rounded-2xl bg-[#1c1814] border border-[#332b24] flex flex-col items-center justify-center p-1 cursor-pointer active:scale-95"
              >
                <Train className="w-4 h-4 text-sky-500 mb-0.5" />
                <span className="text-[10px] text-gray-200 font-bold">{isBn ? 'মেট্রো' : 'Metro'}</span>
              </div>

              <div
                onClick={() => setActiveScreen('music')}
                className="w-16 h-16 rounded-2xl bg-[#1c1814] border border-[#332b24] flex flex-col items-center justify-center p-1 cursor-pointer active:scale-95"
              >
                <Heart className="w-4 h-4 text-rose-500 mb-0.5" />
                <span className="text-[10px] text-gray-200 font-bold">{isBn ? 'সংরক্ষিত' : 'Saved'}</span>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: Now Playing Screen in Bengali */}
        {activeScreen === 'music' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-1.5 animate-in fade-in">
            <div className="text-[11px] font-bold text-gray-300">
              {isBn ? 'এখন বাজছে' : 'Now Playing'}
            </div>

            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shadow-md my-0.5 bg-[#221e1a]">
              <Image
                src="/images/mahalaya-thumb.jpg"
                alt="Mahishasura Mardini"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            <div className="text-[11px] font-bold text-white truncate max-w-[160px]">
              {isBn ? (currentTrack?.titleBn || 'মহিষাসুরমর্দিনী') : (currentTrack?.title || 'Mahishasura Mardini')}
            </div>

            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-pujo-red text-white flex items-center justify-center shadow-md active:scale-95 transition-transform mt-0.5"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>
        )}

        {/* Bottom 3 Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 pb-1">
          {[
            { id: 'home', screen: 'home' },
            { id: 'quick', screen: 'quick' },
            { id: 'music', screen: 'music' },
          ].map((dot) => (
            <button
              key={dot.id}
              onClick={() => setActiveScreen(dot.screen as typeof activeScreen)}
              className={cn(
                'rounded-full transition-all duration-200',
                activeScreen === dot.screen
                  ? 'w-3 h-1.5 bg-pujo-red'
                  : 'w-1.5 h-1.5 bg-gray-600 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
