import React from 'react';
import { notFound } from 'next/navigation';
import { PandalService } from '@/lib/services/PandalService';
import { PANDALS_DATA } from '@/data/pandals';
import { PandalDetailClient } from '@/components/pandals/PandalDetailClient';

export function generateStaticParams() {
  return PANDALS_DATA.map((pandal) => ({
    slug: pandal.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function PandalDetailPage({ params }: PageProps) {
  const pandal = PandalService.getPandalBySlug(params.slug);

  if (!pandal) {
    notFound();
  }

  return <PandalDetailClient pandal={pandal} />;
}
