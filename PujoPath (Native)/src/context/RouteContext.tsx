import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pandal, RouteStop, RouteItinerary } from '@/types';
import { RouteOptimizer, RouteOptimizationResult } from '@/lib/services/RouteOptimizer';
import { estimateWalkingMinutes, calculateHaversineDistance } from '@/lib/geo';

interface RouteContextType {
  stops: RouteStop[];
  addStop: (pandal: Pandal) => void;
  removeStop: (pandalId: string) => void;
  isPandalInRoute: (pandalId: string) => boolean;
  clearRoute: () => void;
  optimizeRoute: (origin?: { lat: number; lng: number } | null) => RouteOptimizationResult | null;
  lastOptimizationResult: RouteOptimizationResult | null;
  reorderStops: (fromIndex: number, toIndex: number) => void;
  totalDistanceKm: number;
  favorites: string[];
  toggleFavorite: (pandalId: string) => void;
  isFavorite: (pandalId: string) => boolean;
  customStops: Pandal[];
  addCustomStop: (stop: Pandal) => void;
  savedRoutes: RouteItinerary[];
  saveCurrentRoute: (name?: string) => RouteItinerary | null;
  deleteSavedRoute: (id: string) => void;
  loadSavedRoute: (route: RouteItinerary) => void;
}

const RouteContext = createContext<RouteContextType>({
  stops: [],
  addStop: () => {},
  removeStop: () => {},
  isPandalInRoute: () => false,
  clearRoute: () => {},
  optimizeRoute: () => null,
  lastOptimizationResult: null,
  reorderStops: () => {},
  totalDistanceKm: 0,
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  customStops: [],
  addCustomStop: () => {},
  savedRoutes: [],
  saveCurrentRoute: () => null,
  deleteSavedRoute: () => {},
  loadSavedRoute: () => {},
});

const STORAGE_ROUTE_KEY = '@pujopath_app_route_stops';
const STORAGE_FAVORITES_KEY = '@pujopath_app_favorites';
const STORAGE_CUSTOM_STOPS_KEY = '@pujopath_app_custom_stops';
const STORAGE_SAVED_ROUTES_KEY = '@pujopath_saved_routes';

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customStops, setCustomStops] = useState<Pandal[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<RouteItinerary[]>([]);
  const [lastOptimizationResult, setLastOptimizationResult] = useState<RouteOptimizationResult | null>(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_ROUTE_KEY).then((data) => {
      if (data) {
        try {
          setStops(JSON.parse(data));
        } catch {}
      }
    });

    AsyncStorage.getItem(STORAGE_FAVORITES_KEY).then((data) => {
      if (data) {
        try {
          setFavorites(JSON.parse(data));
        } catch {}
      }
    });

    AsyncStorage.getItem(STORAGE_CUSTOM_STOPS_KEY).then((data) => {
      if (data) {
        try {
          setCustomStops(JSON.parse(data));
        } catch {}
      }
    });

    AsyncStorage.getItem(STORAGE_SAVED_ROUTES_KEY).then((data) => {
      if (data) {
        try {
          setSavedRoutes(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  const stopIdsSet = React.useMemo(() => new Set(stops.map((s) => s.pandalId)), [stops]);
  const favoritesSet = React.useMemo(() => new Set(favorites), [favorites]);

  const saveStops = React.useCallback((newStops: RouteStop[]) => {
    setStops(newStops);
    AsyncStorage.setItem(STORAGE_ROUTE_KEY, JSON.stringify(newStops));
  }, []);

  const addStop = React.useCallback((pandal: Pandal) => {
    setStops((prevStops) => {
      if (prevStops.some((s) => s.pandalId === pandal.id)) return prevStops;
      const newStop: RouteStop = {
        pandalId: pandal.id,
        pandal,
        order: prevStops.length,
      };
      const updated = [...prevStops, newStop];
      AsyncStorage.setItem(STORAGE_ROUTE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeStop = React.useCallback((pandalId: string) => {
    setStops((prevStops) => {
      const filtered = prevStops
        .filter((s) => s.pandalId !== pandalId)
        .map((s, idx) => ({ ...s, order: idx }));
      AsyncStorage.setItem(STORAGE_ROUTE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  const isPandalInRoute = React.useCallback((pandalId: string): boolean => {
    return stopIdsSet.has(pandalId);
  }, [stopIdsSet]);

  const clearRoute = React.useCallback(() => {
    setLastOptimizationResult(null);
    setStops([]);
    AsyncStorage.setItem(STORAGE_ROUTE_KEY, JSON.stringify([]));
  }, []);

  const reorderStops = React.useCallback((fromIndex: number, toIndex: number) => {
    setStops((prevStops) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= prevStops.length || toIndex >= prevStops.length) return prevStops;
      const updated = [...prevStops];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      const reindexed = updated.map((s, idx) => ({ ...s, order: idx }));
      AsyncStorage.setItem(STORAGE_ROUTE_KEY, JSON.stringify(reindexed));
      return reindexed;
    });
  }, []);

  const optimizeRoute = React.useCallback((origin?: { lat: number; lng: number } | null) => {
    if (stops.length <= 1) {
      return null;
    }
    const result = RouteOptimizer.optimizeStops(stops, origin);
    saveStops(result.optimizedStops);
    setLastOptimizationResult(result);
    return result;
  }, [stops, saveStops]);

  const toggleFavorite = React.useCallback((pandalId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(pandalId)
        ? prev.filter((id) => id !== pandalId)
        : [...prev, pandalId];
      AsyncStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = React.useCallback((pandalId: string) => {
    return favoritesSet.has(pandalId);
  }, [favoritesSet]);

  const addCustomStop = React.useCallback((stop: Pandal) => {
    setCustomStops((prev) => {
      const updated = [...prev, stop];
      AsyncStorage.setItem(STORAGE_CUSTOM_STOPS_KEY, JSON.stringify(updated));
      return updated;
    });
    addStop(stop);
  }, [addStop]);

  const saveCurrentRoute = React.useCallback((name?: string): RouteItinerary | null => {
    if (stops.length === 0) return null;
    let totalDist = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      totalDist += calculateHaversineDistance(
        stops[i].pandal.latitude,
        stops[i].pandal.longitude,
        stops[i + 1].pandal.latitude,
        stops[i + 1].pandal.longitude
      );
    }

    const newRoute: RouteItinerary = {
      id: `route-${Date.now()}`,
      name: name || `Puja Trail ${savedRoutes.length + 1}`,
      nameBn: `পুজো পরিক্রমা ${savedRoutes.length + 1}`,
      stops: [...stops],
      totalDistanceKm: totalDist,
      estimatedDurationMinutes: Math.round(estimateWalkingMinutes(totalDist) + stops.length * 25),
      suggestedTransitMode: totalDist > 3 ? 'Metro + Walking' : 'Walking',
      createdAt: new Date().toISOString(),
    };

    setSavedRoutes((prevRoutes) => {
      const updatedRoutes = [...prevRoutes, newRoute];
      AsyncStorage.setItem(STORAGE_SAVED_ROUTES_KEY, JSON.stringify(updatedRoutes));
      return updatedRoutes;
    });
    return newRoute;
  }, [stops, savedRoutes.length]);

  const deleteSavedRoute = React.useCallback((id: string) => {
    setSavedRoutes((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      AsyncStorage.setItem(STORAGE_SAVED_ROUTES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const loadSavedRoute = React.useCallback((route: RouteItinerary) => {
    saveStops(route.stops);
  }, [saveStops]);

  const totalDistanceKm = React.useMemo(() => {
    return RouteOptimizer.calculateTotalDistance(stops);
  }, [stops]);

  const contextValue = React.useMemo(
    () => ({
      stops,
      addStop,
      removeStop,
      isPandalInRoute,
      clearRoute,
      optimizeRoute,
      lastOptimizationResult,
      reorderStops,
      totalDistanceKm,
      favorites,
      toggleFavorite,
      isFavorite,
      customStops,
      addCustomStop,
      savedRoutes,
      saveCurrentRoute,
      deleteSavedRoute,
      loadSavedRoute,
    }),
    [
      stops,
      addStop,
      removeStop,
      isPandalInRoute,
      clearRoute,
      optimizeRoute,
      lastOptimizationResult,
      reorderStops,
      totalDistanceKm,
      favorites,
      toggleFavorite,
      isFavorite,
      customStops,
      addCustomStop,
      savedRoutes,
      saveCurrentRoute,
      deleteSavedRoute,
      loadSavedRoute,
    ]
  );

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => useContext(RouteContext);

