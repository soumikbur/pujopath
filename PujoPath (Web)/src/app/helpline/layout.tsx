import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Helplines & Safety Contacts',
  description: 'Quick dial police, ambulance, medical emergency, fire department, and women helpline numbers during Kolkata Durga Puja.',
};

export default function HelplineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
