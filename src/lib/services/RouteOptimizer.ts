import { RouteStop } from '@/types';
import { calculateHaversineDistance } from '@/lib/geo';

export class RouteOptimizer {
  static optimizeStops(stops: RouteStop[]): RouteStop[] {
    if (stops.length <= 2) return stops;

    const unvisited = [...stops];
    const optimized: RouteStop[] = [];

    let current = unvisited.shift()!;
    optimized.push({ ...current, order: 0 });

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const candidate = unvisited[i];
        const dist = calculateHaversineDistance(
          current.pandal.latitude,
          current.pandal.longitude,
          candidate.pandal.latitude,
          candidate.pandal.longitude
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      current = unvisited.splice(nearestIdx, 1)[0];
      optimized.push({ ...current, order: optimized.length });
    }

    return optimized;
  }
}
