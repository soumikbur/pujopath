import { MetroStation, Pandal } from '@/types';
import { MetroService } from '@/lib/services/MetroService';

export async function fetchMetroStations(query?: string): Promise<MetroStation[]> {
  return MetroService.searchStations(query || '');
}

export async function fetchPandalsForStation(station: MetroStation): Promise<Pandal[]> {
  return MetroService.getPandalsForStation(station);
}
