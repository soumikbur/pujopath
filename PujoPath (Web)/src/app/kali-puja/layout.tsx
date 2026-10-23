import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kali Puja & Barasat Illumination',
  description: 'Explore Barasat and Kolkata Kali Puja celebrations, renowned lighting displays, and temple guides.',
};

export default function KaliPujaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
