'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pandal, RouteItinerary, RouteStop, LocalityZone } from '@/types';
import { PANDALS_DATA } from '@/data/pandals';
import { calculateHaversineDistance, estimateWalkingMinutes } from '@/lib/geo';
import { RouteOptimizer, RouteOptimizationResult } from '@/lib/services/RouteOptimizer';

interface CustomPandalInput {
  name: string;
  nameBn?: string;
  address: string;
  addressBn?: string;
  locality?: string;
  localityBn?: string;
  zone?: LocalityZone;
  latitude?: number;
  longitude?: number;
  hasUnresolvedCoordinates?: boolean;
}

interface FavoritesContextType {
  savedPandalIds: string[];
  isPandalSaved: (id: string) => boolean;
  toggleSavePandal: (id: string) => void;
  savedTrackIds: string[];
  isTrackSaved: (id: string) => boolean;
  toggleSaveTrack: (id: string) => void;
  currentRouteStops: RouteStop[];
  addPandalToRoute: (pandal: Pandal) => boolean;
  removePandalFromRoute: (pandalId: string) => void;
  moveRouteStop: (fromIndex: number, toIndex: number) => void;
  isPandalInRoute: (pandalId: string) => boolean;
  optimizeCurrentRoute: (origin?: { lat: number; lng: number } | null) => RouteOptimizationResult | null;
  lastOptimizationResult: RouteOptimizationResult | null;
  clearCurrentRoute: () => void;
  saveCurrentRoute: (name?: string) => RouteItinerary;
  savedRoutes: RouteItinerary[];
  deleteSavedRoute: (id: string) => void;
  loadSavedRoute: (route: RouteItinerary) => void;
  // Custom Pandal Store
  customPandals: Pandal[];
  addCustomPandal: (input: CustomPandalInput, addToActiveRoute?: boolean) => Pandal;
  removeCustomPandal: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [savedPandalIds, setSavedPandalIds] = useState<string[]>([]);
  const [savedTrackIds, setSavedTrackIds] = useState<string[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<RouteItinerary[]>([]);
  const [currentRouteStops, setCurrentRouteStops] = useState<RouteStop[]>([]);
  const [customPandals, setCustomPandals] = useState<Pandal[]>([]);
  const [lastOptimizationResult, setLastOptimizationResult] = useState<RouteOptimizationResult | null>(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      const savedPandals = localStorage.getItem('pujopath_saved_pandals');
      if (savedPandals) setSavedPandalIds(JSON.parse(savedPandals));

      const savedTracks = localStorage.getItem('pujopath_saved_tracks');
      if (savedTracks) setSavedTrackIds(JSON.parse(savedTracks));

      const routes = localStorage.getItem('pujopath_saved_routes');
      if (routes) setSavedRoutes(JSON.parse(routes));

      // Hydrate custom user-added pandals
      const savedCustom = localStorage.getItem('pujopath_custom_pandals');
      const loadedCustom: Pandal[] = savedCustom ? JSON.parse(savedCustom) : [];
      setCustomPandals(loadedCustom);

      // Hydrate active route stops (looking in both static pandals and custom pandals)
      const allPandals = [...PANDALS_DATA, ...loadedCustom];
      const activeRoute = localStorage.getItem('pujopath_active_route');
      if (activeRoute) {
        const parsedStops: RouteStop[] = JSON.parse(activeRoute);
        const hydrated = parsedStops
          .map((s, idx) => {
            const found = allPandals.find((p) => p.id === s.pandalId) || s.pandal;
            return found ? { ...s, pandal: found, order: idx } : null;
          })
          .filter(Boolean) as RouteStop[];
        setCurrentRouteStops(hydrated);
      }
    } catch {
      // Storage hydration failure recovery
    }
  }, []);

  const toggleSavePandal = (id: string) => {
    setSavedPandalIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pujopath_saved_pandals', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isPandalSaved = (id: string) => savedPandalIds.includes(id);

  const toggleSaveTrack = (id: string) => {
    setSavedTrackIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pujopath_saved_tracks', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isTrackSaved = (id: string) => savedTrackIds.includes(id);

  const isPandalInRoute = (pandalId: string) => currentRouteStops.some((s) => s.pandalId === pandalId);

  const addPandalToRoute = (pandal: Pandal): boolean => {
    if (isPandalInRoute(pandal.id)) return false;
    const newStop: RouteStop = {
      pandalId: pandal.id,
      pandal,
      order: currentRouteStops.length,
    };
    const updated = [...currentRouteStops, newStop];
    setCurrentRouteStops(updated);
    try {
      localStorage.setItem('pujopath_active_route', JSON.stringify(updated));
    } catch {
      // ignore
    }
    return true;
  };

  const removePandalFromRoute = (pandalId: string) => {
    const updated = currentRouteStops
      .filter((s) => s.pandalId !== pandalId)
      .map((s, idx) => ({ ...s, order: idx }));
    setCurrentRouteStops(updated);
    try {
      localStorage.setItem('pujopath_active_route', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const moveRouteStop = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= currentRouteStops.length ||
      toIndex < 0 ||
      toIndex >= currentRouteStops.length
    )
      return;
    const copy = [...currentRouteStops];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    const updated = copy.map((s, idx) => ({ ...s, order: idx }));
    setCurrentRouteStops(updated);
    try {
      localStorage.setItem('pujopath_active_route', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Add custom user pandal with stable ID
  const addCustomPandal = (input: CustomPandalInput, addToActiveRoute: boolean = true): Pandal => {
    const customId = `custom-pandal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const slug = `custom-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'pandal'}-${Date.now().toString().slice(-4)}`;

    const hasCoords =
      typeof input.latitude === 'number' &&
      typeof input.longitude === 'number' &&
      !isNaN(input.latitude) &&
      !isNaN(input.longitude);

    const newPandal: Pandal = {
      id: customId,
      slug,
      name: input.name,
      nameBn: input.nameBn || input.name,
      zone: input.zone || 'Central Kolkata',
      locality: input.locality || input.address.split(',')[0].trim() || 'Kolkata',
      localityBn: input.localityBn || input.locality || 'কলকাতা',
      address: input.address,
      addressBn: input.addressBn || input.address,
      latitude: hasCoords ? input.latitude! : 0,
      longitude: hasCoords ? input.longitude! : 0,
      theme: 'Community Durgotsav',
      themeBn: 'সার্বজনীন দুর্গোৎসব',
      category: 'Community',
      description: `User-added Durga Puja destination at ${input.address}.`,
      descriptionBn: `ব্যবহারকারী কর্তৃক যুক্ত দুর্গাপূজা মণ্ডপ। ঠিকানা: ${input.address}।`,
      openingTime: '06:00',
      closingTime: '02:00',
      crowdLevel: 'Moderate',
      popularityScore: 75,
      rating: 4.5,
      reviewCount: 1,
      imageUrl: '',
      hasVerifiedPhoto: false,
      photoMetadata: {
        pandalId: customId,
        imageUrl: '',
        isAvailable: false,
        photoYear: null,
        verificationStatus: 'Photo Unavailable',
        sourceName: 'User Added Custom Listing',
        verifiedDate: new Date().toISOString().split('T')[0],
        notes: 'Custom pandal awaiting 2025 photograph verification.',
      },
      galleryImages: [],
      isFeatured: false,
      isHeritage: false,
      facilities: {
        wheelchairAccessible: true,
        drinkingWater: true,
        medicalBooth: false,
        vipPassEntry: false,
        parkingAvailable: false,
      },
      metroLinks: [],
      isCustom: true,
      isUserAdded: true,
      hasUnresolvedCoordinates: !hasCoords || Boolean(input.hasUnresolvedCoordinates),
      addedAt: new Date().toISOString(),
    };

    const updatedCustom = [newPandal, ...customPandals];
    setCustomPandals(updatedCustom);
    try {
      localStorage.setItem('pujopath_custom_pandals', JSON.stringify(updatedCustom));
    } catch {
      // ignore
    }

    if (addToActiveRoute) {
      addPandalToRoute(newPandal);
    }

    return newPandal;
  };

  const removeCustomPandal = (id: string) => {
    const updatedCustom = customPandals.filter((p) => p.id !== id);
    setCustomPandals(updatedCustom);
    try {
      localStorage.setItem('pujopath_custom_pandals', JSON.stringify(updatedCustom));
    } catch {
      // ignore
    }
    removePandalFromRoute(id);
  };

  // Smart route optimization using RouteOptimizer (Nearest Neighbor + 2-Opt)
  const optimizeCurrentRoute = (origin?: { lat: number; lng: number } | null) => {
    if (currentRouteStops.length <= 1) return null;

    const result = RouteOptimizer.optimizeStops(currentRouteStops, origin);
    setCurrentRouteStops(result.optimizedStops);
    setLastOptimizationResult(result);

    try {
      localStorage.setItem('pujopath_active_route', JSON.stringify(result.optimizedStops));
    } catch {
      // ignore
    }

    return result;
  };

  const clearCurrentRoute = () => {
    setCurrentRouteStops([]);
    setLastOptimizationResult(null);
    try {
      localStorage.removeItem('pujopath_active_route');
    } catch {
      // ignore
    }
  };

  const saveCurrentRoute = (name?: string): RouteItinerary => {
    let totalDist = 0;
    for (let i = 0; i < currentRouteStops.length - 1; i++) {
      totalDist += calculateHaversineDistance(
        currentRouteStops[i].pandal.latitude,
        currentRouteStops[i].pandal.longitude,
        currentRouteStops[i + 1].pandal.latitude,
        currentRouteStops[i + 1].pandal.longitude
      );
    }

    const newRoute: RouteItinerary = {
      id: `route-${Date.now()}`,
      name: name || `Puja Trail ${savedRoutes.length + 1}`,
      stops: currentRouteStops,
      totalDistanceKm: totalDist,
      estimatedDurationMinutes: estimateWalkingMinutes(totalDist) + currentRouteStops.length * 25,
      suggestedTransitMode: totalDist > 3 ? 'Metro + Walking' : 'Walking',
      createdAt: new Date().toISOString(),
    };

    const updatedRoutes = [...savedRoutes, newRoute];
    setSavedRoutes(updatedRoutes);
    try {
      localStorage.setItem('pujopath_saved_routes', JSON.stringify(updatedRoutes));
    } catch {
      // ignore
    }
    return newRoute;
  };

  const deleteSavedRoute = (id: string) => {
    const updated = savedRoutes.filter((r) => r.id !== id);
    setSavedRoutes(updated);
    try {
      localStorage.setItem('pujopath_saved_routes', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const loadSavedRoute = (route: RouteItinerary) => {
    setCurrentRouteStops(route.stops);
    try {
      localStorage.setItem('pujopath_active_route', JSON.stringify(route.stops));
    } catch {
      // ignore
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        savedPandalIds,
        isPandalSaved,
        toggleSavePandal,
        savedTrackIds,
        isTrackSaved,
        toggleSaveTrack,
        currentRouteStops,
        addPandalToRoute,
        removePandalFromRoute,
        moveRouteStop,
        isPandalInRoute,
        optimizeCurrentRoute,
        lastOptimizationResult,
        clearCurrentRoute,
        saveCurrentRoute,
        savedRoutes,
        deleteSavedRoute,
        loadSavedRoute,
        customPandals,
        addCustomPandal,
        removeCustomPandal,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
