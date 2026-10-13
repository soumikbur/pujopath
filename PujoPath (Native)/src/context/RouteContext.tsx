import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pandal, RouteStop } from '@/types';
import { RouteOptimizer } from '@/lib/services/RouteOptimizer';

interface RouteContextType {
  stops: RouteStop[];
  addStop: (pandal: Pandal) => void;
  removeStop: (pandalId: string) => void;
  isPandalInRoute: (pandalId: string) => boolean;
  clearRoute: () => void;
  optimizeRoute: () => { savingsKm: number; savingsPercent: number };
  reorderStops: (fromIndex: number, toIndex: number) => void;
  totalDistanceKm: number;
  favorites: string[];
  toggleFavorite: (pandalId: string) => void;
  isFavorite: (pandalId: string) => boolean;
  customStops: Pandal[];
  addCustomStop: (stop: Pandal) => void;
}

const RouteContext = createContext<RouteContextType>({
  stops: [],
  addStop: () => {},
  removeStop: () => {},
  isPandalInRoute: () => false,
  clearRoute: () => {},
  optimizeRoute: () => ({ savingsKm: 0, savingsPercent: 0 }),
  reorderStops: () => {},
  totalDistanceKm: 0,
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  customStops: [],
  addCustomStop: () => {},
});

const STORAGE_ROUTE_KEY = '@pujopath_app_route_stops';
const STORAGE_FAVORITES_KEY = '@pujopath_app_favorites';
const STORAGE_CUSTOM_STOPS_KEY = '@pujopath_app_custom_stops';

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customStops, setCustomStops] = useState<Pandal[]>([]);

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
  }, []);

  const saveStops = (newStops: RouteStop[]) => {
    setStops(newStops);
    AsyncStorage.setItem(STORAGE_ROUTE_KEY, JSON.stringify(newStops));
  };

  const addStop = (pandal: Pandal) => {
    if (stops.some((s) => s.pandalId === pandal.id)) return;
    const newStop: RouteStop = {
      pandalId: pandal.id,
      pandal,
      order: stops.length,
    };
    saveStops([...stops, newStop]);
  };

  const removeStop = (pandalId: string) => {
    const filtered = stops
      .filter((s) => s.pandalId !== pandalId)
      .map((s, idx) => ({ ...s, order: idx }));
    saveStops(filtered);
  };

  const isPandalInRoute = (pandalId: string): boolean => {
    return stops.some((s) => s.pandalId === pandalId);
  };

  const clearRoute = () => {
    saveStops([]);
  };

  const reorderStops = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updated = [...stops];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const reindexed = updated.map((s, idx) => ({ ...s, order: idx }));
    saveStops(reindexed);
  };

  const optimizeRoute = () => {
    if (stops.length < 3) {
      return { savingsKm: 0, savingsPercent: 0 };
    }
    const result = RouteOptimizer.optimizeStops(stops);
    saveStops(result.optimizedStops);
    return {
      savingsKm: result.savingsKm,
      savingsPercent: result.savingsPercent,
    };
  };

  const toggleFavorite = (pandalId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(pandalId)
        ? prev.filter((id) => id !== pandalId)
        : [...prev, pandalId];
      AsyncStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (pandalId: string) => favorites.includes(pandalId);

  const addCustomStop = (stop: Pandal) => {
    const updated = [...customStops, stop];
    setCustomStops(updated);
    AsyncStorage.setItem(STORAGE_CUSTOM_STOPS_KEY, JSON.stringify(updated));
    addStop(stop);
  };

  const totalDistanceKm = RouteOptimizer.calculateTotalDistance(stops);

  return (
    <RouteContext.Provider
      value={{
        stops,
        addStop,
        removeStop,
        isPandalInRoute,
        clearRoute,
        optimizeRoute,
        reorderStops,
        totalDistanceKm,
        favorites,
        toggleFavorite,
        isFavorite,
        customStops,
        addCustomStop,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => useContext(RouteContext);
