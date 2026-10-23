import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Pandals & Favorites',
  description: 'Your saved pandals and bookmarked festival destinations for offline access.',
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
