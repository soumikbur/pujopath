'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { BottomMusicPlayer } from '@/components/music/BottomMusicPlayer';
import { PujoBackground } from '@/components/ui/PujoBackground';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell relative flex min-h-screen min-h-[100dvh] flex-col bg-[#FCFAF7] dark:bg-[#14110E] text-[#242424] dark:text-[#EDE5DC] transition-colors duration-300">
      {/* Culturally authentic, minimal festive background with geometric depth */}
      <PujoBackground />

      <div className="relative z-10 flex flex-1 flex-col min-h-screen min-h-[100dvh]">
        <Header />
        <main className="page-content mx-auto w-full max-w-6xl flex-[1_0_auto] px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <Footer />
        <BottomMusicPlayer />
        <MobileBottomNav />
      </div>
    </div>
  );
}
