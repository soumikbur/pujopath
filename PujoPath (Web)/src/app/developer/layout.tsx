import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer & Credits',
  description: 'Meet the creators and developers behind PujoPath.',
};

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return children;
}
