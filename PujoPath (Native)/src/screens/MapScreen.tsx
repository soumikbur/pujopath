import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  BackHandler,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
const MapWebView = WebView as unknown as React.ComponentType<any>;
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { useFestival } from '@/context/FestivalContext';
import { useMapFullscreen } from '@/context/MapFullscreenContext';
import { PANDALS_DATA } from '@/data/pandals';
import { KALI_PANDALS_DATA } from '@/data/pandals/kaliPandals';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { SelectedPandalsBar } from '@/components/SelectedPandalsBar';
import { getPandalImageSource } from '@/lib/utils/pandalImages';
import { Pandal, LocalityZone } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';

interface MapScreenProps {
  navigation: any;
}

type FilterOption = LocalityZone | 'All' | 'Bonedi Bari';

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const { isPandalInRoute, addStop, removeStop, stops } = useRoute();
  const { activeFestival } = useFestival();
  const { isLandscape, safeLeft, safeRight, safeBottom, safeTop } = useResponsive();
  const { isMapFullscreen, setIsMapFullscreen, toggleMapFullscreen } = useMapFullscreen();

  const isKali = activeFestival === 'kali';

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [showMetro, setShowMetro] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const webViewRef = useRef<any>(null);

  // System Back button: dismiss topmost preview card or exit fullscreen before leaving the map
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Priority 1: dismiss open pandal preview card
        if (selectedPandal) {
          setSelectedPandal(null);
          return true; // Consumed: closes preview card without navigating away from map
        }
        // Priority 2: exit fullscreen mode and restore original layout
        if (isMapFullscreen) {
          setIsMapFullscreen(false);
          return true; // Consumed: exits fullscreen first rather than leaving Map section
        }
        return false; // Not consumed: allow standard stack/tab back navigation
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [selectedPandal, isMapFullscreen, setIsMapFullscreen])
  );

  // Reset fullscreen when screen loses focus (e.g. switching tabs)
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsMapFullscreen(false);
      };
    }, [setIsMapFullscreen])
  );

  const filterOptions: { value: FilterOption; label: string; isSpecial?: boolean }[] = useMemo(() => {
    if (isKali) {
      return [
        { value: 'All', label: isBn ? 'সব এলাকা' : 'All' },
        { value: 'Barasat' as any, label: isBn ? 'বারাসাত' : 'Barasat' },
        { value: 'Madhyamgram' as any, label: isBn ? 'মধ্যমগ্রাম' : 'Madhyamgram' },
        { value: 'North 24 Parganas' as any, label: isBn ? 'উত্তর ২৪ পরগনা' : 'North 24 Pgs' },
        { value: 'North Kolkata', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
        { value: 'South Kolkata', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
      ];
    }
    return [
      { value: 'All', label: isBn ? 'সব এলাকা' : 'All' },
      { value: 'Bonedi Bari', label: isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari', isSpecial: true },
      { value: 'North Kolkata', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
      { value: 'South Kolkata', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
      { value: 'Central Kolkata', label: isBn ? 'মধ্য কলকাতা' : 'Central Kolkata' },
      { value: 'Salt Lake', label: isBn ? 'সল্টলেক' : 'Salt Lake' },
      { value: 'Dum Dum', label: isBn ? 'দমদম' : 'Dum Dum' },
      { value: 'Behala', label: isBn ? 'বেহালা' : 'Behala' },
      { value: 'Howrah', label: isBn ? 'হাওড়া' : 'Howrah' },
    ];
  }, [isKali, isBn]);

  const activePandalsData = useMemo(() => {
    return isKali ? KALI_PANDALS_DATA : PANDALS_DATA;
  }, [isKali]);

  // Prepare sanitized JSON payload for the Leaflet WebView
  const pandalsJson = useMemo(() => {
    return JSON.stringify(
      activePandalsData.map((p) => ({
        id: p.id,
        name: p.name,
        nameBn: p.nameBn || p.name,
        locality: p.locality,
        localityBn: p.localityBn || p.locality,
        zone: p.zone,
        lat: p.latitude,
        lng: p.longitude,
        crowdLevel: p.crowdLevel,
        category: p.category,
        isBonediBari: Boolean(p.isBonediBari || p.category === 'Bonedi Bari'),
      }))
    );
  }, [activePandalsData]);

  const metroJson = useMemo(() => {
    return JSON.stringify(
      METRO_STATIONS_DATA.map((s) => ({
        id: s.id,
        name: s.name,
        nameBn: s.nameBn || s.name,
        line: s.line,
        address: s.address,
        lat: s.latitude,
        lng: s.longitude,
      }))
    );
  }, []);

  const leafletHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: ${isDark ? '#1a1613' : '#f5f1ec'}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .custom-pandal-pin { display: flex; align-items: center; justify-content: center; }
    .custom-metro-pin { display: flex; align-items: center; justify-content: center; }
    .leaflet-control-zoom { display: none !important; }
    .leaflet-control-attribution { font-size: 8px !important; opacity: 0.6; }
    .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var allPandals = ${pandalsJson};
    var allMetro = ${metroJson};
    var isBn = ${isBn};
    var isKali = ${isKali};
    var initialCenter = isKali ? [22.7245, 88.4745] : [22.5726, 88.3639];
    var initialZoom = isKali ? 13 : 12;

    var map = L.map('map', {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true
    });

    var tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    tileLayer.on('tileerror', function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TILE_ERROR' }));
      }
    });

    var pandalsLayer = L.layerGroup().addTo(map);
    var metroLayer = L.layerGroup().addTo(map);
    var markerRegistry = {};
    var currentSelectedPandalId = null;
    var userLocationMarker = null;
    var userAccuracyCircle = null;

    function getCrowdColor(level) {
      if (level === 'Low') return '#10b981';
      if (level === 'Moderate') return '#f59e0b';
      if (level === 'High') return '#f97316';
      return '#ef4444';
    }

    function createPandalIcon(pandal, isSelected) {
      var crowdColor = getCrowdColor(pandal.crowdLevel);
      var size = isSelected ? 42 : 32;
      var bgGradient = isKali
        ? 'linear-gradient(135deg, #7e22ce 0%, #3b0764 100%)'
        : 'linear-gradient(135deg, #c1272d 0%, #7f1d1d 100%)';
      var bgShadow = isKali
        ? '0 4px 14px rgba(126, 34, 206, 0.5)'
        : '0 4px 14px rgba(193, 39, 45, 0.5)';

      var html = '<div style="position: relative; width: ' + size + 'px; height: ' + size + 'px; display: flex; align-items: center; justify-content: center; cursor: pointer;">' +
        '<div style="' +
          'width: ' + size + 'px; height: ' + size + 'px; border-radius: 50%;' +
          'background: ' + bgGradient + ';' +
          'box-shadow: ' + bgShadow + ';' +
          'display: flex; align-items: center; justify-content: center; color: white;' +
          'font-size: ' + (isSelected ? 18 : 13) + 'px;' +
          'border: ' + (isSelected ? '3px solid #d4af37' : '2px solid white') + ';' +
          'transition: transform 0.15s ease;' +
        '">🪔</div>' +
        '<span style="' +
          'position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%;' +
          'background-color: ' + crowdColor + ';' +
          'border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);' +
        '"></span>' +
      '</div>';

      return L.divIcon({
        html: html,
        className: 'custom-pandal-pin',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
      });
    }

    function createMetroIcon() {
      var html = '<div style="' +
        'width: 24px; height: 24px; border-radius: 6px; background: #0284c7; color: white;' +
        'display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;' +
        'box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white;' +
      '">M</div>';

      return L.divIcon({
        html: html,
        className: 'custom-metro-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
    }

    window.applyFilter = function(zone, showMetroFlag, selectedPandalId) {
      pandalsLayer.clearLayers();
      markerRegistry = {};
      currentSelectedPandalId = selectedPandalId;

      var visibleBounds = [];

      allPandals.forEach(function(p) {
        var matches = false;
        if (zone === 'All') {
          matches = true;
        } else if (zone === 'Bonedi Bari') {
          matches = Boolean(p.isBonediBari);
        } else {
          matches = p.zone === zone;
        }

        if (matches && !isNaN(p.lat) && !isNaN(p.lng)) {
          var isSelected = (p.id === selectedPandalId);
          var marker = L.marker([p.lat, p.lng], {
            icon: createPandalIcon(p, isSelected),
            title: isBn ? p.nameBn : p.name,
            zIndexOffset: isSelected ? 1000 : 0
          });

          marker.on('click', function(e) {
            L.DomEvent.stopPropagation(e);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'SELECT_PANDAL',
                pandalId: p.id
              }));
            }
          });

          pandalsLayer.addLayer(marker);
          markerRegistry[p.id] = marker;
          visibleBounds.push([p.lat, p.lng]);
        }
      });

      // Metro stations
      metroLayer.clearLayers();
      if (showMetroFlag) {
        allMetro.forEach(function(s) {
          if (!isNaN(s.lat) && !isNaN(s.lng)) {
            var marker = L.marker([s.lat, s.lng], {
              icon: createMetroIcon(),
              title: s.name
            });
            var stationName = isBn ? s.nameBn : s.name;
            marker.bindPopup('<div style="font-size: 12px; font-weight: bold; color: #0284c7;">🚇 ' + stationName + ' Metro</div><div style="font-size: 10px; color: #666; margin-top: 2px;">' + s.line + '</div>');
            metroLayer.addLayer(marker);
          }
        });
      }

      // Center handling
      if (selectedPandalId && markerRegistry[selectedPandalId]) {
        var targetP = allPandals.find(function(item) { return item.id === selectedPandalId; });
        if (targetP) {
          map.setView([targetP.lat, targetP.lng], Math.max(map.getZoom(), 15), { animate: true });
        }
      } else if (visibleBounds.length > 0 && zone !== 'All') {
        map.fitBounds(visibleBounds, { padding: [40, 40], maxZoom: 15 });
      }
    };

    window.selectPandal = function(pandalId) {
      if (currentSelectedPandalId && currentSelectedPandalId !== pandalId) {
        var prevMarker = markerRegistry[currentSelectedPandalId];
        var prevP = allPandals.find(function(item) { return item.id === currentSelectedPandalId; });
        if (prevMarker && prevP) {
          prevMarker.setIcon(createPandalIcon(prevP, false));
          prevMarker.setZIndexOffset(0);
        }
      }

      currentSelectedPandalId = pandalId;

      if (pandalId && markerRegistry[pandalId]) {
        var marker = markerRegistry[pandalId];
        var p = allPandals.find(function(item) { return item.id === pandalId; });
        if (marker && p) {
          marker.setIcon(createPandalIcon(p, true));
          marker.setZIndexOffset(1000);
          map.setView([p.lat, p.lng], Math.max(map.getZoom(), 15), { animate: true });
        }
      }
    };

    window.recenterDefault = function() {
      map.setView(initialCenter, initialZoom, { animate: true });
    };
    window.recenterKolkata = window.recenterDefault;

    window.zoomIn = function() {
      map.zoomIn();
    };

    window.zoomOut = function() {
      map.zoomOut();
    };

    window.setUserLocation = function(lat, lng, accuracy) {
      if (userLocationMarker) map.removeLayer(userLocationMarker);
      if (userAccuracyCircle) map.removeLayer(userAccuracyCircle);

      userLocationMarker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: '#0284c7',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);

      if (accuracy && accuracy > 10) {
        userAccuracyCircle = L.circle([lat, lng], {
          radius: accuracy,
          fillColor: '#38bdf8',
          fillOpacity: 0.15,
          weight: 1,
          color: '#0284c7'
        }).addTo(map);
      }

      map.setView([lat, lng], 15, { animate: true });
    };

    map.on('click', function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DESELECT_PANDAL' }));
      }
    });

    window.resizeMap = function() {
      if (map) {
        map.invalidateSize({ animate: false });
      }
    };

    window.addEventListener('resize', function() {
      if (map) {
        map.invalidateSize({ animate: false });
      }
    });

    // Notify React Native that Map is mounted
    setTimeout(function() {
      window.applyFilter('All', true, null);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
      }
    }, 200);
  </script>
</body>
</html>`;
  }, [pandalsJson, metroJson, isBn, isDark, isKali]);

  const prevFilterMetroRef = useRef<string>('');
  const prevSelectedPandalIdRef = useRef<string | null>(null);

  // Sync React Native filter/metro states to Leaflet
  useEffect(() => {
    if (isMapReady && webViewRef.current) {
      const key = `${selectedFilter}_${showMetro}`;
      if (key !== prevFilterMetroRef.current) {
        prevFilterMetroRef.current = key;
        const script = `window.applyFilter(${JSON.stringify(selectedFilter)}, ${showMetro}, ${JSON.stringify(selectedPandal?.id || null)}); true;`;
        webViewRef.current.injectJavaScript(script);
        prevSelectedPandalIdRef.current = selectedPandal?.id || null;
      }
    }
  }, [selectedFilter, showMetro, isMapReady]);

  // Sync selection to Leaflet without destroying all markers
  useEffect(() => {
    if (isMapReady && webViewRef.current) {
      const pandalId = selectedPandal?.id || null;
      if (pandalId !== prevSelectedPandalIdRef.current) {
        prevSelectedPandalIdRef.current = pandalId;
        const script = `if (window.selectPandal) { window.selectPandal(${JSON.stringify(pandalId)}); } else { window.applyFilter(${JSON.stringify(selectedFilter)}, ${showMetro}, ${JSON.stringify(pandalId)}); } true;`;
        webViewRef.current.injectJavaScript(script);
      }
    }
  }, [selectedPandal, isMapReady, selectedFilter, showMetro]);

  // On fullscreen change, orientation change, or window resize, notify Leaflet to invalidate size and refill tiles smoothly
  useEffect(() => {
    if (isMapReady && webViewRef.current) {
      const script = `if (window.resizeMap) { window.resizeMap(); } else if (window.map) { window.map.invalidateSize(); } true;`;
      webViewRef.current.injectJavaScript(script);
      const timer1 = setTimeout(() => {
        webViewRef.current?.injectJavaScript(script);
      }, 100);
      const timer2 = setTimeout(() => {
        webViewRef.current?.injectJavaScript(script);
      }, 300);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isMapFullscreen, isLandscape, isMapReady]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MAP_READY') {
        setIsMapReady(true);
        setIsOffline(false);
      } else if (data.type === 'SELECT_PANDAL') {
        const found = activePandalsData.find((p) => p.id === data.pandalId);
        if (found) {
          setSelectedPandal(found);
        }
      } else if (data.type === 'DESELECT_PANDAL') {
        setSelectedPandal(null);
      } else if (data.type === 'TILE_ERROR') {
        setIsOffline(true);
      }
    } catch {
      // Ignore non-json messages
    }
  };

  const handleUserLocation = async () => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          isBn ? 'অনুমতি প্রয়োজন' : 'Location Permission Required',
          isBn
            ? 'আপনার অবস্থান মানচিত্রে দেখতে লোকেশন অনুমতি প্রদান করুন।'
            : 'Please grant location permission to view your position on the pandal map.'
        );
        setIsLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (loc && webViewRef.current) {
        const script = `window.setUserLocation(${loc.coords.latitude}, ${loc.coords.longitude}, ${loc.coords.accuracy || 20}); true;`;
        webViewRef.current.injectJavaScript(script);
      }
    } catch (err: any) {
      Alert.alert(
        isBn ? 'অবস্থান পাওয়া যায়নি' : 'Location Unavailable',
        isBn
          ? 'বর্তমান জিপিএস অবস্থান নির্ণয় করা সম্ভব হয়নি।'
          : 'Could not determine your current GPS coordinates. Please ensure location services are enabled.'
      );
    } finally {
      setIsLocating(false);
    }
  };

  const handleLaunchExternalNavigation = async (p: Pandal) => {
    const lat = p.latitude;
    const lng = p.longitude;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(p.name)}@${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(p.name)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    }
  };

  const inPlan = selectedPandal ? isPandalInRoute(selectedPandal.id) : false;
  const pDisplayName = selectedPandal
    ? (isBn ? (selectedPandal.nameBn || selectedPandal.name) : selectedPandal.name)
    : '';
  const pLocality = selectedPandal
    ? (isBn ? (selectedPandal.localityBn || selectedPandal.locality) : selectedPandal.locality)
    : '';
  const pImageSource = selectedPandal ? getPandalImageSource(selectedPandal.imageUrl, selectedPandal.id) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 0. Edge-to-edge transparent status bar during fullscreen */}
      {isMapFullscreen && (
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          translucent={true}
          backgroundColor="transparent"
        />
      )}

      {/* 1. Zone & Metro Filters Bar (Hidden in Fullscreen mode to maximize screen area) */}
      {!isMapFullscreen && (
        <View style={[styles.filterBarWrapper, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.filterScrollContent,
              {
                paddingLeft: 12 + safeLeft,
                paddingRight: 12 + safeRight,
              },
            ]}
          >
            {filterOptions.map((opt) => {
              const isSelected = selectedFilter === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.8}
                  onPress={() => setSelectedFilter(opt.value)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected
                        ? opt.isSpecial
                          ? '#800020'
                          : isKali
                          ? '#7e22ce'
                          : '#b42323'
                        : isDark
                        ? isKali
                          ? '#1a1424'
                          : '#1e1915'
                        : '#FFFFFF',
                      borderColor: isSelected
                        ? opt.isSpecial
                          ? '#800020'
                          : isKali
                          ? '#7e22ce'
                          : '#b42323'
                        : opt.isSpecial
                        ? isDark
                          ? '#4a321a'
                          : '#fde68a'
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      {
                        color: isSelected
                          ? opt.isSpecial
                            ? '#fef08a'
                            : '#FFFFFF'
                          : opt.isSpecial
                          ? isDark
                            ? '#fef08a'
                            : '#92400e'
                          : colors.textSecondary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Metro Lines Toggle Chip */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowMetro(!showMetro)}
              style={[
                styles.metroToggleChip,
                {
                  backgroundColor: showMetro
                    ? isDark
                      ? isKali
                        ? '#2b1b3d'
                        : '#341b18'
                      : isKali
                      ? '#f3e8ff'
                      : '#f9e9e7'
                    : isDark
                    ? isKali
                      ? '#1a1424'
                      : '#1e1915'
                    : '#FFFFFF',
                  borderColor: showMetro
                    ? isDark
                      ? isKali
                        ? '#581c87'
                        : '#4a2420'
                      : isKali
                      ? '#d8b4fe'
                      : '#f6ceca'
                    : colors.border,
                },
              ]}
            >
              <Ionicons
                name="subway-outline"
                size={14}
                color={showMetro ? (isKali ? '#9333ea' : '#b42323') : colors.textMuted}
              />
              <Text
                style={[
                  styles.metroToggleText,
                  { color: showMetro ? (isKali ? '#9333ea' : '#b42323') : colors.textMuted },
                ]}
              >
                {isBn ? 'মেট্রো রুট' : 'Metro Lines'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* 2. Interactive Leaflet Map Canvas */}
      <View style={styles.mapContainer}>
        <MapWebView
          ref={webViewRef}
          source={{ html: leafletHtml }}
          style={styles.mapWebView}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={handleMessage}
          renderLoading={() => (
            <View style={[styles.loadingOverlay, { backgroundColor: isDark ? (isKali ? '#130f1c' : '#1a1613') : '#f5f1ec' }]}>
              <ActivityIndicator size="large" color={isKali ? '#a855f7' : colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                {isBn ? 'মানচিত্র ও প্যান্ডেল লোড হচ্ছে...' : 'Loading OpenStreetMap & Pandals...'}
              </Text>
            </View>
          )}
        />

        {/* Offline / Connectivity Banner */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={14} color="#FFFFFF" />
            <Text style={styles.offlineBannerText}>
              {isBn ? 'অফলাইন মোড: ক্যাশড ম্যাপ প্রদর্শিত হচ্ছে' : 'Offline: Showing cached pandal markers'}
            </Text>
          </View>
        )}

        {/* Top-Left Fullscreen Controls: Obvious Exit Button & Active Filter Badge */}
        {isMapFullscreen && (
          <View
            style={[
              styles.fullscreenTopLeftContainer,
              {
                top: safeTop + 10,
                left: 14 + safeLeft,
              },
            ]}
          >
            {/* Obvious Exit Fullscreen Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsMapFullscreen(false)}
              style={[
                styles.floatingExitBtn,
                {
                  backgroundColor: isDark
                    ? isKali
                      ? '#1a1424'
                      : '#1e1915'
                    : '#FFFFFF',
                  borderColor: isKali ? '#7e22ce' : colors.primary,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={isBn ? 'পূর্ণস্ক্রিন মানচিত্র বন্ধ করুন' : 'Exit fullscreen map'}
              accessibilityHint={isBn ? 'স্বাভাবিক মানচিত্রে ফিরে যান' : 'Restores the original map view'}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={isKali ? '#c084fc' : colors.primary}
              />
              <Text
                style={[
                  styles.floatingExitBtnText,
                  { color: isKali ? '#c084fc' : colors.primary },
                ]}
              >
                {isBn ? 'প্রস্থান' : 'Exit'}
              </Text>
            </TouchableOpacity>

            {/* Active Filter Badge */}
            <View
              style={[
                styles.fullscreenFilterBadge,
                {
                  backgroundColor: isDark
                    ? isKali
                      ? 'rgba(26, 20, 36, 0.92)'
                      : 'rgba(30, 25, 21, 0.92)'
                    : 'rgba(255, 255, 255, 0.95)',
                  borderColor: isKali
                    ? isDark
                      ? '#3b2554'
                      : '#e9d5ff'
                    : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.fullscreenFilterBadgeText,
                  { color: isDark ? colors.textSecondary : colors.textPrimary },
                ]}
                numberOfLines={1}
              >
                🪔 {filterOptions.find((f) => f.value === selectedFilter)?.label || selectedFilter}
              </Text>
            </View>
          </View>
        )}

        {/* 3. Floating Action Controls (Right side) */}
        <View
          style={[
            styles.floatingControlsContainer,
            {
              top: isMapFullscreen ? safeTop + 10 : 14,
              right: 14 + safeRight,
            },
          ]}
        >
          {/* Fullscreen Button: Outward arrows to expand, Inward arrows to collapse */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={toggleMapFullscreen}
            style={[
              styles.floatingControlBtn,
              {
                backgroundColor: isDark
                  ? isKali
                    ? isMapFullscreen
                      ? '#2e1065'
                      : '#1a1424'
                    : isMapFullscreen
                    ? '#2a1a18'
                    : '#1e1915'
                  : isMapFullscreen
                  ? isKali
                    ? '#f3e8ff'
                    : '#fee2e2'
                  : '#FFFFFF',
                borderColor: isMapFullscreen
                  ? isKali
                    ? '#9333ea'
                    : colors.primary
                  : isKali
                  ? isDark
                    ? '#3b2554'
                    : '#e9d5ff'
                  : colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isMapFullscreen
                ? isBn
                  ? 'পূর্ণস্ক্রিন মানচিত্র বন্ধ করুন'
                  : 'Exit fullscreen map'
                : isBn
                ? 'পূর্ণস্ক্রিন মানচিত্র খুলুন'
                : 'Enter fullscreen map'
            }
            accessibilityHint={
              isMapFullscreen
                ? isBn
                  ? 'স্বাভাবিক মানচিত্রে ফিরে যান'
                  : 'Restores the original map view'
                : isBn
                ? 'মানচিত্রটি সম্পূর্ণ পর্দায় দেখান'
                : 'Expands the map to occupy the full screen'
            }
          >
            <Ionicons
              name={isMapFullscreen ? 'contract-outline' : 'expand-outline'}
              size={20}
              color={
                isKali
                  ? isMapFullscreen
                    ? '#a855f7'
                    : '#c084fc'
                  : colors.primary
              }
            />
          </TouchableOpacity>

          {/* Geolocation Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleUserLocation}
            disabled={isLocating}
            style={[
              styles.floatingControlBtn,
              {
                backgroundColor: isDark ? (isKali ? '#1a1424' : '#1e1915') : '#FFFFFF',
                borderColor: isKali ? (isDark ? '#3b2554' : '#e9d5ff') : colors.border,
              },
            ]}
            accessibilityLabel={isBn ? 'আমার অবস্থান' : 'My Location'}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={isKali ? '#a855f7' : colors.primary} />
            ) : (
              <Ionicons name="locate" size={20} color={isKali ? '#a855f7' : colors.primary} />
            )}
          </TouchableOpacity>

          {/* Recenter Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => webViewRef.current?.injectJavaScript('window.recenterDefault(); true;')}
            style={[
              styles.floatingControlBtn,
              {
                backgroundColor: isDark ? (isKali ? '#1a1424' : '#1e1915') : '#FFFFFF',
                borderColor: isKali ? (isDark ? '#3b2554' : '#e9d5ff') : colors.border,
              },
            ]}
            accessibilityLabel={isKali ? (isBn ? 'বারাসাত কেন্দ্র করুন' : 'Recenter Barasat') : (isBn ? 'কলকাতা কেন্দ্র করুন' : 'Recenter Kolkata')}
          >
            <Ionicons name="compass-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Zoom In */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => webViewRef.current?.injectJavaScript('window.zoomIn(); true;')}
            style={[
              styles.floatingControlBtn,
              {
                backgroundColor: isDark ? (isKali ? '#1a1424' : '#1e1915') : '#FFFFFF',
                borderColor: isKali ? (isDark ? '#3b2554' : '#e9d5ff') : colors.border,
              },
            ]}
            accessibilityLabel="Zoom In"
          >
            <Ionicons name="add" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Zoom Out */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => webViewRef.current?.injectJavaScript('window.zoomOut(); true;')}
            style={[
              styles.floatingControlBtn,
              {
                backgroundColor: isDark ? (isKali ? '#1a1424' : '#1e1915') : '#FFFFFF',
                borderColor: isKali ? (isDark ? '#3b2554' : '#e9d5ff') : colors.border,
              },
            ]}
            accessibilityLabel="Zoom Out"
          >
            <Ionicons name="remove" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 4. Mobile Floating Selected Pandal Card (Matching Capacitor mobile floating card) */}
        {selectedPandal && (
          <View
            style={[
              styles.floatingPandalCardContainer,
              isLandscape
                ? {
                    left: 12 + safeLeft,
                    bottom: (isMapFullscreen ? safeBottom : 0) + 8,
                    right: 'auto',
                    width: 360,
                    maxWidth: '48%',
                  }
                : {
                    left: 12,
                    right: 12,
                    bottom: isMapFullscreen ? safeBottom + 12 : 12,
                  },
            ]}
          >
            <View
              style={[
                styles.floatingPandalCard,
                {
                  backgroundColor: isDark ? '#1e1915' : '#FFFFFF',
                  borderColor: isDark ? '#3d3227' : '#eee8e1',
                },
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setSelectedPandal(null)}
                style={[styles.closeCardBtn, { backgroundColor: isDark ? '#27201a' : '#f5f1ec' }]}
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.cardHeaderRow}>
                {pImageSource ? (
                  <Image source={pImageSource} style={styles.pandalThumbnail} resizeMode="cover" />
                ) : (
                  <View style={[styles.pandalThumbnailFallback, { backgroundColor: isDark ? '#27201a' : '#fee2e2' }]}>
                    <Text style={{ fontSize: 18 }}>🪔</Text>
                  </View>
                )}

                <View style={styles.cardHeaderInfo}>
                  <Text style={[styles.pandalCardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {pDisplayName}
                  </Text>
                  <Text style={[styles.pandalCardLocality, { color: colors.textMuted }]} numberOfLines={1}>
                    {pLocality} • {selectedPandal.zone}
                  </Text>

                  {/* Badges row */}
                  <View style={styles.cardBadgeRow}>
                    <View
                      style={[
                        styles.crowdBadge,
                        {
                          backgroundColor:
                            selectedPandal.crowdLevel === 'Low'
                              ? '#d1fae5'
                              : selectedPandal.crowdLevel === 'Moderate'
                              ? '#fef3c7'
                              : selectedPandal.crowdLevel === 'High'
                              ? '#ffedd5'
                              : '#fee2e2',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.crowdBadgeText,
                          {
                            color:
                              selectedPandal.crowdLevel === 'Low'
                                ? '#065f46'
                                : selectedPandal.crowdLevel === 'Moderate'
                                ? '#92400e'
                                : selectedPandal.crowdLevel === 'High'
                                ? '#9a3412'
                                : '#b91c1c',
                          },
                        ]}
                      >
                        {selectedPandal.crowdLevel} Rush
                      </Text>
                    </View>

                    <Text style={[styles.categoryTag, { color: colors.textMuted }]} numberOfLines={1}>
                      {selectedPandal.category}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Metro Station hint if available */}
              {selectedPandal.metroLinks && selectedPandal.metroLinks.length > 0 && (
                <View style={[styles.metroHintRow, { borderTopColor: colors.border }]}>
                  <Ionicons name="subway-outline" size={13} color="#0284c7" />
                  <Text style={[styles.metroHintText, { color: colors.textMuted }]} numberOfLines={1}>
                    🚇 {selectedPandal.metroLinks[0].stationName} (~{(selectedPandal.metroLinks[0].walkingDistanceMeters / 1000).toFixed(1)} km)
                  </Text>
                </View>
              )}

              {/* Action Buttons Row */}
              <View style={styles.cardActionsRow}>
                {/* Add to Route Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    if (inPlan) removeStop(selectedPandal.id);
                    else addStop(selectedPandal);
                  }}
                  style={[
                    styles.cardActionBtn,
                    {
                      backgroundColor: inPlan ? (isDark ? '#27201a' : '#f5f1ec') : colors.primary,
                      borderColor: inPlan ? colors.border : colors.primary,
                    },
                  ]}
                >
                  <Ionicons
                    name={inPlan ? 'checkmark-circle' : 'add'}
                    size={15}
                    color={inPlan ? '#10b981' : '#FFFFFF'}
                  />
                  <Text
                    style={[
                      styles.cardActionBtnText,
                      { color: inPlan ? (isDark ? '#ede5dc' : '#242424') : '#FFFFFF' },
                    ]}
                  >
                    {inPlan ? (isBn ? 'রুটে যুক্ত' : 'Added') : (isBn ? 'রুটে যোগ' : 'Add to Route')}
                  </Text>
                </TouchableOpacity>

                {/* External Navigation Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleLaunchExternalNavigation(selectedPandal)}
                  style={[
                    styles.cardActionBtn,
                    {
                      backgroundColor: isDark ? '#27201a' : '#f5f1ec',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="navigate-outline" size={15} color="#b42323" />
                  <Text style={[styles.cardActionBtnText, { color: colors.textPrimary }]}>
                    {isBn ? 'দিকনির্দেশ' : 'Directions'}
                  </Text>
                </TouchableOpacity>

                {/* View Details Profile Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('PandalDetail', { pandalId: selectedPandal.id })}
                  style={[
                    styles.cardActionBtn,
                    {
                      backgroundColor: isDark ? '#27201a' : '#f5f1ec',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.cardActionBtnText, { color: colors.textPrimary }]}>
                    {isBn ? 'বিস্তারিত →' : 'Details →'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 5. Bottom Selected Pandals Bar (matching Capacitor planner bar when no pandal open) */}
        {!selectedPandal && (
          <View style={isMapFullscreen ? { paddingBottom: safeBottom } : undefined}>
            <SelectedPandalsBar />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBarWrapper: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  filterScrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  metroToggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  metroToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapWebView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...(StyleSheet.absoluteFill as object),
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  offlineBanner: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: '#b42323',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 20,
    elevation: 4,
  },
  offlineBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  fullscreenTopLeftContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 25,
  },
  floatingExitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  floatingExitBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  fullscreenFilterBadge: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    maxWidth: 180,
  },
  fullscreenFilterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  floatingControlsContainer: {
    position: 'absolute',
    right: 14,
    top: 14,
    gap: 8,
    zIndex: 20,
  },
  floatingControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  floatingPandalCardContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    zIndex: 30,
  },
  floatingPandalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  closeCardBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingRight: 28,
  },
  pandalThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  pandalThumbnailFallback: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  pandalCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  pandalCardLocality: {
    fontSize: 12,
    marginBottom: 4,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  crowdBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
  },
  crowdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  categoryTag: {
    fontSize: 11,
    flexShrink: 1,
  },
  metroHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metroHintText: {
    fontSize: 11,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  cardActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  cardActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
