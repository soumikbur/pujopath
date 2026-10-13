import { RouteStop } from '@/types';

export type NavigationProvider = 'google' | 'apple';
export type OriginMode = 'current_location' | 'first_pandal' | 'custom_station' | 'app_default';

export interface NavigationOrigin {
  mode: OriginMode;
  lat?: number;
  lng?: number;
  label?: string;
  labelBn?: string;
}

export interface NavigationSegment {
  segmentIndex: number;
  title: string;
  titleBn: string;
  url: string;
  stopsCount: number;
  startName: string;
  endName: string;
}

export interface NavigationPlan {
  provider: NavigationProvider;
  primaryUrl: string;
  totalStops: number;
  segments: NavigationSegment[];
  requiresMultiSegment: boolean;
  notes?: string;
  notesBn?: string;
  warning?: string;
  warningBn?: string;
}

/**
 * Validates whether latitude and longitude are valid non-null coordinates
 * within valid geographic bounds.
 */
export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  return true;
}

/**
 * Detects device platform for preferred navigation defaults.
 * Apple platforms (iPhone, iPad, iPod, Mac) prefer Apple Maps.
 * Android and desktop platforms default to Google Maps.
 */
export function detectDevicePlatform(): 'apple' | 'android' | 'desktop' {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'desktop';
  }
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'apple';
  }
  if (/Macintosh/.test(ua) && 'ontouchend' in document) {
    // iPadOS with desktop Safari UA
    return 'apple';
  }
  if (/Macintosh/.test(ua)) {
    return 'apple';
  }
  if (/Android/.test(ua)) {
    return 'android';
  }
  return 'desktop';
}

/**
 * Detects the recommended mapping provider for the current visitor's device.
 */
export function detectDefaultNavigationProvider(): NavigationProvider {
  const platform = detectDevicePlatform();
  return platform === 'apple' ? 'apple' : 'google';
}

/**
 * Maximum waypoints supported in a single Google Maps web directions URL.
 * Google Maps dir/?api=1 officially supports up to 9 intermediate waypoints
 * plus 1 origin and 1 destination (total 11 stops per URL).
 */
export const GOOGLE_MAPS_MAX_WAYPOINTS = 9;

/**
 * Builds an official Google Maps navigation directions URL using URLSearchParams.
 * Follows Google Maps official URL specification:
 * https://developers.google.com/maps/documentation/urls/get-started
 */
export function buildGoogleMapsUrl(
  stops: RouteStop[],
  origin: NavigationOrigin
): NavigationPlan {
  if (stops.length === 0) {
    return {
      provider: 'google',
      primaryUrl: '',
      totalStops: 0,
      segments: [],
      requiresMultiSegment: false,
      warning: 'No pandals selected in your trail.',
      warningBn: 'আপনার পরিক্রমা তালিকায় কোনো প্যান্ডেল নির্বাচিত নেই।',
    };
  }

  // Filter and validate stops
  const validStops = stops.filter((s) =>
    isValidCoordinate(s.pandal?.latitude, s.pandal?.longitude)
  );

  if (validStops.length === 0) {
    return {
      provider: 'google',
      primaryUrl: '',
      totalStops: 0,
      segments: [],
      requiresMultiSegment: false,
      warning: 'Selected stops do not have valid geographic coordinates.',
      warningBn: 'নির্বাচিত প্যান্ডেলগুলোর ভৌগোলিক স্থানাঙ্ক সঠিক নয়।',
    };
  }

  // Determine starting point coordinates
  let originParam: string | null = null;
  let plannedStops = [...validStops];

  if (origin.mode === 'current_location' && isValidCoordinate(origin.lat, origin.lng)) {
    originParam = `${origin.lat},${origin.lng}`;
  } else if (origin.mode === 'custom_station' && isValidCoordinate(origin.lat, origin.lng)) {
    originParam = `${origin.lat},${origin.lng}`;
  } else if (origin.mode === 'first_pandal') {
    // The route starts at the 1st pandal and proceeds to remaining
    if (plannedStops.length > 1) {
      const first = plannedStops.shift()!;
      originParam = `${first.pandal.latitude},${first.pandal.longitude}`;
    } else {
      // Single pandal starting at itself makes no sense; let origin be app_default
      originParam = null;
    }
  } else {
    // app_default or current location permission not yet acquired
    // Omitting the origin parameter causes Google Maps to use device current location
    originParam = null;
  }

  // If plannedStops is empty (e.g., only 1 stop was present and it became origin), destination is that stop
  const destinationStop = plannedStops[plannedStops.length - 1] || validStops[0];
  const destinationParam = `${destinationStop.pandal.latitude},${destinationStop.pandal.longitude}`;

  // Intermediate waypoints (all stops between origin and destination)
  const waypointStops = plannedStops.slice(0, -1);

  // Check if stops exceed Google Maps waypoint limits
  if (waypointStops.length > GOOGLE_MAPS_MAX_WAYPOINTS) {
    // Generate multi-segment plans
    const segments: NavigationSegment[] = [];
    const chunkSize = GOOGLE_MAPS_MAX_WAYPOINTS + 1; // destination included

    for (let i = 0; i < plannedStops.length; i += chunkSize) {
      const chunk = plannedStops.slice(i, i + chunkSize + 1);
      if (chunk.length === 0) break;

      const segOrigin = i === 0 && originParam ? originParam : `${chunk[0].pandal.latitude},${chunk[0].pandal.longitude}`;
      const segDest = `${chunk[chunk.length - 1].pandal.latitude},${chunk[chunk.length - 1].pandal.longitude}`;
      const segWaypoints = (i === 0 && originParam ? chunk.slice(0, -1) : chunk.slice(1, -1))
        .map((s) => `${s.pandal.latitude},${s.pandal.longitude}`)
        .join('|');

      const params = new URLSearchParams();
      params.set('api', '1');
      if (segOrigin) params.set('origin', segOrigin);
      params.set('destination', segDest);
      if (segWaypoints) params.set('waypoints', segWaypoints);
      params.set('travelmode', 'walking');

      const segIdx = segments.length + 1;
      segments.push({
        segmentIndex: segIdx,
        title: `Leg ${segIdx}: Stops ${i + 1} to ${Math.min(i + chunkSize + 1, plannedStops.length)}`,
        titleBn: `পর্ব ${segIdx}: মণ্ডপ ${i + 1} থেকে ${Math.min(i + chunkSize + 1, plannedStops.length)}`,
        url: `https://www.google.com/maps/dir/?${params.toString()}`,
        stopsCount: chunk.length,
        startName: i === 0 && origin.label ? origin.label : chunk[0].pandal.name,
        endName: chunk[chunk.length - 1].pandal.name,
      });
    }

    // Primary URL is Leg 1
    return {
      provider: 'google',
      primaryUrl: segments[0].url,
      totalStops: validStops.length,
      segments,
      requiresMultiSegment: true,
      notes: `Trail has ${validStops.length} stops. Google Maps handles up to 10 stops per route; it has been divided into ${segments.length} sequential legs.`,
      notesBn: `পরিক্রমায় মোট ${validStops.length}টি মণ্ডপ রয়েছে। গুগল ম্যাপে প্রতি রুটে সর্বোচ্চ ১০টি গন্তব্য সমন্বিত হয়, তাই রুটটি ${segments.length}টি পর্বে ভাগ করা হয়েছে।`,
    };
  }

  // Standard single-route URL
  const params = new URLSearchParams();
  params.set('api', '1');
  if (originParam) {
    params.set('origin', originParam);
  }
  params.set('destination', destinationParam);

  if (waypointStops.length > 0) {
    const waypointsParam = waypointStops
      .map((s) => `${s.pandal.latitude},${s.pandal.longitude}`)
      .join('|');
    params.set('waypoints', waypointsParam);
  }
  params.set('travelmode', 'walking');

  const primaryUrl = `https://www.google.com/maps/dir/?${params.toString()}`;

  return {
    provider: 'google',
    primaryUrl,
    totalStops: validStops.length,
    segments: [
      {
        segmentIndex: 1,
        title: 'Complete Trail',
        titleBn: 'সম্পূর্ণ পরিক্রমা',
        url: primaryUrl,
        stopsCount: validStops.length,
        startName: origin.label || validStops[0].pandal.name,
        endName: destinationStop.pandal.name,
      },
    ],
    requiresMultiSegment: false,
    notes: 'Google Maps will load your complete ordered pandal trail with turn-by-turn walking navigation.',
    notesBn: 'গুগল ম্যাপে আপনার সম্পূর্ণ পরিক্রমা ও হাঁটার পথনির্দেশ একবারে প্রদর্শিত হবে।',
  };
}

/**
 * Builds an official Apple Maps navigation directions URL using URLSearchParams.
 * Follows Apple Maps URL Scheme specification:
 * https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
 *
 * NOTE: Standard Apple Maps web URLs support saddr and daddr.
 * Standard web URLs do not natively support arbitrary pipe-separated intermediate waypoints.
 * When multiple stops exist, Apple Maps navigates to the first destination or stop-by-stop legs,
 * while offering full multi-stop navigation in Google Maps if desired.
 */
export function buildAppleMapsUrl(
  stops: RouteStop[],
  origin: NavigationOrigin
): NavigationPlan {
  if (stops.length === 0) {
    return {
      provider: 'apple',
      primaryUrl: '',
      totalStops: 0,
      segments: [],
      requiresMultiSegment: false,
      warning: 'No pandals selected in your trail.',
      warningBn: 'আপনার পরিক্রমা তালিকায় কোনো প্যান্ডেল নির্বাচিত নেই।',
    };
  }

  const validStops = stops.filter((s) =>
    isValidCoordinate(s.pandal?.latitude, s.pandal?.longitude)
  );

  if (validStops.length === 0) {
    return {
      provider: 'apple',
      primaryUrl: '',
      totalStops: 0,
      segments: [],
      requiresMultiSegment: false,
      warning: 'Selected stops do not have valid geographic coordinates.',
      warningBn: 'নির্বাচিত প্যান্ডেলগুলোর ভৌগোলিক স্থানাঙ্ক সঠিক নয়।',
    };
  }

  // Single Destination
  if (validStops.length === 1) {
    const target = validStops[0];
    const params = new URLSearchParams();
    params.set('daddr', `${target.pandal.latitude},${target.pandal.longitude}`);
    if (origin.mode === 'current_location' && isValidCoordinate(origin.lat, origin.lng)) {
      params.set('saddr', `${origin.lat},${origin.lng}`);
    } else if (origin.mode === 'custom_station' && isValidCoordinate(origin.lat, origin.lng)) {
      params.set('saddr', `${origin.lat},${origin.lng}`);
    }
    params.set('dirflg', 'w');

    const primaryUrl = `https://maps.apple.com/?${params.toString()}`;
    return {
      provider: 'apple',
      primaryUrl,
      totalStops: 1,
      segments: [
        {
          segmentIndex: 1,
          title: `Direct to ${target.pandal.name}`,
          titleBn: `${target.pandal.nameBn || target.pandal.name}-এ যাত্রা`,
          url: primaryUrl,
          stopsCount: 1,
          startName: origin.label || 'Your Location',
          endName: target.pandal.name,
        },
      ],
      requiresMultiSegment: false,
      notes: 'Direct walking navigation to pandal in Apple Maps.',
      notesBn: 'অ্যাপল ম্যাপসে মণ্ডপটিতে পৌঁছানোর সরাসরি পথনির্দেশ।',
    };
  }

  // Multi-Stop Route in Apple Maps:
  // Create stop-by-stop sequential legs so users can navigate each stop in Apple Maps
  const segments: NavigationSegment[] = [];

  // Leg 1: Origin -> Pandal 1
  const firstTarget = validStops[0];
  const leg1Params = new URLSearchParams();
  leg1Params.set('daddr', `${firstTarget.pandal.latitude},${firstTarget.pandal.longitude}`);
  if (isValidCoordinate(origin.lat, origin.lng)) {
    leg1Params.set('saddr', `${origin.lat},${origin.lng}`);
  }
  leg1Params.set('dirflg', 'w');

  segments.push({
    segmentIndex: 1,
    title: `Stop 1: ${firstTarget.pandal.name}`,
    titleBn: `১ম মণ্ডপ: ${firstTarget.pandal.nameBn || firstTarget.pandal.name}`,
    url: `https://maps.apple.com/?${leg1Params.toString()}`,
    stopsCount: 1,
    startName: origin.label || 'Your Location',
    endName: firstTarget.pandal.name,
  });

  // Subsequent Legs: Pandal N -> Pandal N+1
  for (let i = 0; i < validStops.length - 1; i++) {
    const fromPandal = validStops[i];
    const toPandal = validStops[i + 1];

    const legParams = new URLSearchParams();
    legParams.set('saddr', `${fromPandal.pandal.latitude},${fromPandal.pandal.longitude}`);
    legParams.set('daddr', `${toPandal.pandal.latitude},${toPandal.pandal.longitude}`);
    legParams.set('dirflg', 'w');

    const legIdx = i + 2;
    segments.push({
      segmentIndex: legIdx,
      title: `Stop ${legIdx}: ${toPandal.pandal.name}`,
      titleBn: `${legIdx}য় মণ্ডপ: ${toPandal.pandal.nameBn || toPandal.pandal.name}`,
      url: `https://maps.apple.com/?${legParams.toString()}`,
      stopsCount: 1,
      startName: fromPandal.pandal.name,
      endName: toPandal.pandal.name,
    });
  }

  return {
    provider: 'apple',
    primaryUrl: segments[0].url,
    totalStops: validStops.length,
    segments,
    requiresMultiSegment: true,
    notes: 'Apple Maps web directions handle navigation stop-by-stop. You can launch Stop 1 now or switch to Google Maps for a single preloaded route with all waypoints.',
    notesBn: 'অ্যাপল ম্যাপসে মণ্ডপ অনুযায়ী ধাপে ধাপে পথনির্দেশ সম্পন্ন হয়। আপনি ১ম মণ্ডপের যাত্রা শুরু করতে পারেন, অথবা একবারে সমস্ত মণ্ডপ প্রি-লোড করতে গুগল ম্যাপস নির্বাচন করতে পারেন।',
  };
}

/**
 * Builds the appropriate navigation plan based on selected provider and origin.
 */
export function buildNavigationPlan(
  stops: RouteStop[],
  provider: NavigationProvider,
  origin: NavigationOrigin
): NavigationPlan {
  if (provider === 'apple') {
    return buildAppleMapsUrl(stops, origin);
  }
  return buildGoogleMapsUrl(stops, origin);
}

/**
 * Request user's current geolocation with an 8-second timeout,
 * high accuracy, and typed error handling.
 */
export function requestCurrentGeolocation(
  timeoutMs = 8000
): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let msg = 'Unable to acquire location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was denied. Please select a starting point or continue with your navigation app.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Current location is unavailable on this device.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please choose a starting point.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 60000,
      }
    );
  });
}
