'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
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
