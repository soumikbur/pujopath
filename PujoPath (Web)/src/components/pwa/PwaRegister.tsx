'use client';

import { useEffect } from 'react';
import { getAssetPath } from '@/lib/utils/asset';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = getAssetPath('/sw.js');
        const scopeUrl = getAssetPath('/');
        navigator.serviceWorker
          .register(swUrl, { scope: scopeUrl })
          .then((reg) => {
            console.log('PujoPath ServiceWorker registration successful:', reg.scope);
          })
          .catch((err) => {
            console.warn('PujoPath ServiceWorker registration failed:', err);
          });
      });
    }
  }, []);

  return null;
}
