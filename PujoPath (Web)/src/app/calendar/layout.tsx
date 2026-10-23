import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pujo Calendar & Tithi Timings',
  description: 'Detailed Durga Puja 2026 ritual calendar with exact tithi timings from Mahalaya to Dashami.',
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
