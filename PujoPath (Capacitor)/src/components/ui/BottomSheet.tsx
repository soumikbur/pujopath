'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxHeight = 'max-h-[85vh]',
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1300] flex flex-col justify-end md:hidden"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full bg-white dark:bg-[#1a1613] rounded-t-3xl shadow-2xl border-t border-[#eee8e1] dark:border-[#2f2720] z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300',
          maxHeight,
          className
        )}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-[#d9d0c7] dark:bg-[#3b332b]" />
        </div>

        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#eee8e1] dark:border-[#2f2720]">
            <div className="font-bold text-[#242424] dark:text-[#ede5dc]">{title}</div>
            <button
              onClick={onClose}
              aria-label="Close bottom sheet"
              className="p-1.5 rounded-lg text-[#776d65] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
