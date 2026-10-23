import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sharodiya Puja Music & Dhak',
  description: 'Listen to traditional dhaak rhythms, agomoni songs, and devotional melodies of Sharodotsav.',
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
