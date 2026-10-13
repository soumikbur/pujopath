/**
 * Calculate the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function estimateWalkingMinutes(distanceKm: number): number {
  return Math.max(1, Math.round((distanceKm / 3.5) * 60));
}

export function estimateTransitMinutes(distanceKm: number): number {
  return Math.max(5, Math.round(8 + distanceKm * 3.5));
}
