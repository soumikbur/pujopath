'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
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
import {
  MapPin,
  Key,
  ExternalLink,
  Plus,
  Check,
  Sun,
  Moon,
  Info,
  Sparkles,
  AlertCircle,
  Train,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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

// Controller component to handle smooth camera panning and bounds fitting
function MapCameraController({
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
      // Zoom in appropriately if currently zoomed far out
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

export default function PujoMap({
  pandals,
  metroStations = [],
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

  // API Key resolution: Environment variable or session override for testing
  const [sessionKey, setSessionKey] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [mapColorScheme, setMapColorScheme] = useState<ColorScheme>(ColorScheme.LIGHT);
  const [activeInfoWindowPandal, setActiveInfoWindowPandal] = useState<Pandal | null>(null);
  const [activeInfoMetro, setActiveInfoMetro] = useState<MetroStation | null>(null);
  const [apiLoadError, setApiLoadError] = useState<boolean>(false);
  const [showConfigHelper, setShowConfigHelper] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('pujopath_gmp_key');
      if (stored) {
        setSessionKey(stored);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const activeApiKey = useMemo(() => {
    return sessionKey || config.googleMapsApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }, [sessionKey]);

  const mapId = useMemo(() => {
    return config.googleMapsMapId || process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  }, []);

  // Sync selectedPandal with prop
  useEffect(() => {
    if (selectedPandalId) {
      const found = pandals.find((p) => p.id === selectedPandalId);
      if (found) {
        setActiveInfoWindowPandal(found);
        setActiveInfoMetro(null);
      }
    }
  }, [selectedPandalId, pandals]);

  const handleApplySessionKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (cleanKey) {
      setSessionKey(cleanKey);
      try {
        sessionStorage.setItem('pujopath_gmp_key', cleanKey);
      } catch {
        // Ignore storage errors
      }
      setApiLoadError(false);
      setShowConfigHelper(false);
    }
  };

  const handleClearSessionKey = () => {
    setSessionKey('');
    try {
      sessionStorage.removeItem('pujopath_gmp_key');
    } catch {
      // Ignore storage errors
    }
  };

  // Crowd level color tokens
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

  // Render Graceful Setup / Key Configuration Prompt if no API key is available
  if (!activeApiKey || apiLoadError) {
    return (
      <div className={cn('relative w-full h-full rounded-2xl overflow-hidden border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] p-6 flex flex-col justify-between shadow-xs', className)}>
        <div className="max-w-2xl mx-auto my-auto text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#b42323]/10 dark:bg-[#b42323]/20 border border-[#b42323]/30 flex items-center justify-center text-[#b42323]">
            <Key className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
              {isBn ? 'গুগল ম্যাপস প্ল্যাটফর্ম ইন্টিগ্রেশন' : 'Google Maps Platform Integration'}
            </h3>
            <p className="text-xs sm:text-sm text-[#776d65] dark:text-[#a89e95] leading-relaxed">
              {isBn
                ? 'পূজোপাথ অফিসিয়াল গুগল ম্যাপস জাভাস্ক্রিপ্ট এপিআই (Google Maps JavaScript API) দিয়ে কলকাতা দুর্গাপূজার মণ্ডপ প্রদর্শন করে। প্রদর্শনের জন্য একটি গুগল ক্লাউড এপিআই কি অথবা ফ্রি ডেমো কি প্রয়োজন।'
                : 'PujoPath uses the official Google Maps JavaScript API with AdvancedMarkerElement to display verified pandals across Kolkata. To activate the embedded interactive map, configure an API key or use a zero-cost prototyping Maps Demo Key.'}
            </p>
          </div>

          {/* Key Input Form for in-session testing */}
          <form onSubmit={handleApplySessionKey} className="max-w-md mx-auto pt-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder={isBn ? 'আপনার এপিআই কি পেস্ট করুন...' : 'Paste your API key or Demo Key...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-xs font-mono text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:ring-2 focus:ring-[#b42323]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#b42323] text-white hover:bg-[#971c1c] text-xs font-bold transition-all shadow-xs shrink-0"
              >
                {isBn ? 'সক্রিয় করুন' : 'Activate Map'}
              </button>
            </div>
          </form>

          {/* Quick links & setup guide */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] text-[#b42323] hover:bg-[#b42323]/5 font-bold transition-colors"
            >
              <span>{isBn ? 'ফ্রি ম্যাপস ডেমো কি সংগ্রহ করুন' : 'Get Free Maps Demo Key'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] text-[#776d65] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white font-bold transition-colors"
            >
              <span>{isBn ? 'গুগল ক্লাউড কনসোল' : 'Google Cloud Console'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Fallback Pandal Grid Indicator */}
          <div className="pt-4 border-t border-[#eee8e1] dark:border-[#2f2720] text-left">
            <div className="flex items-center justify-between text-xs pb-2 text-[#776d65] dark:text-[#a89e95]">
              <span className="font-bold uppercase tracking-wider">
                {isBn ? `সক্রিয় মণ্ডপ তালিকা (${pandals.length}টি)` : `Active Pandals Ready (${pandals.length})`}
              </span>
              <span>{isBn ? 'স্থানাঙ্ক যাচাইকৃত' : 'GPS Verified'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto no-scrollbar">
              {pandals.map((pandal) => (
                <button
                  key={pandal.id}
                  onClick={() => onSelectPandal && onSelectPandal(pandal)}
                  className="p-2 rounded-lg border border-[#eee8e1] dark:border-[#2f2720] bg-[#fcfaf7] dark:bg-[#14110e] text-left hover:border-[#b42323]/40 transition-colors"
                >
                  <div className="font-bold text-xs text-[#242424] dark:text-[#ede5dc] truncate">
                    {isBn ? pandal.nameBn : pandal.name}
                  </div>
                  <div className="text-[10px] text-[#776d65] dark:text-[#8d837a] truncate">
                    {pandal.zone} • {pandal.latitude.toFixed(3)}, {pandal.longitude.toFixed(3)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full rounded-2xl overflow-hidden border border-[#eee8e1] dark:border-[#2f2720] shadow-xs google-map-container', className)}>
      <APIProvider
        apiKey={activeApiKey}
        solutionChannel="GMP_visgl_reactgooglemaps_v1"
        onLoad={() => setApiLoadError(false)}
        onError={() => setApiLoadError(true)}
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
          {/* Automatic Pan & Bounds Controller */}
          <MapCameraController
            pandals={pandals}
            selectedPandal={activeInfoWindowPandal}
          />

          {/* Custom Control: Map Style & Status Toggle */}
          <MapControl position={ControlPosition.TOP_LEFT}>
            <div className="m-2.5 flex items-center gap-1.5 p-1 bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md rounded-xl border border-[#eee8e1] dark:border-[#2f2720] shadow-md">
              <button
                type="button"
                onClick={() =>
                  setMapColorScheme(
                    mapColorScheme === ColorScheme.LIGHT
                      ? ColorScheme.DARK
                      : ColorScheme.LIGHT
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

              {sessionKey && (
                <button
                  type="button"
                  onClick={handleClearSessionKey}
                  title="Reset custom API key"
                  className="px-2 py-1 rounded-lg text-[11px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold"
                >
                  Reset Key
                </button>
              )}
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

                  {/* Crowd Indicator Badge */}
                  <span
                    style={{ backgroundColor: crowdColor }}
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-xs"
                    title={`Crowd: ${pandal.crowdLevel}`}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Kolkata Metro Station Markers */}
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

          {/* Active Pandal InfoWindow */}
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
                    onClick={() => {
                      addPandalToRoute(activeInfoWindowPandal);
                    }}
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

          {/* Active Metro Station InfoWindow */}
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
