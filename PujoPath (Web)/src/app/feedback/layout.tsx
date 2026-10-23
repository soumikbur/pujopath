import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback & Suggestions',
  description: 'Share your feedback, bug reports, and suggestions for PujoPath.',
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
