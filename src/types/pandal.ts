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

export type PandalCategory =
  | 'Traditional'
  | 'Artistic'
  | 'Theme'
  | 'Heritage'
  | 'Eco-Friendly'
  | 'Community'
  | 'Bonedi Bari';

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

export interface BonediBariDetails {
  ancestralHouseName: string;
  ancestralHouseNameBn?: string;
  familyLineage: string;
  familyLineageBn?: string;
  visitorAccessStatus: 'Visitor access confirmed' | 'Visitor access not confirmed';
  visitorAccessStatusBn: string;
  visitingHours?: string;
  visitingHoursBn?: string;
  sourceUrl?: string;
  verificationDate?: string;
  confidence: 'Verified' | 'High' | 'Moderate';
}

export interface PandalPhotoMetadata {
  pandalId: string;
  imageUrl: string;
  isAvailable: boolean;
  photoYear: number | null;
  verificationStatus: 'Verified 2025' | 'Photo Unavailable';
  photographer?: string;
  sourceName: string;
  sourceUrl?: string;
  license?: string;
  verifiedDate: string;
  notes?: string;
}

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
  hasVerifiedPhoto?: boolean;
  photoMetadata?: PandalPhotoMetadata;
  galleryImages: string[];
  isFeatured: boolean;
  isHeritage: boolean;
  isBonediBari?: boolean;
  bonediBariInfo?: BonediBariDetails;
  metroLinks: MetroLink[];
  facilities: PandalFacility;
  highlights?: string[];
  highlightsBn?: string[];
  specialAttractions?: string[];
  distanceKm?: number;
  isCustom?: boolean;
  isUserAdded?: boolean;
  hasUnresolvedCoordinates?: boolean;
  addedAt?: string;
  committeeName?: string;
  committeeNameBn?: string;
  neighborhood?: string;
  neighborhoodBn?: string;
  themeYear?: number;
  sourceUrl?: string;
  sourceName?: string;
  verificationDate?: string;
  coordinateConfidence?: 'High' | 'Approximate' | 'Needs verification';
  verificationStatus?: 'Verified' | 'Partially verified' | 'Needs coordinate verification' | 'Historical listing' | 'Visitor access unconfirmed';
  visitorAccessStatus?: string;
  visitorAccessStatusBn?: string;
  heritageClassification?: string;
  isCommunitySubmitted?: boolean;
  submittedBy?: string;
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
  bonediBariOnly?: boolean;
  sortBy: 'recommended' | 'nearest' | 'popular' | 'rating' | 'leastCrowded' | 'name' | 'popularity' | 'distance';
}

