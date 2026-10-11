'use client';

import React from 'react';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { BottomMusicPlayer } from '@/components/music/BottomMusicPlayer';
import { PujoBackground } from '@/components/ui/PujoBackground';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#FCFAF7] dark:bg-[#14110E] text-[#242424] dark:text-[#EDE5DC] transition-colors duration-300">
      {/* Culturally authentic, minimal festive background with geometric depth */}
      <PujoBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-36 sm:px-6 sm:py-8 sm:pb-32 md:pb-28">
          {children}
        </main>
        <BottomMusicPlayer />
        <MobileBottomNav />
      </div>
    </div>
  );
}
