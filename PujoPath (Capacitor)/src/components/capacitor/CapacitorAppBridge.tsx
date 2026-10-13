'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function CapacitorAppBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    let isMounted = true;

    async function initCapacitor() {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;

        // Apply native CSS class for notch / safe area insets
        document.documentElement.classList.add('capacitor-native');

        // Status Bar configuration
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
        await StatusBar.setBackgroundColor({ color: '#7c1d1d' }).catch(() => {});

        // Splash screen auto hide after hydration
        const { SplashScreen } = await import('@capacitor/splash-screen');
        setTimeout(() => {
          if (isMounted) {
            SplashScreen.hide().catch(() => {});
          }
        }, 300);

        // Hardware back button listener for Android
        const { App } = await import('@capacitor/app');
        App.addListener('backButton', ({ canGoBack }) => {
          if (window.location.pathname === '/' || window.location.pathname === '') {
            App.exitApp();
          } else if (canGoBack) {
            window.history.back();
          } else {
            router.push('/');
          }
        });
      } catch (err) {
        // Silently continue if Capacitor plugins aren't present in web environment
      }
    }

    initCapacitor();

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  return null;
}
