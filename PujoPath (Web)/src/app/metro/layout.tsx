import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kolkata Metro Guide & Timetable',
  description: 'Comprehensive Kolkata Metro route guide connecting North, South, East-West corridors to famous puja pandals.',
};

export default function MetroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
