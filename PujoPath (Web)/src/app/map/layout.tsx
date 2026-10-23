import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Pujo Map & Metro Routes',
  description: 'Interactive map of Kolkata with Durga Puja and Kali Puja pandals, GPS navigation, and metro connectivity.',
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
