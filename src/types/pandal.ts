export type LocalityZone =
  | 'North Kolkata'
  | 'Central Kolkata'
  | 'South Kolkata'
  | 'Salt Lake'
  | 'New Town'
  | 'Howrah'
  | 'Behala'
  | 'Dum Dum';

export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Extreme';

export type PandalCategory = 'Traditional' | 'Artistic' | 'Theme' | 'Heritage' | 'Eco-Friendly' | 'Community';

export interface PandalFacility {
  wheelchairAccessible: boolean;
  drinkingWater: boolean;
  medicalBooth: boolean;
  vipPassEntry: boolean;
  parkingAvailable: boolean;
  foodStallsNearby?: boolean;
  publicToilets?: boolean;
  restArea?: boolean;
  emergencyExitCount?: number;
  volunteerCount?: number;
}

export interface MetroLink {
  stationId: string;
  stationName: string;
  stationNameBn?: string;
  walkingDistanceMeters: number;
  walkingDurationMinutes: number;
  exitGate?: string;
}

export type PandalMetroLink = MetroLink;

export interface Pandal {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  zone: LocalityZone;
  locality: string;
  localityBn: string;
  address: string;
  addressBn: string;
  latitude: number;
  longitude: number;
  theme: string;
  themeBn: string;
  category: PandalCategory;
  description: string;
  descriptionBn: string;
  history?: string;
  historyBn?: string;
  establishedYear?: number;
  openingTime: string;
  closingTime: string;
  crowdLevel: CrowdLevel;
  popularityScore: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  galleryImages: string[];
  isFeatured: boolean;
  isHeritage: boolean;
  metroLinks: MetroLink[];
  facilities: PandalFacility;
  highlights?: string[];
  highlightsBn?: string[];
  specialAttractions?: string[];
  distanceKm?: number;
}

export interface FilterOptions {
  searchQuery: string;
  zone: LocalityZone | 'All';
  crowdLevel: CrowdLevel | 'All';
  category: PandalCategory | 'All';
  metroAccessibleOnly: boolean;
  wheelchairAccessibleOnly: boolean;
  featuredOnly: boolean;
  heritageOnly: boolean;
  sortBy: 'recommended' | 'nearest' | 'popular' | 'rating' | 'leastCrowded' | 'name' | 'popularity' | 'distance';
}
