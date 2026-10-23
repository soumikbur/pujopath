import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PujoPath',
  description: 'Learn about PujoPath, an open-source festival guide celebrating the cultural heritage of Bengal.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
