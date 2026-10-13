'use client';

import React, { useRef, useState, useEffect, useCallback, useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SegmentedControlOption<T extends string = string> {
  id: T;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AnimatedSegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'subtle';
  ariaLabel?: string;
  fullWidth?: boolean;
}

export function AnimatedSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
  variant = 'brand',
  ariaLabel = 'Filter options',
  fullWidth = false,
}: AnimatedSegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const controlId = useId();

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const updateIndicator = useCallback(() => {
    const activeBtn = buttonRefs.current.get(value);
    const container = containerRef.current;
    if (!activeBtn || !container) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    setIndicatorStyle({
      left: activeBtn.offsetLeft,
      top: activeBtn.offsetTop,
      width: activeBtn.offsetWidth,
      height: activeBtn.offsetHeight,
      opacity: 1,
    });
  }, [value]);

  // Recalculate on value change, options change, or container resize
  useEffect(() => {
    updateIndicator();
  }, [value, options, updateIndicator]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      updateIndicator();
    });
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateIndicator);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = options.length - 1;
    }

    if (nextIndex !== currentIndex && !options[nextIndex].disabled) {
      const nextOption = options[nextIndex];
      onChange(nextOption.id);
      const nextBtn = buttonRefs.current.get(nextOption.id);
      nextBtn?.focus();
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] py-1.5 px-3 min-h-[32px] gap-1.5',
    md: 'text-xs sm:text-sm py-2 px-3.5 min-h-[38px] gap-2',
    lg: 'text-sm sm:text-base py-2.5 px-4 min-h-[44px] gap-2.5',
  }[size];

  const pillVariantClasses =
    variant === 'brand'
      ? 'bg-[#b42323] text-white shadow-xs'
      : 'bg-white dark:bg-[#2a241e] text-[#b42323] dark:text-[#ede5dc] shadow-xs border border-[#eee8e1] dark:border-[#382d24]';

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex p-1 rounded-2xl bg-[#f0e9df] dark:bg-[#1f1915] border border-[#e4dcce] dark:border-[#332a22]',
        'overflow-x-auto max-w-full no-scrollbar select-none',
        fullWidth && 'w-full flex',
        className
      )}
    >
      {/* Sliding Active Indicator */}
      <div
        data-active-indicator="true"
        aria-hidden="true"
        style={{
          transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
          width: `${indicatorStyle.width}px`,
          height: `${indicatorStyle.height}px`,
          opacity: indicatorStyle.opacity,
          transition: prefersReducedMotion
            ? 'none'
            : 'transform 260ms cubic-bezier(0.2, 0, 0, 1), width 260ms cubic-bezier(0.2, 0, 0, 1), height 260ms cubic-bezier(0.2, 0, 0, 1), opacity 150ms ease-out',
        }}
        className={cn(
          'absolute top-0 left-0 rounded-xl pointer-events-none will-change-transform z-0',
          pillVariantClasses
        )}
      />

      {/* Segment Option Buttons */}
      {options.map((opt, idx) => {
        const isSelected = opt.id === value;
        return (
          <button
            key={opt.id}
            id={`${controlId}-tab-${opt.id}`}
            ref={(el) => {
              if (el) buttonRefs.current.set(opt.id, el);
              else buttonRefs.current.delete(opt.id);
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={`${controlId}-panel-${opt.id}`}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'relative z-10 font-bold rounded-xl flex items-center justify-center whitespace-nowrap transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b42323] focus-visible:ring-offset-1',
              fullWidth ? 'flex-1' : 'shrink-0',
              sizeClasses,
              isSelected
                ? variant === 'brand'
                  ? 'text-white'
                  : 'text-[#b42323] dark:text-white font-extrabold'
                : 'text-[#655c54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-[#ede5dc]',
              opt.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ml-1',
                  isSelected
                    ? variant === 'brand'
                      ? 'bg-white/25 text-white'
                      : 'bg-[#b42323]/10 text-[#b42323]'
                    : 'bg-black/5 dark:bg-white/10 text-[#776d65] dark:text-[#a89e95]'
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
