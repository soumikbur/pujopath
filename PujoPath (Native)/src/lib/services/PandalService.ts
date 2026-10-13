import { Pandal, FilterOptions, LocalityZone } from '@/types';
import { PANDALS_DATA } from '@/data/pandals';
import { calculateHaversineDistance } from '@/lib/geo';

export class PandalService {
  static getAllPandals(userLat?: number, userLng?: number, extraPandals?: Pandal[]): Pandal[] {
    const base = [...PANDALS_DATA, ...(extraPandals || [])];
    const hasValidCoords =
      typeof userLat === 'number' &&
      typeof userLng === 'number' &&
      !isNaN(userLat) &&
      !isNaN(userLng);

    if (hasValidCoords) {
      return base.map((p) => ({
        ...p,
        distanceKm: calculateHaversineDistance(userLat, userLng, p.latitude, p.longitude),
      }));
    }
    return base;
  }

  static getPandalBySlug(
    slug: string,
    userLat?: number,
    userLng?: number,
    extraPandals?: Pandal[]
  ): Pandal | null {
    const base = [...PANDALS_DATA, ...(extraPandals || [])];
    const found = base.find((p) => p.slug === slug || p.id === slug);
    if (!found) return null;

    const hasValidCoords =
      typeof userLat === 'number' &&
      typeof userLng === 'number' &&
      !isNaN(userLat) &&
      !isNaN(userLng);

    if (hasValidCoords) {
      return {
        ...found,
        distanceKm: calculateHaversineDistance(userLat, userLng, found.latitude, found.longitude),
      };
    }
    return found;
  }

  static filterPandals(
    options: Partial<FilterOptions>,
    userLat?: number,
    userLng?: number,
    extraPandals?: Pandal[]
  ): Pandal[] {
    let list = this.getAllPandals(userLat, userLng, extraPandals);

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.nameBn.includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.localityBn.includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.addressBn.includes(q) ||
          Boolean(p.neighborhood && p.neighborhood.toLowerCase().includes(q)) ||
          Boolean(p.neighborhoodBn && p.neighborhoodBn.includes(q)) ||
          Boolean(p.committeeName && p.committeeName.toLowerCase().includes(q)) ||
          Boolean(p.committeeNameBn && p.committeeNameBn.includes(q)) ||
          p.theme.toLowerCase().includes(q) ||
          p.themeBn.includes(q) ||
          p.zone.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.bonediBariInfo && (
            p.bonediBariInfo.ancestralHouseName.toLowerCase().includes(q) ||
            p.bonediBariInfo.familyLineage.toLowerCase().includes(q)
          )) ||
          p.metroLinks.some((m) => m.stationName.toLowerCase().includes(q) || Boolean(m.stationNameBn && m.stationNameBn.includes(q)))
        );
      });
    }


    if (options.zone && options.zone !== 'All') {
      list = list.filter((p) => p.zone === options.zone);
    }

    if (options.crowdLevel && options.crowdLevel !== 'All') {
      list = list.filter((p) => p.crowdLevel === options.crowdLevel);
    }

    if (options.category && options.category !== 'All') {
      list = list.filter((p) => p.category === options.category);
    }

    if (options.metroAccessibleOnly) {
      list = list.filter((p) => p.metroLinks.some((m) => m.walkingDistanceMeters <= 1000));
    }

    if (options.wheelchairAccessibleOnly) {
      list = list.filter((p) => p.facilities.wheelchairAccessible);
    }

    if (options.featuredOnly) {
      list = list.filter((p) => p.isFeatured);
    }

    if (options.heritageOnly) {
      list = list.filter((p) => p.isHeritage);
    }

    if (options.bonediBariOnly) {
      list = list.filter((p) => Boolean(p.isBonediBari || p.category === 'Bonedi Bari'));
    }

    const sortBy = options.sortBy || 'recommended';
    switch (sortBy) {
      case 'distance':
      case 'nearest':
        list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
        break;
      case 'popularity':
      case 'popular':
        list.sort((a, b) => b.popularityScore - a.popularityScore);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'leastCrowded': {
        const crowdOrder = { Low: 1, Moderate: 2, High: 3, Extreme: 4 };
        list.sort((a, b) => crowdOrder[a.crowdLevel] - crowdOrder[b.crowdLevel]);
        break;
      }
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recommended':
      default:
        list.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.popularityScore - a.popularityScore;
        });
        break;
    }

    return list;
  }

  static getNearbyPandals(pandal: Pandal, limit: number = 4): Pandal[] {
    return PANDALS_DATA.filter((p) => p.id !== pandal.id)
      .map((p) => ({
        ...p,
        distanceKm: calculateHaversineDistance(pandal.latitude, pandal.longitude, p.latitude, p.longitude),
      }))
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
      .slice(0, limit);
  }

  static getPandalsByZone(zone: LocalityZone): Pandal[] {
    return PANDALS_DATA.filter((p) => p.zone === zone);
  }

  static getBonediBariPandals(): Pandal[] {
    return PANDALS_DATA.filter((p) => Boolean(p.isBonediBari || p.category === 'Bonedi Bari'));
  }
}

