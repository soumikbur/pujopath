import { Pandal } from './pandal';

export interface RouteStop {
  pandalId: string;
  pandal: Pandal;
  order: number;
  customNotes?: string;
}

export interface RouteItinerary {
  id: string;
  name: string;
  nameBn?: string;
  description?: string;
  createdAt: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  suggestedTransitMode: 'Walking' | 'Metro + Walking' | 'Cab/Auto';
}
