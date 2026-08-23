'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pandal, MetroStation, RouteStop } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';

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

export default function PujoMap({
  pandals,
  metroStations = [],
  routeStops = [],
  selectedPandalId = null,
  onSelectPandal,
  center = [22.5726, 88.3639],
  zoom = 12,
  interactive = true,
  className = 'w-full h-full min-h-[400px]',
  showMetro = true,
}: PujoMapProps) {
  const { locale } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const createPandalIcon = (pandal: Pandal, isSelected: boolean) => {
    const crowdColor = {
      Low: '#10b981',
      Moderate: '#f59e0b',
      High: '#f97316',
      Extreme: '#ef4444',
    }[pandal.crowdLevel] || '#ef4444';

    const size = isSelected ? 42 : 32;
    const border = isSelected ? 'border-2 border-white ring-4 ring-sindoor-500' : 'border border-white/80';

    const html = `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c1272d 0%, #7f1d1d 100%);
          box-shadow: 0 4px 12px rgba(193, 39, 45, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${isSelected ? 16 : 12}px;
          border: ${isSelected ? '3px solid #d4af37' : '2px solid white'};
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
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 1.5px solid white;
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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    // Add pandal markers
    pandals.forEach((pandal) => {
      const isSelected = pandal.id === selectedPandalId;
      const marker = L.marker([pandal.latitude, pandal.longitude], {
        icon: createPandalIcon(pandal, isSelected),
        title: pandal.name,
      });

      const name = locale === 'bn' ? pandal.nameBn : pandal.name;
      const popupContent = `
        <div style="font-family: sans-serif; min-width: 140px; padding: 2px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">${pandal.zone}</div>
          <div style="display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 99px; background: #fee2e2; color: #b91c1c;">
            ${pandal.crowdLevel} Rush
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectPandal) onSelectPandal(pandal);
      });

      markersLayer.addLayer(marker);
    });

    // Add metro markers if enabled
    if (showMetro) {
      metroStations.forEach((station) => {
        const marker = L.marker([station.latitude, station.longitude], {
          icon: createMetroIcon(),
          title: station.name,
        });
        const name = locale === 'bn' ? station.nameBn : station.name;
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <strong>🚇 ${name} Metro</strong>
            <div style="color: #64748b; font-size: 10px;">${station.line}</div>
          </div>
        `);
        markersLayer.addLayer(marker);
      });
    }

    // Add route polyline if stops exist
    if (routeStops.length >= 2) {
      const latlngs: [number, number][] = routeStops.map((s) => [s.pandal.latitude, s.pandal.longitude]);
      routePolylineRef.current = L.polyline(latlngs, {
        color: '#c1272d',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] });
    }
  }, [pandals, metroStations, routeStops, selectedPandalId, locale, showMetro]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-800 shadow-inner">
      <div ref={mapContainerRef} className={className} />
    </div>
  );
}
