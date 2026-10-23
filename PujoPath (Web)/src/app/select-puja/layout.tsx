import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Select Festival Experience',
  description: 'Choose between Kolkata Durga Puja and Barasat Kali Puja experiences.',
};

export default function SelectPujaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
