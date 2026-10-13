'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { BottomMusicPlayer } from '@/components/music/BottomMusicPlayer';
import { PujoBackground } from '@/components/ui/PujoBackground';

import { PageTransition } from './PageTransition';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dedicated fixed background layer */}
      <PujoBackground />

      {/* Main page content layer with normal document flow above background */}
      <div className="home-page-content app-shell relative z-10 flex min-h-screen flex-col text-[#242424] dark:text-[#EDE5DC] transition-colors duration-300">
        <Header />
        <main className="page-content mx-auto w-full max-w-6xl flex-[1_0_auto] px-4 py-6 sm:px-6 sm:py-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <BottomMusicPlayer />
        <MobileBottomNav />
      </div>
    </>
  );
}
