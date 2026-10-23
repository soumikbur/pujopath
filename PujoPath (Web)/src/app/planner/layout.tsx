import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Route Planner',
  description: 'Plan your personalized pandal hopping route across Kolkata with smart path optimization and metro links.',
};

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
