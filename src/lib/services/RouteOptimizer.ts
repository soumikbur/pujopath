import { RouteStop } from '@/types';
import { calculateHaversineDistance } from '@/lib/geo';
import { isValidCoordinate } from '@/lib/maps/navigationUrl';

export interface RouteOptimizationResult {
  optimizedStops: RouteStop[];
  originalDistanceKm: number;
  optimizedDistanceKm: number;
  savingsKm: number;
  savingsPercent: number;
  hasUnresolvedStops: boolean;
  unresolvedCount: number;
  unresolvedStopNames: string[];
}

export class RouteOptimizer {
  /**
   * Calculates total great-circle distance along a sequence of stops,
   * optionally accounting for an external starting origin point.
   */
  static calculateTotalDistance(
    stops: RouteStop[],
    origin?: { lat: number; lng: number } | null
  ): number {
    if (!stops || stops.length === 0) return 0;

    let dist = 0;
    const valid = stops.filter((s) =>
      isValidCoordinate(s.pandal?.latitude, s.pandal?.longitude)
    );

    if (valid.length === 0) return 0;

    if (origin && isValidCoordinate(origin.lat, origin.lng)) {
      dist += calculateHaversineDistance(
        origin.lat,
        origin.lng,
        valid[0].pandal.latitude,
        valid[0].pandal.longitude
      );
    }

    for (let i = 0; i < valid.length - 1; i++) {
      dist += calculateHaversineDistance(
        valid[i].pandal.latitude,
        valid[i].pandal.longitude,
        valid[i + 1].pandal.latitude,
        valid[i + 1].pandal.longitude
      );
    }

    return dist;
  }

  /**
   * Optimizes route stops using a 2-stage algorithm:
   * 1. Nearest-Neighbor Heuristic to cluster geographically adjacent neighborhoods.
   * 2. 2-Opt Local Search to eliminate intersecting paths and avoid ping-ponging across Kolkata.
   *
   * Crucial guarantees:
   * - Preserves EVERY selected stop (never discards any destination).
   * - Respects the user's origin (GPS, Metro station, or designated first stop).
   * - Safely isolates stops without valid coordinates and places them at the end with a warning.
   */
  static optimizeStops(
    stops: RouteStop[],
    origin?: { lat: number; lng: number } | null
  ): RouteOptimizationResult {
    if (!stops || stops.length === 0) {
      return {
        optimizedStops: [],
        originalDistanceKm: 0,
        optimizedDistanceKm: 0,
        savingsKm: 0,
        savingsPercent: 0,
        hasUnresolvedStops: false,
        unresolvedCount: 0,
        unresolvedStopNames: [],
      };
    }

    // Partition into stops with verified coordinates vs stops with unresolved coordinates
    const validStops: RouteStop[] = [];
    const unresolvedStops: RouteStop[] = [];

    stops.forEach((stop) => {
      if (isValidCoordinate(stop.pandal?.latitude, stop.pandal?.longitude)) {
        validStops.push({ ...stop });
      } else {
        unresolvedStops.push({ ...stop });
      }
    });

    const originalDistanceKm = this.calculateTotalDistance(stops, origin);

    // If 2 or fewer valid stops, nearest-neighbor and 2-opt have no permutations to improve
    if (validStops.length <= 2) {
      const combined = [...validStops, ...unresolvedStops].map((s, idx) => ({
        ...s,
        order: idx,
      }));
      const optimizedDistanceKm = this.calculateTotalDistance(combined, origin);
      const savingsKm = Math.max(0, originalDistanceKm - optimizedDistanceKm);
      const savingsPercent =
        originalDistanceKm > 0 ? Math.round((savingsKm / originalDistanceKm) * 100) : 0;

      return {
        optimizedStops: combined,
        originalDistanceKm: parseFloat(originalDistanceKm.toFixed(2)),
        optimizedDistanceKm: parseFloat(optimizedDistanceKm.toFixed(2)),
        savingsKm: parseFloat(savingsKm.toFixed(2)),
        savingsPercent,
        hasUnresolvedStops: unresolvedStops.length > 0,
        unresolvedCount: unresolvedStops.length,
        unresolvedStopNames: unresolvedStops.map((s) => s.pandal?.name || 'Custom Pandal'),
      };
    }

    // ─────────────────────────────────────────────────────────────
    // STAGE 1: Nearest-Neighbor Construction Heuristic
    // ─────────────────────────────────────────────────────────────
    const pool = [...validStops];
    const tour: RouteStop[] = [];

    let currentRef: { lat: number; lng: number };

    if (origin && isValidCoordinate(origin.lat, origin.lng)) {
      // Find the pandal closest to the origin to initiate the tour
      let bestIdx = 0;
      let minOriginDist = Infinity;
      for (let i = 0; i < pool.length; i++) {
        const d = calculateHaversineDistance(
          origin.lat,
          origin.lng,
          pool[i].pandal.latitude,
          pool[i].pandal.longitude
        );
        if (d < minOriginDist) {
          minOriginDist = d;
          bestIdx = i;
        }
      }
      const first = pool.splice(bestIdx, 1)[0];
      tour.push(first);
      currentRef = { lat: first.pandal.latitude, lng: first.pandal.longitude };
    } else {
      // If no explicit external origin, fix the user's chosen first stop
      const first = pool.shift()!;
      tour.push(first);
      currentRef = { lat: first.pandal.latitude, lng: first.pandal.longitude };
    }

    // Greedily append the nearest unvisited pandal
    while (pool.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < pool.length; i++) {
        const dist = calculateHaversineDistance(
          currentRef.lat,
          currentRef.lng,
          pool[i].pandal.latitude,
          pool[i].pandal.longitude
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }
      const nextStop = pool.splice(nearestIdx, 1)[0];
      tour.push(nextStop);
      currentRef = { lat: nextStop.pandal.latitude, lng: nextStop.pandal.longitude };
    }

    // ─────────────────────────────────────────────────────────────
    // STAGE 2: 2-Opt Local Search Improvement
    // Untangles cross-cutting segments and removes city-wide ping-ponging
    // ─────────────────────────────────────────────────────────────
    let improved = true;
    let iteration = 0;
    const maxIterations = 100;
    const n = tour.length;

    while (improved && iteration < maxIterations) {
      improved = false;
      iteration++;

      // We maintain the start stop (index 0) and evaluate 2-opt reversals for subsegments [i, j]
      for (let i = 1; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          const pA = tour[i - 1].pandal;
          const pB = tour[i].pandal;
          const pC = tour[j].pandal;
          const pD = j + 1 < n ? tour[j + 1].pandal : null;

          const currentCost =
            calculateHaversineDistance(pA.latitude, pA.longitude, pB.latitude, pB.longitude) +
            (pD ? calculateHaversineDistance(pC.latitude, pC.longitude, pD.latitude, pD.longitude) : 0);

          const reversedCost =
            calculateHaversineDistance(pA.latitude, pA.longitude, pC.latitude, pC.longitude) +
            (pD ? calculateHaversineDistance(pB.latitude, pB.longitude, pD.latitude, pD.longitude) : 0);

          const delta = reversedCost - currentCost;

          // If reversing segment [i...j] reduces cumulative travel
          if (delta < -0.0001) {
            // Reverse tour between index i and j (inclusive)
            let left = i;
            let right = j;
            while (left < right) {
              const temp = tour[left];
              tour[left] = tour[right];
              tour[right] = temp;
              left++;
              right--;
            }
            improved = true;
            break; // Restart scan after an improvement
          }
        }
        if (improved) break;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // STAGE 3: Recombination & Indexing
    // Append unresolved stops at the end so no stop is ever omitted
    // ─────────────────────────────────────────────────────────────
    const finalStops = [...tour, ...unresolvedStops].map((s, idx) => ({
      ...s,
      order: idx,
    }));

    const optimizedDistanceKm = this.calculateTotalDistance(finalStops, origin);
    const savingsKm = Math.max(0, originalDistanceKm - optimizedDistanceKm);
    const savingsPercent =
      originalDistanceKm > 0 ? Math.round((savingsKm / originalDistanceKm) * 100) : 0;

    return {
      optimizedStops: finalStops,
      originalDistanceKm: parseFloat(originalDistanceKm.toFixed(2)),
      optimizedDistanceKm: parseFloat(optimizedDistanceKm.toFixed(2)),
      savingsKm: parseFloat(savingsKm.toFixed(2)),
      savingsPercent,
      hasUnresolvedStops: unresolvedStops.length > 0,
      unresolvedCount: unresolvedStops.length,
      unresolvedStopNames: unresolvedStops.map((s) => s.pandal?.name || 'Custom Pandal'),
    };
  }
}
