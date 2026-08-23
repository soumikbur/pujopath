'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pandal, RouteItinerary, RouteStop } from '@/types';
import { PANDALS_DATA } from '@/data/pandals';
import { calculateHaversineDistance, estimateWalkingMinutes } from '@/lib/geo';

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
  optimizeCurrentRoute: () => void;
  clearCurrentRoute: () => void;
  saveCurrentRoute: (name?: string) => RouteItinerary;
  savedRoutes: RouteItinerary[];
  deleteSavedRoute: (id: string) => void;
  loadSavedRoute: (route: RouteItinerary) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [savedPandalIds, setSavedPandalIds] = useState<string[]>([]);
  const [savedTrackIds, setSavedTrackIds] = useState<string[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<RouteItinerary[]>([]);
  const [currentRouteStops, setCurrentRouteStops] = useState<RouteStop[]>([]);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const savedPandals = localStorage.getItem('pujopath_saved_pandals');
      if (savedPandals) setSavedPandalIds(JSON.parse(savedPandals));

      const savedTracks = localStorage.getItem('pujopath_saved_tracks');
      if (savedTracks) setSavedTrackIds(JSON.parse(savedTracks));

      const routes = localStorage.getItem('pujopath_saved_routes');
      if (routes) setSavedRoutes(JSON.parse(routes));

      const activeRoute = localStorage.getItem('pujopath_active_route');
      if (activeRoute) {
        const parsedStops: RouteStop[] = JSON.parse(activeRoute);
        const hydrated = parsedStops
          .map((s, idx) => {
            const found = PANDALS_DATA.find((p) => p.id === s.pandalId);
            return found ? { ...s, pandal: found, order: idx } : null;
          })
          .filter(Boolean) as RouteStop[];
        setCurrentRouteStops(hydrated);
      }
    } catch {
      // ignore
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
    if (fromIndex < 0 || fromIndex >= currentRouteStops.length || toIndex < 0 || toIndex >= currentRouteStops.length) return;
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

  const optimizeCurrentRoute = () => {
    if (currentRouteStops.length <= 2) return;
    const remaining = [...currentRouteStops];
    const optimized: RouteStop[] = [];
    let current = remaining.shift()!;
    optimized.push(current);

    while (remaining.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const dist = calculateHaversineDistance(
          current.pandal.latitude,
          current.pandal.longitude,
          remaining[i].pandal.latitude,
          remaining[i].pandal.longitude
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }
      current = remaining.splice(nearestIdx, 1)[0];
      optimized.push(current);
    }

    const reindexed = optimized.map((s, idx) => ({ ...s, order: idx }));
    setCurrentRouteStops(reindexed);
    try {
      localStorage.setItem('pujopath_active_route', JSON.stringify(reindexed));
    } catch {
      // ignore
    }
  };

  const clearCurrentRoute = () => {
    setCurrentRouteStops([]);
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
        clearCurrentRoute,
        saveCurrentRoute,
        savedRoutes,
        deleteSavedRoute,
        loadSavedRoute,
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
