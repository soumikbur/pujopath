'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
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
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <Footer />
        {/* Generous bottom clearance spacer above floating player & mobile nav */}
        <div className="h-32 sm:h-28 md:h-24 shrink-0" aria-hidden="true" />
        <BottomMusicPlayer />
        <MobileBottomNav />
      </div>
    </div>
  );
}
