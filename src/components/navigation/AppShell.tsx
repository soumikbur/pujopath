'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { BottomMusicPlayer } from '@/components/music/BottomMusicPlayer';
import { SmartwatchView } from '@/components/watch/SmartwatchView';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isWatchMode, setIsWatchMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 320) {
        setIsWatchMode(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isWatchMode) {
    return <SmartwatchView onExitWatchMode={() => setIsWatchMode(false)} />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start py-5 px-3 sm:py-6 sm:px-5 md:py-7 md:px-6">
      {/* Layer 1: Full-Screen Realistic Durga Photo Background */}
      <div className="page-bg-fixed" />

      {/* Layer 2: Warm Translucent Peach/Cream Wash Overlay */}
      <div className="page-bg-wash" />

      {/* Layer 3: Centered ~1180px Translucent Cream Glass Application Shell */}
      <div
        className="relative z-10 w-full mx-auto flex flex-col overflow-hidden"
        style={{
          maxWidth: '1180px',
          borderRadius: '28px',
          background: 'rgba(255, 250, 244, 0.72)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.55)',
          boxShadow: '0 20px 60px rgba(70, 35, 15, 0.08)',
        }}
      >
        {/* Top Header */}
        <Header
          onToggleWatchMode={() => setIsWatchMode(!isWatchMode)}
          isWatchMode={isWatchMode}
        />

        {/* Main Content Area */}
        <main className="w-full px-5 sm:px-7 md:px-8 py-5 pb-24 md:pb-20">
          {children}
        </main>
      </div>

      {/* Layer 4: Floating Frosted Cream Glass Music Player */}
      <BottomMusicPlayer />

      {/* Layer 5: Mobile Fixed Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
