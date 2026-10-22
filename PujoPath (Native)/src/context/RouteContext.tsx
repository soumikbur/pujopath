import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pandal, RouteStop, RouteItinerary } from '@/types';
import { RouteOptimizer, RouteOptimizationResult } from '@/lib/services/RouteOptimizer';
import { estimateWalkingMinutes, calculateHaversineDistance } from '@/lib/geo';
import { useFestival } from '@/context/FestivalContext';

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

const STORAGE_ROUTE_KEY_LEGACY = '@pujopath_app_route_stops';
const STORAGE_ROUTE_KEY_DURGA = '@pujopath_route_stops_durga';
const STORAGE_ROUTE_KEY_KALI = '@pujopath_route_stops_kali';
const STORAGE_FAVORITES_KEY = '@pujopath_app_favorites';
const STORAGE_CUSTOM_STOPS_KEY = '@pujopath_app_custom_stops';
const STORAGE_SAVED_ROUTES_KEY = '@pujopath_saved_routes';

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeFestival } = useFestival();
  const currentFestival: 'durga' | 'kali' = activeFestival === 'kali' ? 'kali' : 'durga';

  const [durgaStops, setDurgaStops] = useState<RouteStop[]>([]);
  const [kaliStops, setKaliStops] = useState<RouteStop[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allCustomStops, setAllCustomStops] = useState<Pandal[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<RouteItinerary[]>([]);
  const [lastOptimizationResult, setLastOptimizationResult] = useState<RouteOptimizationResult | null>(null);

  // Load from AsyncStorage on mount with migration support
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_ROUTE_KEY_DURGA),
      AsyncStorage.getItem(STORAGE_ROUTE_KEY_KALI),
      AsyncStorage.getItem(STORAGE_ROUTE_KEY_LEGACY),
      AsyncStorage.getItem(STORAGE_FAVORITES_KEY),
      AsyncStorage.getItem(STORAGE_CUSTOM_STOPS_KEY),
      AsyncStorage.getItem(STORAGE_SAVED_ROUTES_KEY),
    ]).then(([durgaData, kaliData, legacyData, favsData, customData, routesData]) => {
      let loadedDurga: RouteStop[] = [];
      let loadedKali: RouteStop[] = [];

      if (durgaData) {
        try {
          loadedDurga = JSON.parse(durgaData);
        } catch {}
      }
      if (kaliData) {
        try {
          loadedKali = JSON.parse(kaliData);
        } catch {}
      }

      // If festival-specific lists are empty, check legacy storage and migrate partitioned
      if (loadedDurga.length === 0 && loadedKali.length === 0 && legacyData) {
        try {
          const legacy: RouteStop[] = JSON.parse(legacyData);
          legacy.forEach((s) => {
            const isK =
              s.pandal?.festival === 'kali' ||
              s.pandalId.startsWith('kali-');
            if (isK) {
              loadedKali.push(s);
            } else {
              loadedDurga.push(s);
            }
          });
          AsyncStorage.setItem(STORAGE_ROUTE_KEY_DURGA, JSON.stringify(loadedDurga));
          AsyncStorage.setItem(STORAGE_ROUTE_KEY_KALI, JSON.stringify(loadedKali));
        } catch {}
      }

      setDurgaStops(loadedDurga);
      setKaliStops(loadedKali);

      if (favsData) {
        try {
          setFavorites(JSON.parse(favsData));
        } catch {}
      }

      if (customData) {
        try {
          setAllCustomStops(JSON.parse(customData));
        } catch {}
      }

      if (routesData) {
        try {
          setSavedRoutes(JSON.parse(routesData));
        } catch {}
      }
    });
  }, []);

  // Active stops strictly mapped to active festival
  const activeStops = currentFestival === 'kali' ? kaliStops : durgaStops;
  const stopIdsSet = useMemo(() => new Set(activeStops.map((s) => s.pandalId)), [activeStops]);
  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  // Filter custom stops so they only appear in the festival they were created in
  const customStops = useMemo(() => {
    return allCustomStops.filter((p) => {
      if (currentFestival === 'kali') {
        return p.festival === 'kali' || p.id.startsWith('kali-');
      }
      return p.festival !== 'kali' && !p.id.startsWith('kali-');
    });
  }, [allCustomStops, currentFestival]);

  const saveFestivalStops = useCallback(
    (festival: 'durga' | 'kali', newStops: RouteStop[]) => {
      if (festival === 'kali') {
        setKaliStops(newStops);
        AsyncStorage.setItem(STORAGE_ROUTE_KEY_KALI, JSON.stringify(newStops));
      } else {
        setDurgaStops(newStops);
        AsyncStorage.setItem(STORAGE_ROUTE_KEY_DURGA, JSON.stringify(newStops));
      }
    },
    []
  );

  const addStop = useCallback(
    (pandal: Pandal) => {
      const isPandalKali = pandal.festival === 'kali' || pandal.id.startsWith('kali-');
      const targetFestival: 'durga' | 'kali' = isPandalKali ? 'kali' : 'durga';

      if (targetFestival === 'kali') {
        setKaliStops((prev) => {
          if (prev.some((s) => s.pandalId === pandal.id)) return prev;
          const newStop: RouteStop = {
            pandalId: pandal.id,
            pandal: { ...pandal, festival: 'kali' },
            order: prev.length,
          };
          const updated = [...prev, newStop];
          AsyncStorage.setItem(STORAGE_ROUTE_KEY_KALI, JSON.stringify(updated));
          return updated;
        });
      } else {
        setDurgaStops((prev) => {
          if (prev.some((s) => s.pandalId === pandal.id)) return prev;
          const newStop: RouteStop = {
            pandalId: pandal.id,
            pandal: { ...pandal, festival: 'durga' },
            order: prev.length,
          };
          const updated = [...prev, newStop];
          AsyncStorage.setItem(STORAGE_ROUTE_KEY_DURGA, JSON.stringify(updated));
          return updated;
        });
      }
    },
    []
  );

  const removeStop = useCallback(
    (pandalId: string) => {
      if (currentFestival === 'kali') {
        setKaliStops((prev) => {
          const filtered = prev
            .filter((s) => s.pandalId !== pandalId)
            .map((s, idx) => ({ ...s, order: idx }));
          AsyncStorage.setItem(STORAGE_ROUTE_KEY_KALI, JSON.stringify(filtered));
          return filtered;
        });
      } else {
        setDurgaStops((prev) => {
          const filtered = prev
            .filter((s) => s.pandalId !== pandalId)
            .map((s, idx) => ({ ...s, order: idx }));
          AsyncStorage.setItem(STORAGE_ROUTE_KEY_DURGA, JSON.stringify(filtered));
          return filtered;
        });
      }
    },
    [currentFestival]
  );

  const isPandalInRoute = useCallback(
    (pandalId: string): boolean => {
      return stopIdsSet.has(pandalId);
    },
    [stopIdsSet]
  );

  const clearRoute = useCallback(() => {
    setLastOptimizationResult(null);
    if (currentFestival === 'kali') {
      setKaliStops([]);
      AsyncStorage.setItem(STORAGE_ROUTE_KEY_KALI, JSON.stringify([]));
    } else {
      setDurgaStops([]);
      AsyncStorage.setItem(STORAGE_ROUTE_KEY_DURGA, JSON.stringify([]));
    }
  }, [currentFestival]);

  const reorderStops = useCallback(
    (fromIndex: number, toIndex: number) => {
      const targetList = currentFestival === 'kali' ? kaliStops : durgaStops;
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= targetList.length ||
        toIndex >= targetList.length
      ) {
        return;
      }
      const updated = [...targetList];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      const reindexed = updated.map((s, idx) => ({ ...s, order: idx }));
      saveFestivalStops(currentFestival, reindexed);
    },
    [currentFestival, kaliStops, durgaStops, saveFestivalStops]
  );

  const optimizeRoute = useCallback(
    (origin?: { lat: number; lng: number } | null) => {
      if (activeStops.length <= 1) {
        return null;
      }
      const result = RouteOptimizer.optimizeStops(activeStops, origin);
      saveFestivalStops(currentFestival, result.optimizedStops);
      setLastOptimizationResult(result);
      return result;
    },
    [activeStops, currentFestival, saveFestivalStops]
  );

  const toggleFavorite = useCallback((pandalId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(pandalId)
        ? prev.filter((id) => id !== pandalId)
        : [...prev, pandalId];
      AsyncStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (pandalId: string) => {
      return favoritesSet.has(pandalId);
    },
    [favoritesSet]
  );

  const addCustomStop = useCallback(
    (stop: Pandal) => {
      const taggedStop: Pandal = {
        ...stop,
        festival: currentFestival,
      };
      setAllCustomStops((prev) => {
        const updated = [...prev, taggedStop];
        AsyncStorage.setItem(STORAGE_CUSTOM_STOPS_KEY, JSON.stringify(updated));
        return updated;
      });
      addStop(taggedStop);
    },
    [currentFestival, addStop]
  );

  const saveCurrentRoute = useCallback(
    (name?: string): RouteItinerary | null => {
      if (activeStops.length === 0) return null;
      let totalDist = 0;
      for (let i = 0; i < activeStops.length - 1; i++) {
        totalDist += calculateHaversineDistance(
          activeStops[i].pandal.latitude,
          activeStops[i].pandal.longitude,
          activeStops[i + 1].pandal.latitude,
          activeStops[i + 1].pandal.longitude
        );
      }

      const defaultName =
        currentFestival === 'kali'
          ? `Kali Puja Trail ${savedRoutes.length + 1}`
          : `Puja Trail ${savedRoutes.length + 1}`;
      const defaultNameBn =
        currentFestival === 'kali'
          ? `কালীপূজা পরিক্রমা ${savedRoutes.length + 1}`
          : `পুজো পরিক্রমা ${savedRoutes.length + 1}`;

      const newRoute: RouteItinerary = {
        id: `route-${currentFestival}-${Date.now()}`,
        name: name || defaultName,
        nameBn: defaultNameBn,
        festival: currentFestival,
        stops: [...activeStops],
        totalDistanceKm: totalDist,
        estimatedDurationMinutes: Math.round(
          estimateWalkingMinutes(totalDist) + activeStops.length * 25
        ),
        suggestedTransitMode: totalDist > 3 ? 'Metro + Walking' : 'Walking',
        createdAt: new Date().toISOString(),
      };

      setSavedRoutes((prevRoutes) => {
        const updatedRoutes = [...prevRoutes, newRoute];
        AsyncStorage.setItem(STORAGE_SAVED_ROUTES_KEY, JSON.stringify(updatedRoutes));
        return updatedRoutes;
      });
      return newRoute;
    },
    [activeStops, currentFestival, savedRoutes.length]
  );

  const deleteSavedRoute = useCallback((id: string) => {
    setSavedRoutes((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      AsyncStorage.setItem(STORAGE_SAVED_ROUTES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const loadSavedRoute = useCallback(
    (route: RouteItinerary) => {
      const targetFestival =
        route.festival ||
        (route.stops.some(
          (s) => s.pandal?.festival === 'kali' || s.pandalId.startsWith('kali-')
        )
          ? 'kali'
          : 'durga');
      saveFestivalStops(targetFestival, route.stops);
    },
    [saveFestivalStops]
  );

  const totalDistanceKm = useMemo(() => {
    return RouteOptimizer.calculateTotalDistance(activeStops);
  }, [activeStops]);

  const contextValue = useMemo(
    () => ({
      stops: activeStops,
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
      activeStops,
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

  return <RouteContext.Provider value={contextValue}>{children}</RouteContext.Provider>;
};

export const useRoute = () => useContext(RouteContext);
