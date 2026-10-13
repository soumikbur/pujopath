import { Pandal, MetroStation } from '@/types';

export class MapService {
  static getBounds(items: { latitude: number; longitude: number }[]): [[number, number], [number, number]] | null {
    if (items.length === 0) return null;
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    items.forEach((item) => {
      minLat = Math.min(minLat, item.latitude);
      maxLat = Math.max(maxLat, item.latitude);
      minLng = Math.min(minLng, item.longitude);
      maxLng = Math.max(maxLng, item.longitude);
    });

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }
}
