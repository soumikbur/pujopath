import { Pandal, FilterOptions } from '@/types';
import { PandalService } from '@/lib/services/PandalService';

export async function fetchPandals(options?: Partial<FilterOptions>, userLat?: number, userLng?: number): Promise<Pandal[]> {
  return PandalService.filterPandals(options || {}, userLat, userLng);
}

export async function fetchPandalBySlug(slug: string, userLat?: number, userLng?: number): Promise<Pandal | null> {
  return PandalService.getPandalBySlug(slug, userLat, userLng);
}
