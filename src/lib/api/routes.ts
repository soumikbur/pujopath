import { RouteItinerary, RouteStop } from '@/types';
import { PANDALS_DATA } from '@/data/pandals';
import { calculateHaversineDistance, estimateWalkingMinutes } from '@/lib/geo';

export function calculateRouteItinerary(pandalIds: string[], name?: string): RouteItinerary {
  const stops: RouteStop[] = [];
  pandalIds.forEach((id: string, idx: number) => {
    const pandal = PANDALS_DATA.find((p) => p.id === id);
    if (pandal) {
      stops.push({
        pandalId: pandal.id,
        pandal,
        order: idx,
      });
    }
  });

  let totalDist = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    totalDist += calculateHaversineDistance(
      stops[i].pandal.latitude,
      stops[i].pandal.longitude,
      stops[i + 1].pandal.latitude,
      stops[i + 1].pandal.longitude
    );
  }

  const totalDistanceKm = Math.round(totalDist * 10) / 10;
  const estimatedDurationMinutes = estimateWalkingMinutes(totalDistanceKm) + stops.length * 30;

  return {
    id: 'route-' + Date.now(),
    name: name || `Pujo Trail (${stops.length} Pandals)`,
    createdAt: new Date().toISOString(),
    stops,
    totalDistanceKm,
    estimatedDurationMinutes,
    suggestedTransitMode: totalDistanceKm > 4 ? 'Metro + Walking' : 'Walking',
  };
}
