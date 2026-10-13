'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  ColorScheme,
  ControlPosition,
  MapControl,
} from '@vis.gl/react-google-maps';
import { Pandal, MetroStation, RouteStop } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { config } from '@/lib/config';
import { cn } from '@/lib/utils/cn';
import { getAssetPath } from '@/lib/utils/asset';
import { Sun, Moon, Train, Plus, Check } from 'lucide-react';

interface PujoMapProps {
  pandals: Pandal[];
  metroStations?: MetroStation[];
  routeStops?: RouteStop[];
  selectedPandalId?: string | null;
  onSelectPandal?: (pandal: Pandal) => void;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  showMetro?: boolean;
}

// ============================================================================
// 1. LEAFLET MAP ENGINE (Full-Scale Interactive Map Engine / Automatic Fallback)
// ============================================================================
function LeafletMapEngine({
  pandals,
  metroStations = [],
  routeStops = [],
  selectedPandalId = null,
  onSelectPandal,
  center = [22.5726, 88.3639],
  zoom = 12,
  interactive = true,
  className = 'w-full h-full min-h-[450px]',
  showMetro = true,
}: PujoMapProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { addPandalToRoute, currentRouteStops } = useFavorites();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const markerMapRef = useRef<globalThis.Map<string, L.Marker>>(new globalThis.Map());

  const createPandalIcon = (pandal: Pandal, isSelected: boolean) => {
    const crowdColor = {
      Low: '#10b981',
      Moderate: '#f59e0b',
      High: '#f97316',
      Extreme: '#ef4444',
    }[pandal.crowdLevel] || '#ef4444';

    const size = isSelected ? 42 : 32;

    const html = `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c1272d 0%, #7f1d1d 100%);
          box-shadow: 0 4px 14px rgba(193, 39, 45, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${isSelected ? 18 : 13}px;
          border: ${isSelected ? '3px solid #d4af37' : '2px solid white'};
          transition: transform 0.15s ease;
        ">
          🪔
        </div>
        <span style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: ${crowdColor};
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        "></span>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-pandal-pin',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  const createMetroIcon = () => {
    const html = `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: #0284c7;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        M
      </div>
    `;
    return L.divIcon({
      html,
      className: 'custom-metro-pin',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Initialize Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (!mapInstanceRef.current) {
      const map = L.map(container, {
        center,
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
      });

      // Standard, high-contrast, clean OSM tiles (isolated from dark mode in globals.css)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    // Ensure map tiles recalculate when container is sized or after transition
    const timer1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    const timer2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 450);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(container);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Markers and Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markerMapRef.current.clear();

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    // Render Pandal Markers
    pandals.forEach((pandal) => {
      const isSelected = pandal.id === selectedPandalId;
      const marker = L.marker([pandal.latitude, pandal.longitude], {
        icon: createPandalIcon(pandal, isSelected),
        title: pandal.name,
      });

      const name = isBn ? pandal.nameBn : pandal.name;
      const locality = isBn ? pandal.localityBn : pandal.locality;
      const isAdded = currentRouteStops.some((s) => s.pandalId === pandal.id);

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 170px; padding: 2px;">
          <div style="font-weight: 800; font-size: 14px; color: #1c1917; margin-bottom: 2px; line-height: 1.2;">${name}</div>
          <div style="font-size: 11px; color: #78716c; margin-bottom: 6px;">${locality} • ${pandal.zone}</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <span style="font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 99px; background: #fee2e2; color: #b91c1c;">
              ${pandal.crowdLevel} Rush
            </span>
            <span style="font-size: 10px; color: #78716c;">${pandal.category}</span>
          </div>
          <div style="display: flex; gap: 4px; padding-top: 4px; border-top: 1px solid #e7e5e4;">
            <a href="${getAssetPath(`/pandals/${pandal.slug}/`)}" style="flex: 1; text-align: center; font-size: 11px; font-weight: 700; background: #b42323; color: white; padding: 5px 8px; border-radius: 6px; text-decoration: none;">
              ${isBn ? 'বিস্তারিত' : 'View Pandal'}
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { minWidth: 170 });

      marker.on('click', () => {
        if (onSelectPandal) onSelectPandal(pandal);
      });

      markersLayer.addLayer(marker);
      markerMapRef.current.set(pandal.id, marker);

      if (isSelected) {
        marker.openPopup();
      }
    });

    // Render Metro Markers
    if (showMetro) {
      metroStations.forEach((station) => {
        const marker = L.marker([station.latitude, station.longitude], {
          icon: createMetroIcon(),
          title: station.name,
        });
        const name = isBn ? station.nameBn : station.name;
        marker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 11px; padding: 2px;">
            <strong style="color: #0284c7; font-size: 12px;">🚇 ${name} Metro</strong>
            <div style="color: #78716c; font-size: 10px; margin-top: 2px;">${station.line}</div>
            <div style="color: #a8a29e; font-size: 9px;">${station.address}</div>
          </div>
        `);
        markersLayer.addLayer(marker);
      });
    }

    // Render Route Polylines if stops exist
    if (routeStops.length >= 2) {
      const latlngs: [number, number][] = routeStops.map((s) => [s.pandal.latitude, s.pandal.longitude]);
      routePolylineRef.current = L.polyline(latlngs, {
        color: '#b42323',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] });
    } else if (pandals.length > 0 && !selectedPandalId) {
      // Smoothly fit bounds to active filtered pandals
      const validPoints = pandals.filter((p) => !isNaN(p.latitude) && !isNaN(p.longitude));
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map((p) => [p.latitude, p.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [pandals, metroStations, routeStops, selectedPandalId, isBn, showMetro]);

  // Smooth pan to selected pandal
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPandalId) return;

    const marker = markerMapRef.current.get(selectedPandalId);
    const pandal = pandals.find((p) => p.id === selectedPandalId);
    if (marker && pandal) {
      map.setView([pandal.latitude, pandal.longitude], 15, { animate: true });
      marker.openPopup();
    }
  }, [selectedPandalId, pandals]);

  return (
    <div className={cn('relative w-full h-full rounded-2xl overflow-hidden border border-[#eee8e1] dark:border-[#2f2720] shadow-inner', className)}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[280px] sm:min-h-[450px]" />
    </div>
  );
}

// ============================================================================
// 2. GOOGLE MAPS CONTROLLER (Smooth Pan & Bounds)
// ============================================================================
function GoogleMapCameraController({
  pandals,
  selectedPandal,
}: {
  pandals: Pandal[];
  selectedPandal?: Pandal | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (selectedPandal) {
      map.panTo({
        lat: selectedPandal.latitude,
        lng: selectedPandal.longitude,
      });
      const currentZoom = map.getZoom() ?? 12;
      if (currentZoom < 14) {
        map.setZoom(15);
      }
      return;
    }

    if (pandals.length > 0 && typeof google !== 'undefined' && google.maps) {
      const bounds = new google.maps.LatLngBounds();
      pandals.forEach((p) => {
        if (!isNaN(p.latitude) && !isNaN(p.longitude)) {
          bounds.extend({ lat: p.latitude, lng: p.longitude });
        }
      });
      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
    }
  }, [map, pandals, selectedPandal]);

  return null;
}

// ============================================================================
// 3. GOOGLE MAPS ENGINE
// ============================================================================
function GoogleMapEngine({
  apiKey,
  pandals,
  metroStations = [],
  selectedPandalId = null,
  onSelectPandal,
  center = [22.5726, 88.3639],
  zoom = 12,
  interactive = true,
  className = 'w-full h-full min-h-[450px]',
  showMetro = true,
  onFail,
}: PujoMapProps & { apiKey: string; onFail: () => void }) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { addPandalToRoute, currentRouteStops } = useFavorites();

  const [mapColorScheme, setMapColorScheme] = useState<ColorScheme>(ColorScheme.LIGHT);
  const [activeInfoWindowPandal, setActiveInfoWindowPandal] = useState<Pandal | null>(null);
  const [activeInfoMetro, setActiveInfoMetro] = useState<MetroStation | null>(null);

  const mapId = config.googleMapsMapId || process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

  useEffect(() => {
    if (selectedPandalId) {
      const found = pandals.find((p) => p.id === selectedPandalId);
      if (found) {
        setActiveInfoWindowPandal(found);
        setActiveInfoMetro(null);
      }
    }
  }, [selectedPandalId, pandals]);

  const getCrowdColor = (crowd: string) => {
    switch (crowd) {
      case 'Low':
        return '#10b981';
      case 'Moderate':
        return '#f59e0b';
      case 'High':
        return '#f97316';
      case 'Extreme':
      default:
        return '#ef4444';
    }
  };

  return (
    <div className={cn('relative w-full h-full rounded-2xl overflow-hidden border border-[#eee8e1] dark:border-[#2f2720] shadow-xs google-map-container', className)}>
      <APIProvider
        apiKey={apiKey}
        solutionChannel="GMP_visgl_reactgooglemaps_v1"
        onError={onFail}
      >
        <Map
          mapId={mapId}
          defaultCenter={{ lat: center[0], lng: center[1] }}
          defaultZoom={zoom}
          gestureHandling={interactive ? 'greedy' : 'none'}
          disableDefaultUI={!interactive}
          zoomControl={interactive}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={interactive}
          colorScheme={mapColorScheme}
          className="w-full h-full"
          internalUsageAttributionIds={['gmp_git_agentskills_v1']}
        >
          <GoogleMapCameraController
            pandals={pandals}
            selectedPandal={activeInfoWindowPandal}
          />

          <MapControl position={ControlPosition.TOP_LEFT}>
            <div className="m-2.5 flex items-center gap-1.5 p-1 bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md rounded-xl border border-[#eee8e1] dark:border-[#2f2720] shadow-md">
              <button
                type="button"
                onClick={() =>
                  setMapColorScheme(
                    mapColorScheme === ColorScheme.LIGHT ? ColorScheme.DARK : ColorScheme.LIGHT
                  )
                }
                title={isBn ? 'ম্যাপের স্টাইল পরিবর্তন' : 'Toggle Map Style'}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-[#242424] dark:text-[#ede5dc] hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] transition-colors"
              >
                {mapColorScheme === ColorScheme.LIGHT ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">{isBn ? 'উজ্জ্বল ম্যাপ' : 'Light Map'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">{isBn ? 'নাইট ভিউ' : 'Night Map'}</span>
                  </>
                )}
              </button>
            </div>
          </MapControl>

          {/* Pandal Markers */}
          {pandals.map((pandal) => {
            const isSelected = selectedPandalId === pandal.id;
            const crowdColor = getCrowdColor(pandal.crowdLevel);

            return (
              <AdvancedMarker
                key={pandal.id}
                position={{ lat: pandal.latitude, lng: pandal.longitude }}
                title={isBn ? pandal.nameBn : pandal.name}
                onClick={() => {
                  setActiveInfoWindowPandal(pandal);
                  setActiveInfoMetro(null);
                  if (onSelectPandal) onSelectPandal(pandal);
                }}
              >
                <div className="relative group cursor-pointer transition-transform duration-150 hover:scale-115">
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full shadow-lg transition-all',
                      isSelected
                        ? 'w-11 h-11 bg-gradient-to-br from-[#c1272d] to-[#7f1d1d] border-3 border-[#d4af37] ring-4 ring-[#b42323]/30 scale-110'
                        : 'w-8 h-8 bg-gradient-to-br from-[#c1272d] to-[#8d1c1c] border-2 border-white'
                    )}
                  >
                    <span className={isSelected ? 'text-lg' : 'text-xs'}>🪔</span>
                  </div>
                  <span
                    style={{ backgroundColor: crowdColor }}
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-xs"
                    title={`Crowd: ${pandal.crowdLevel}`}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Metro Markers */}
          {showMetro &&
            metroStations.map((station) => (
              <AdvancedMarker
                key={station.id}
                position={{ lat: station.latitude, lng: station.longitude }}
                title={`${station.name} Metro`}
                onClick={() => {
                  setActiveInfoMetro(station);
                  setActiveInfoWindowPandal(null);
                }}
              >
                <div className="cursor-pointer transition-transform duration-150 hover:scale-115">
                  <div className="w-6 h-6 rounded-md bg-[#0284c7] text-white flex items-center justify-center font-black text-[10px] shadow-md border-1.5 border-white">
                    M
                  </div>
                </div>
              </AdvancedMarker>
            ))}

          {/* Pandal InfoWindow */}
          {activeInfoWindowPandal && (
            <InfoWindow
              position={{
                lat: activeInfoWindowPandal.latitude,
                lng: activeInfoWindowPandal.longitude,
              }}
              onCloseClick={() => setActiveInfoWindowPandal(null)}
              headerContent={
                <div className="font-bold text-sm text-[#242424] flex items-center gap-1.5 pr-2">
                  <span>🪔</span>
                  <span className="truncate">
                    {isBn ? activeInfoWindowPandal.nameBn : activeInfoWindowPandal.name}
                  </span>
                </div>
              }
            >
              <div className="p-1 space-y-2 max-w-xs font-sans">
                <div className="text-xs text-[#625b55]">
                  <div>{isBn ? activeInfoWindowPandal.localityBn : activeInfoWindowPandal.locality}</div>
                  <div className="text-[11px] text-[#776d65]">{activeInfoWindowPandal.zone}</div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c]">
                    {activeInfoWindowPandal.crowdLevel} Rush
                  </span>
                  <span className="text-[11px] text-[#776d65]">
                    {activeInfoWindowPandal.category}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#eee8e1] flex items-center gap-2">
                  <Link
                    href={`/pandals/${activeInfoWindowPandal.slug}`}
                    className="flex-1 text-center py-1.5 px-2.5 rounded-lg bg-[#b42323] text-white text-xs font-bold hover:bg-[#971c1c] transition-colors"
                  >
                    {isBn ? 'বিস্তারিত দেখুন' : 'View Pandal'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => addPandalToRoute(activeInfoWindowPandal)}
                    className="p-1.5 rounded-lg border border-[#eee8e1] text-[#b42323] hover:bg-[#b42323]/5 font-bold transition-colors"
                    title={isBn ? 'রুটে যোগ করুন' : 'Add to Route'}
                  >
                    {currentRouteStops.some((s) => s.pandalId === activeInfoWindowPandal.id) ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Metro InfoWindow */}
          {activeInfoMetro && (
            <InfoWindow
              position={{
                lat: activeInfoMetro.latitude,
                lng: activeInfoMetro.longitude,
              }}
              onCloseClick={() => setActiveInfoMetro(null)}
              headerContent={
                <div className="font-bold text-sm text-[#0284c7] flex items-center gap-1.5">
                  <Train className="w-4 h-4" />
                  <span>{isBn ? activeInfoMetro.nameBn : activeInfoMetro.name} Metro</span>
                </div>
              }
            >
              <div className="p-1 text-xs text-[#625b55] space-y-1">
                <div className="font-semibold">{activeInfoMetro.line}</div>
                <div className="text-[11px] text-[#776d65]">{activeInfoMetro.address}</div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

// ============================================================================
// 4. MAIN EXPORT: Automatic Fallback to Full Interactive Map
// ============================================================================
export default function PujoMap(props: PujoMapProps) {
  const [googleFailed, setGoogleFailed] = useState<boolean>(false);

  // Check if a production Google Maps API key is configured
  const apiKey = useMemo(() => {
    return config.googleMapsApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }, []);

  // If a valid Google Maps key exists and hasn't failed, render Google Maps
  if (apiKey && !googleFailed) {
    return <GoogleMapEngine {...props} apiKey={apiKey} onFail={() => setGoogleFailed(true)} />;
  }

  // Otherwise, render the full-scale interactive Leaflet / OpenStreetMap map directly
  // No API activation panel, no input form, no white card — real interactive map immediately!
  return <LeafletMapEngine {...props} />;
}
