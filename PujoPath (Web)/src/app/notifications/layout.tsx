import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pujo Alerts & Crowd Updates',
  description: 'Real-time festival announcements, crowd alerts, and weather advisories.',
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
