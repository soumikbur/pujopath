import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Pandals & Themes',
  description: 'Search, filter, and discover over 1,500 Durga Puja and Kali Puja pandals across Kolkata.',
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
