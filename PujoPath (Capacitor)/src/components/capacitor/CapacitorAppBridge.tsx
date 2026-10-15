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

  const routeHistoryRef = useRef<string[]>([]);

  useEffect(() => {
    if (!pathname) return;
    const stack = routeHistoryRef.current;
    if (stack.length === 0) {
      stack.push(pathname);
      return;
    }
    const last = stack[stack.length - 1];
    if (last !== pathname) {
      if (stack.length > 1 && stack[stack.length - 2] === pathname) {
        stack.pop();
      } else {
        stack.push(pathname);
      }
    }
  }, [pathname]);

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
            // Do NOT overlay webview so status bar never overlaps page content
            await StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});

            if (isDark) {
              await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
              await StatusBar.setBackgroundColor({ color: '#14110E' }).catch(() => {});
            } else {
              await StatusBar.setStyle({ style: Style.Light }).catch(() => {});
              await StatusBar.setBackgroundColor({ color: '#FCFAF7' }).catch(() => {});
            }

            // Sync with Android native theme bridge for edge-to-edge status bar background
            if (typeof (window as any).AndroidThemeBridge?.setSystemBarTheme === 'function') {
              (window as any).AndroidThemeBridge.setSystemBarTheme(isDark);
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

        // 3. Android Hardware Back Button Hierarchy with Coordinated State Navigation
        const { App } = await import('@capacitor/app');
        let lastBackTime = 0;

        const backHandler = await App.addListener('backButton', () => {
          const now = Date.now();
          // Debounce rapid tap / gesture bounce
          if (now - lastBackTime < 250) return;
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

          // Priority 1: Full-screen Music Player
          const fullPlayerCloseBtn = document.querySelector<HTMLButtonElement>(
            '[data-close-fullscreen-player="true"]'
          );
          if (fullPlayerCloseBtn) {
            fullPlayerCloseBtn.click();
            return;
          }

          // Priority 2: Close active modal, dialog, or drawer
          const activeModal = document.querySelector(
            '[role="dialog"], .suggest-modal-overlay, .add-modal-overlay'
          );
          if (activeModal) {
            const closeBtn = activeModal.querySelector<HTMLButtonElement>(
              'button[aria-label*="Close" i], button[aria-label*="close" i], button[aria-label*="বন্ধ" i], [data-modal-close="true"]'
            );
            if (closeBtn) {
              closeBtn.click();
              return;
            }
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
            return;
          }

          // Priority 3: Desktop/Header dropdowns (if open)
          const activeHeaderDropdown = document.querySelector('#desktop-more-menu-button[aria-expanded="true"]');
          if (activeHeaderDropdown) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
            return;
          }

          // Priority 4: In-app route navigation history
          const current = pathnameRef.current;
          const isHome = !current || current === '/' || current === '/index.html';

          if (routeHistoryRef.current.length > 1) {
            routeHistoryRef.current.pop(); // Remove current
            const target = routeHistoryRef.current[routeHistoryRef.current.length - 1];
            if (window.history.length > 1) {
              routerRef.current.back();
            } else if (target) {
              routerRef.current.push(target);
            } else {
              routerRef.current.push('/');
            }
            return;
          }

          // If history stack only has 1 or fewer entries:
          if (!isHome) {
            routerRef.current.push('/');
            return;
          }

          // Priority 5: User is on Home screen with no prior route history -> minimize/exit app
          App.exitApp();
        });

        cleanupListeners.push(() => backHandler.remove());

        // 4. External URL Routing: open external links in system browser
        const handleAnchorClick = (e: MouseEvent) => {
          const target = (e.target as HTMLElement)?.closest('a');
          if (target && target.href) {
            if (target.href.startsWith('mailto:') || target.href.startsWith('tel:')) {
              // Allow native Android Intent handling for mailto: and tel:
              return;
            }
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
