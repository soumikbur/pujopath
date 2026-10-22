import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface MapFullscreenContextType {
  isMapFullscreen: boolean;
  setIsMapFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMapFullscreen: () => void;
}

const MapFullscreenContext = createContext<MapFullscreenContextType | undefined>(undefined);

export const MapFullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const toggleMapFullscreen = useCallback(() => {
    setIsMapFullscreen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isMapFullscreen,
      setIsMapFullscreen,
      toggleMapFullscreen,
    }),
    [isMapFullscreen, toggleMapFullscreen]
  );

  return (
    <MapFullscreenContext.Provider value={value}>
      {children}
    </MapFullscreenContext.Provider>
  );
};

export const useMapFullscreen = (): MapFullscreenContextType => {
  const context = useContext(MapFullscreenContext);
  if (!context) {
    throw new Error('useMapFullscreen must be used within a MapFullscreenProvider');
  }
  return context;
};
