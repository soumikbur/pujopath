import { MetroStation, Pandal } from '@/types';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { PANDALS_DATA } from '@/data/pandals';
import { calculateHaversineDistance } from '@/lib/geo';

export class MetroService {
  static getAllStations(): MetroStation[] {
    return [...METRO_STATIONS_DATA];
  }

  static getStationById(id: string): MetroStation | null {
    return METRO_STATIONS_DATA.find((s) => s.id === id) || null;
  }

  static getPandalsForStation(station: MetroStation): Pandal[] {
    const directPandals = PANDALS_DATA.filter((p) => station.nearbyPandalIds.includes(p.id));
    const nearbyGeometric = PANDALS_DATA.filter((p) => {
      if (directPandals.some((dp) => dp.id === p.id)) return false;
      const dist = calculateHaversineDistance(station.latitude, station.longitude, p.latitude, p.longitude);
      return dist <= 1.8;
    });

    const all = [...directPandals, ...nearbyGeometric].map((p) => ({
      ...p,
      distanceKm: calculateHaversineDistance(station.latitude, station.longitude, p.latitude, p.longitude),
    }));

    return all.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }

  static searchStations(query: string): MetroStation[] {
    if (!query.trim()) return METRO_STATIONS_DATA;
    const q = query.toLowerCase().trim();
    return METRO_STATIONS_DATA.filter(
      (s) => s.name.toLowerCase().includes(q) || s.nameBn.includes(q) || s.address.toLowerCase().includes(q)
    );
  }
}
