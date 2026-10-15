'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function CapacitorAppBridge() {
  const router = useRouter();
  const pathname = usePathname();

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    let cleanupListeners: (() => void)[] = [];

    async function initCapacitorBridge() {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;

        // Apply native CSS marker class for notch / safe area insets
        document.documentElement.classList.add('capacitor-native');

        // 1. Splash Screen - dismiss smoothly upon React hydration
        const { SplashScreen } = await import('@capacitor/splash-screen');
        setTimeout(() => {
          if (isMounted) {
            SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
          }
        }, 350);

        // 2. Status Bar Configuration & Dynamic Theme Sync
        const { StatusBar, Style } = await import('@capacitor/status-bar');

        const updateStatusBar = async () => {
          try {
            const isDark = document.documentElement.classList.contains('dark');
            // Always overlay webview for true edge-to-edge immersion
            await StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});

            if (isDark) {
              await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
              await StatusBar.setBackgroundColor({ color: '#14110E' }).catch(() => {});
            } else {
              // Light theme signature PujoPath maroon header
              await StatusBar.setStyle({ style: Style.Light }).catch(() => {});
              await StatusBar.setBackgroundColor({ color: '#7c1d1d' }).catch(() => {});
            }
          } catch {
            // Silently handle web/unsupported
          }
        };

        // Initial update
        await updateStatusBar();

        // Listen for theme mutations on documentElement
        const observer = new MutationObserver(() => {
          updateStatusBar();
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
        cleanupListeners.push(() => observer.disconnect());

        // 3. Android Hardware Back Button Hierarchy with Debounce Protection
        const { App } = await import('@capacitor/app');
        let lastBackTime = 0;

        const backHandler = await App.addListener('backButton', () => {
          const now = Date.now();
          // Prevent accidental fast double-tap / gesture bounce
          if (now - lastBackTime < 300) return;
          lastBackTime = now;

          // Priority 0: Skip intro animation if currently active
          const introSkipBtn = document.querySelector<HTMLButtonElement>(
            '[data-skip-intro="true"]'
          );
          const introOverlay = document.querySelector('.pujopath-intro-overlay:not(.opacity-0)');
          if (introSkipBtn && introOverlay) {
            introSkipBtn.click();
            return;
          }

          // Priority 1: Close any active modal, dialog, or drawer
          const activeModal = document.querySelector(
            '[role="dialog"], .suggest-modal-overlay, .add-modal-overlay'
          );
          const activeDropdown = document.querySelector('[aria-expanded="true"]');

          if (activeModal || activeDropdown) {
            // Dispatch Escape key event to trigger accessible close handlers
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
            return;
          }

          // Priority 2: Navigate back if on a sub-route
          const current = pathnameRef.current;
          const isHome = !current || current === '/' || current === '/index.html';
          if (!isHome) {
            if (window.history.length > 1) {
              routerRef.current.back();
            } else {
              routerRef.current.push('/');
            }
            return;
          }

          // Priority 3: Minimize/exit app if on home screen
          App.exitApp();
        });

        cleanupListeners.push(() => backHandler.remove());

        // 4. External URL Routing: open external links in system browser
        const handleAnchorClick = (e: MouseEvent) => {
          const target = (e.target as HTMLElement)?.closest('a');
          if (target && target.href) {
            const url = new URL(target.href, window.location.href);
            const isExternal =
              url.origin !== window.location.origin &&
              !url.protocol.startsWith('blob') &&
              !url.protocol.startsWith('data');

            if (isExternal) {
              e.preventDefault();
              window.open(target.href, '_system');
            }
          }
        };

        document.addEventListener('click', handleAnchorClick, true);
        cleanupListeners.push(() => {
          document.removeEventListener('click', handleAnchorClick, true);
        });
      } catch (err) {
        console.warn('Capacitor bridge initialization notice:', err);
      }
    }

    initCapacitorBridge();

    return () => {
      isMounted = false;
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
