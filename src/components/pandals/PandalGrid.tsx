'use client';

import React from 'react';
import { Pandal } from '@/types';
import { PandalCard } from './PandalCard';
import { Sparkles } from 'lucide-react';

interface PandalGridProps {
  pandals: Pandal[];
  variant?: 'grid' | 'horizontal';
}

export function PandalGrid({ pandals, variant = 'grid' }: PandalGridProps) {
  if (pandals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-pujo-border shadow-card">
        <Sparkles className="w-8 h-8 text-pujo-red mb-2" />
        <h3 className="font-bold text-base text-pujo-text-primary">No Pandals Found</h3>
        <p className="text-xs text-pujo-text-muted mt-1 max-w-xs">
          Try clearing your filters or search query to explore more pandals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {pandals.map((pandal) => (
        <PandalCard key={pandal.id} pandal={pandal} variant={variant} />
      ))}
    </div>
  );
}
