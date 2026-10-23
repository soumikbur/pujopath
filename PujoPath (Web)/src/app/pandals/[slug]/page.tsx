import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { PandalService } from '@/lib/services/PandalService';
import { PANDALS_DATA, KALI_PANDALS_DATA } from '@/data/pandals';
import { PandalDetailClient } from '@/components/pandals/PandalDetailClient';

export function generateStaticParams() {
  const allPandals = [...PANDALS_DATA, ...KALI_PANDALS_DATA];
  return allPandals.map((pandal) => ({
    slug: pandal.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const pandal = PandalService.getPandalBySlug(params.slug);
  if (!pandal) {
    return {
      title: 'Pandal Not Found',
    };
  }
  return {
    title: `${pandal.name} (${pandal.nameBn})`,
    description:
      pandal.description ||
      `${pandal.name} - ${pandal.zone}, Kolkata. Discover route, nearest metro station, crowd timings, and puja details.`,
  };
}

export default function PandalDetailPage({ params }: PageProps) {
  const pandal = PandalService.getPandalBySlug(params.slug);

  if (!pandal) {
    notFound();
  }

  return <PandalDetailClient pandal={pandal} />;
}
