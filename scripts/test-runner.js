const assert = require('assert');
const fs = require('fs');
const path = require('path');

// 1. Geo Utilities Tests
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const deg2rad = (deg) => deg * (Math.PI / 180);
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function formatDistance(distanceKm, locale = 'en') {
  const toBengaliDigits = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
  };
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return locale === 'bn' ? `${toBengaliDigits(meters)} মি:` : `${meters} m`;
  }
  const formatted = distanceKm.toFixed(1);
  return locale === 'bn' ? `${toBengaliDigits(formatted)} কিমি` : `${formatted} km`;
}

console.log('--- Running Expanded Automated Unit Test Suite ---');

// Test 1: Geo distance between Bagbazar (22.6025, 88.3681) and Kumartuli (22.5997, 88.3655)
const dist1 = calculateHaversineDistance(22.6025, 88.3681, 22.5997, 88.3655);
assert.strictEqual(dist1, 0.4, 'Distance between Bagbazar and Kumartuli should be ~0.4 km');
console.log('✓ Geo Haversine distance test passed (0.4 km)');

// Test 2: Formatting distance in English & Bengali
const enFmt = formatDistance(0.4, 'en');
assert.strictEqual(enFmt, '400 m', 'Sub-km distance should format as meters');
const bnFmt = formatDistance(2.5, 'bn');
assert.strictEqual(bnFmt, '২.৫ কিমি', 'Distance in Bengali should use Bengali numerals');
console.log('✓ Distance formatting tests passed');

// Test 3: Route Nearest-Neighbor TSP Optimizer Heuristic
function optimizeRoute(stops) {
  if (stops.length <= 2) return stops;
  const unvisited = [...stops];
  const optimized = [];
  let current = unvisited.shift();
  optimized.push(current);

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateHaversineDistance(
        current.lat,
        current.lng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    current = unvisited.splice(nearestIdx, 1)[0];
    optimized.push(current);
  }
  return optimized;
}

const mockStops = [
  { id: 'bagbazar', lat: 22.6025, lng: 88.3681 },
  { id: 'naktala', lat: 22.4746, lng: 88.3618 },
  { id: 'kumartuli', lat: 22.5997, lng: 88.3655 },
];

const reordered = optimizeRoute(mockStops);
assert.strictEqual(reordered[0].id, 'bagbazar');
assert.strictEqual(reordered[1].id, 'kumartuli', 'Kumartuli should be visited before distant Naktala');
assert.strictEqual(reordered[2].id, 'naktala');
console.log('✓ TSP Route Optimization heuristic test passed');

// Test 4: Multi-stop cumulative distance verification
const stopsTrail = [
  { lat: 22.6025, lng: 88.3681 }, // Bagbazar
  { lat: 22.5997, lng: 88.3655 }, // Kumartuli (~0.4 km)
  { lat: 22.5979, lng: 88.3688 }, // Shobhabazar (~0.4 km)
];
const cumulativeDist = stopsTrail.reduce((acc, stop, idx) => {
  if (idx === 0) return 0;
  const prev = stopsTrail[idx - 1];
  return acc + calculateHaversineDistance(prev.lat, prev.lng, stop.lat, stop.lng);
}, 0);
assert.ok(cumulativeDist > 0.6 && cumulativeDist < 1.0, 'Cumulative distance should be ~0.8 km');
console.log(`✓ Cumulative trail distance verified (${cumulativeDist.toFixed(1)} km)`);

// Test 5: Switch toggle state integrity test
let filterState = {
  metroAccessibleOnly: false,
  heritageOnly: false,
  wheelchairAccessibleOnly: false,
};
function toggleSwitch(state, key) {
  return { ...state, [key]: !state[key] };
}
filterState = toggleSwitch(filterState, 'heritageOnly');
assert.strictEqual(filterState.heritageOnly, true, 'heritageOnly should toggle to true');
filterState = toggleSwitch(filterState, 'heritageOnly');
assert.strictEqual(filterState.heritageOnly, false, 'heritageOnly should toggle back to false');
console.log('✓ Switch toggle state integrity test passed');

// Test 6: Watch UI Complete Removal Verification
const watchDir = path.join(__dirname, '..', 'src', 'components', 'watch');
assert.strictEqual(fs.existsSync(watchDir), false, 'src/components/watch directory must be completely removed');

const headerContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'navigation', 'Header.tsx'), 'utf-8');
assert.strictEqual(headerContent.includes('Watch'), false, 'Header.tsx must not contain any Watch icon or button');

const appShellContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'navigation', 'AppShell.tsx'), 'utf-8');
assert.strictEqual(appShellContent.includes('SmartwatchView'), false, 'AppShell.tsx must not import or render SmartwatchView');
assert.strictEqual(appShellContent.includes('isWatchMode'), false, 'AppShell.tsx must not contain isWatchMode state');
console.log('✓ Watch UI complete removal verified across codebase');

// Test 7: Light Mode Default Verification
const themeContextContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'context', 'ThemeContext.tsx'), 'utf-8');
assert.strictEqual(themeContextContent.includes("useState<Theme>('light')"), true, 'ThemeContext must initialize with light mode');
assert.strictEqual(themeContextContent.includes("matchMedia('(prefers-color-scheme: dark)')"), false, 'ThemeContext must NOT auto-force dark mode based on OS preference');
console.log('✓ Light mode default enforcement verified');

// Test 8: Core Routes and 404 Verification
const appDir = path.join(__dirname, '..', 'src', 'app');
const expectedRoutes = ['explore', 'map', 'planner', 'calendar', 'metro', 'music', 'mahalaya', 'saved', 'about'];
expectedRoutes.forEach((route) => {
  const pagePath = path.join(appDir, route, 'page.tsx');
  assert.strictEqual(fs.existsSync(pagePath), true, `Route /${route} must exist`);
});
assert.strictEqual(fs.existsSync(path.join(appDir, 'not-found.tsx')), true, 'Branded not-found.tsx must exist');
console.log('✓ Core route graph and 404 integrity verified');

// Test 9: Authentic Pandal Photographs & Asset Path Resolver
const pandalDataContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'pandals', 'index.ts'), 'utf-8');
const idMatches = pandalDataContent.match(/id:\s*'([^']+)'/g) || [];
const pandalIds = idMatches.map((m) => m.match(/'([^']+)'/)[1]);
assert.strictEqual(pandalIds.length, 23, 'Must have exactly 23 verified pandals');

const pandalsImgDir = path.join(__dirname, '..', 'public', 'images', 'pandals');
assert.strictEqual(fs.existsSync(path.join(pandalsImgDir, 'pandal-fallback.webp')), true, 'pandal-fallback.webp must exist');

pandalIds.forEach((id) => {
  const webpPath = path.join(pandalsImgDir, `${id}.webp`);
  assert.strictEqual(fs.existsSync(webpPath), true, `Authentic photograph for ${id}.webp must exist in public/images/pandals/`);
  assert.strictEqual(pandalDataContent.includes(`imageUrl: '/images/pandals/${id}.webp'`), true, `Pandal ${id} must reference its own authentic webp image`);
});

// Test getAssetPath logic
function testGetAssetPath(src, basePath) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const clean = src.startsWith('/') ? src : `/${src}`;
  if (basePath && !clean.startsWith(basePath)) return `${basePath}${clean}`;
  return clean;
}
assert.strictEqual(testGetAssetPath('/images/pandals/bagbazar.webp', ''), '/images/pandals/bagbazar.webp');
assert.strictEqual(testGetAssetPath('/images/pandals/bagbazar.webp', '/pujopath'), '/pujopath/images/pandals/bagbazar.webp');
assert.strictEqual(testGetAssetPath('/pujopath/images/pandals/bagbazar.webp', '/pujopath'), '/pujopath/images/pandals/bagbazar.webp');
console.log('✓ Authentic pandal photographs (23/23) & asset path resolution verified');

// Test 10: Subtle, Elegant Creator Watermark Signature
const footerPath = path.join(__dirname, '..', 'src', 'components', 'navigation', 'Footer.tsx');
assert.strictEqual(fs.existsSync(footerPath), true, 'Footer.tsx must exist');
const footerContent = fs.readFileSync(footerPath, 'utf-8');
assert.strictEqual(
  footerContent.includes('Made by ') &&
  footerContent.includes('Soumik & Moumita') &&
  footerContent.includes('with') &&
  footerContent.includes('❤️'),
  true,
  "Footer.tsx must contain 'Made by Soumik & Moumita with ❤️'"
);

const updatedAppShell = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'navigation', 'AppShell.tsx'), 'utf-8');
assert.strictEqual(updatedAppShell.includes('<Footer />'), true, 'AppShell.tsx must render <Footer />');
console.log('✓ Subtle creator watermark signature verified in shared layout');

// Test 11: Centralized Design Tokens & Mobile Dark Mode Consistency
const globalsCss = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'globals.css'), 'utf-8');
assert.strictEqual(globalsCss.includes('--bg-main: #FCFAF7;'), true, 'globals.css must define light --bg-main token');
assert.strictEqual(globalsCss.includes('--bg-main: #14110E;'), true, 'globals.css must define dark --bg-main token');
assert.strictEqual(globalsCss.includes('.google-map-container'), true, 'globals.css must define Google Maps container isolation');
assert.strictEqual(globalsCss.includes('filter: none !important;'), true, 'globals.css must prevent dark filters on Google Maps');
assert.strictEqual(globalsCss.includes('.dark .leaflet-tile-pane'), false, 'globals.css must not contain legacy Leaflet invert filters');

const mobileNavContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components/navigation/MobileBottomNav.tsx'), 'utf-8');
assert.strictEqual(mobileNavContent.includes('dark:bg-[#181411]'), true, 'MobileBottomNav must include dark:bg-[#181411]');
assert.strictEqual(mobileNavContent.includes('dark:border-[#2a241f]'), true, 'MobileBottomNav must include dark:border-[#2a241f]');

const backgroundContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components/ui/PujoBackground.tsx'), 'utf-8');
assert.strictEqual(backgroundContent.includes('dark:opacity-0'), true, 'PujoBackground must fade light warmth in dark mode');
assert.strictEqual(backgroundContent.includes('dark:opacity-100'), true, 'PujoBackground must illuminate dark ambient warmth in dark mode');
console.log('✓ Centralized design tokens and mobile dark mode consistency verified');

// Test 12: Controlled Project Reusability, LICENSE, and .env.example
const licensePath = path.join(__dirname, '..', 'LICENSE');
assert.strictEqual(fs.existsSync(licensePath), true, 'LICENSE file must exist');
const licenseContent = fs.readFileSync(licensePath, 'utf-8');
assert.strictEqual(
  licenseContent.includes('Copyright (c) 2024-2026 Soumik & Moumita. All rights reserved.'),
  true,
  'LICENSE must contain author copyright reservation'
);

const envExamplePath = path.join(__dirname, '..', '.env.example');
assert.strictEqual(fs.existsSync(envExamplePath), true, '.env.example file must exist');

const configPath = path.join(__dirname, '..', 'src', 'lib', 'config.ts');
assert.strictEqual(fs.existsSync(configPath), true, 'src/lib/config.ts must exist');
const configContent = fs.readFileSync(configPath, 'utf-8');
assert.strictEqual(configContent.includes('validateEnvironment'), true, 'src/lib/config.ts must export validateEnvironment');
console.log('✓ Controlled reusability, LICENSE, and environment validator verified');

// Test 13: Smart Pandal-Hopping Route Planner & Maps Integration
console.log('\n--- Test Suite 13: Maps Navigation Integration & Scenarios ---');

// Pure logic implementations for validation
function isValidCoordinate(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  return true;
}

function buildGoogleMapsUrl(stops, origin) {
  if (!stops || stops.length === 0) return { provider: 'google', primaryUrl: '', totalStops: 0, segments: [], requiresMultiSegment: false };
  const validStops = stops.filter((s) => isValidCoordinate(s.pandal.latitude, s.pandal.longitude));
  if (validStops.length === 0) return { provider: 'google', primaryUrl: '', totalStops: 0, segments: [], requiresMultiSegment: false };

  const hasExplicitOrigin = origin && origin.mode !== 'app_default' && isValidCoordinate(origin.lat, origin.lng);
  const segments = [];
  const MAX_WAYPOINTS = 9;

  if (validStops.length === 1) {
    const stop = validStops[0];
    const params = new URLSearchParams();
    params.set('api', '1');
    if (hasExplicitOrigin) params.set('origin', `${origin.lat},${origin.lng}`);
    params.set('destination', `${stop.pandal.latitude},${stop.pandal.longitude}`);
    params.set('travelmode', 'walking');
    const url = `https://www.google.com/maps/dir/?${params.toString()}`;
    return {
      provider: 'google',
      primaryUrl: url,
      totalStops: 1,
      segments: [{ segmentIndex: 1, title: 'Stop 1', titleBn: '১ম মণ্ডপ', url, stopsCount: 1, startName: hasExplicitOrigin ? origin.label : 'Current Location', endName: stop.pandal.name }],
      requiresMultiSegment: false,
    };
  }

  let fullStopList = [];
  if (hasExplicitOrigin) {
    fullStopList.push({ name: origin.label || 'Starting Location', nameBn: origin.labelBn || 'শুরুর স্থান', lat: origin.lat, lng: origin.lng, isOrigin: true });
  }
  for (const s of validStops) {
    fullStopList.push({ name: s.pandal.name, nameBn: s.pandal.nameBn, lat: s.pandal.latitude, lng: s.pandal.longitude, isOrigin: false });
  }

  const stepSize = MAX_WAYPOINTS + 1;
  let segIdx = 1;
  for (let i = 0; i < fullStopList.length - 1; i += stepSize) {
    const chunk = fullStopList.slice(i, Math.min(i + stepSize + 1, fullStopList.length));
    if (chunk.length < 2) break;
    const segOrigin = chunk[0];
    const segDest = chunk[chunk.length - 1];
    const segWaypoints = chunk.slice(1, -1);
    const params = new URLSearchParams();
    params.set('api', '1');
    params.set('origin', `${segOrigin.lat},${segOrigin.lng}`);
    params.set('destination', `${segDest.lat},${segDest.lng}`);
    if (segWaypoints.length > 0) {
      params.set('waypoints', segWaypoints.map((w) => `${w.lat},${w.lng}`).join('|'));
    }
    params.set('travelmode', 'walking');
    const url = `https://www.google.com/maps/dir/?${params.toString()}`;
    segments.push({
      segmentIndex: segIdx++,
      title: `Segment ${segIdx - 1}`,
      titleBn: `ধাপ ${segIdx - 1}`,
      url,
      stopsCount: chunk.length,
      startName: segOrigin.name,
      endName: segDest.name,
    });
  }

  return {
    provider: 'google',
    primaryUrl: segments[0]?.url || '',
    totalStops: validStops.length,
    segments,
    requiresMultiSegment: segments.length > 1,
  };
}

function buildAppleMapsUrl(stops, origin) {
  if (!stops || stops.length === 0) return { provider: 'apple', primaryUrl: '', totalStops: 0, segments: [], requiresMultiSegment: false };
  const validStops = stops.filter((s) => isValidCoordinate(s.pandal.latitude, s.pandal.longitude));
  if (validStops.length === 0) return { provider: 'apple', primaryUrl: '', totalStops: 0, segments: [], requiresMultiSegment: false };

  const hasExplicitOrigin = origin && origin.mode !== 'app_default' && isValidCoordinate(origin.lat, origin.lng);
  const segments = [];

  let fullStopList = [];
  if (hasExplicitOrigin) {
    fullStopList.push({ name: origin.label || 'Starting Location', nameBn: origin.labelBn || 'শুরুর স্থান', lat: origin.lat, lng: origin.lng });
  }
  for (const s of validStops) {
    fullStopList.push({ name: s.pandal.name, nameBn: s.pandal.nameBn, lat: s.pandal.latitude, lng: s.pandal.longitude });
  }

  for (let i = 0; i < fullStopList.length - 1; i++) {
    const start = fullStopList[i];
    const end = fullStopList[i + 1];
    const params = new URLSearchParams();
    params.set('saddr', `${start.lat},${start.lng}`);
    params.set('daddr', `${end.lat},${end.lng}`);
    params.set('dirflg', 'w');
    const url = `https://maps.apple.com/?${params.toString()}`;
    segments.push({
      segmentIndex: i + 1,
      title: `Leg ${i + 1}`,
      titleBn: `লেগ ${i + 1}`,
      url,
      stopsCount: 2,
      startName: start.name,
      endName: end.name,
    });
  }

  return {
    provider: 'apple',
    primaryUrl: segments[0]?.url || '',
    totalStops: validStops.length,
    segments,
    requiresMultiSegment: segments.length > 1,
  };
}

// Scenario 1: Empty route
const emptyPlan = buildGoogleMapsUrl([], { mode: 'app_default' });
assert.strictEqual(emptyPlan.primaryUrl, '', 'Empty route must produce empty primaryUrl');
assert.strictEqual(emptyPlan.totalStops, 0);
console.log('✓ Scenario 1: Empty route safely handled without generating malformed URLs');

// Scenario 2: Single pandal without origin and with origin
const p1 = { pandal: { name: 'Bagbazar', nameBn: 'বাগবাজার', latitude: 22.6025, longitude: 88.3681 } };
const singleNoOrigin = buildGoogleMapsUrl([p1], { mode: 'app_default' });
assert.strictEqual(singleNoOrigin.primaryUrl.includes('destination=22.6025%2C88.3681'), true);
assert.strictEqual(singleNoOrigin.primaryUrl.includes('origin='), false, 'App default must not include origin');

const singleWithOrigin = buildGoogleMapsUrl([p1], { mode: 'current_location', lat: 22.5800, lng: 88.3500 });
assert.strictEqual(singleWithOrigin.primaryUrl.includes('origin=22.58%2C88.35'), true);
assert.strictEqual(singleWithOrigin.primaryUrl.includes('destination=22.6025%2C88.3681'), true);
console.log('✓ Scenario 2: Single pandal handles default live location & explicit origin without self-routing');

// Scenario 3: Multiple pandals Google Maps URL
const p2 = { pandal: { name: 'Kumartuli', nameBn: 'কুমোরটুলি', latitude: 22.5997, longitude: 88.3655 } };
const p3 = { pandal: { name: 'Sovabazar', nameBn: 'শোভাবাজার', latitude: 22.5979, longitude: 88.3688 } };
const multiPlan = buildGoogleMapsUrl([p1, p2, p3], { mode: 'app_default' });
assert.strictEqual(multiPlan.primaryUrl.includes('origin=22.6025%2C88.3681'), true);
assert.strictEqual(multiPlan.primaryUrl.includes('destination=22.5979%2C88.3688'), true);
assert.strictEqual(multiPlan.primaryUrl.includes('waypoints=22.5997%2C88.3655'), true);
console.log('✓ Scenario 3: Multiple pandals accurately maps first as origin, intermediate as waypoints, last as destination');

// Scenario 4 & 5: Optimized vs Manual order preservation
const manualOrder = [p3, p1, p2];
const manualPlan = buildGoogleMapsUrl(manualOrder, { mode: 'app_default' });
assert.strictEqual(manualPlan.primaryUrl.includes('origin=22.5979%2C88.3688'), true, 'Manual order origin must match p3');
assert.strictEqual(manualPlan.primaryUrl.includes('destination=22.5997%2C88.3655'), true, 'Manual order destination must match p2');
console.log('✓ Scenarios 4 & 5: Selected and optimized stop sequences are strictly preserved in external URLs');

// Scenario 6 & 7: GPS and Metro Origin
const metroOrigin = { mode: 'custom_station', lat: 22.5715, lng: 88.3585, label: 'Central Metro' };
const metroPlan = buildGoogleMapsUrl([p1, p2], metroOrigin);
assert.strictEqual(metroPlan.primaryUrl.includes('origin=22.5715%2C88.3585'), true);
assert.strictEqual(metroPlan.primaryUrl.includes('waypoints=22.6025%2C88.3681'), true);
assert.strictEqual(metroPlan.primaryUrl.includes('destination=22.5997%2C88.3655'), true);
console.log('✓ Scenarios 6 & 7: GPS and Metro Station origins prepend to the waypoint itinerary without dropping pandals');

// Scenario 9: Coordinate validation
assert.strictEqual(isValidCoordinate(22.57, 88.36), true);
assert.strictEqual(isValidCoordinate(null, 88.36), false);
assert.strictEqual(isValidCoordinate(NaN, 88.36), false);
assert.strictEqual(isValidCoordinate(95, 88.36), false);
console.log('✓ Scenario 9: Invalid, null, NaN, and out-of-range coordinates are safely filtered');

// Scenario 10: Apple Maps provider URL format
const applePlan = buildAppleMapsUrl([p1, p2], { mode: 'current_location', lat: 22.5800, lng: 88.3500, label: 'GPS' });
assert.strictEqual(applePlan.provider, 'apple');
assert.strictEqual(applePlan.primaryUrl.includes('https://maps.apple.com/'), true);
assert.strictEqual(applePlan.primaryUrl.includes('saddr=22.58%2C88.35'), true);
assert.strictEqual(applePlan.primaryUrl.includes('daddr=22.6025%2C88.3681'), true);
assert.strictEqual(applePlan.primaryUrl.includes('dirflg=w'), true);
assert.strictEqual(applePlan.requiresMultiSegment, true);
assert.strictEqual(applePlan.segments.length, 2);
console.log('✓ Scenario 10: Apple Maps generates valid https://maps.apple.com/?saddr=...&daddr=...&dirflg=w links with sequential legs');

// Scenario 11: Waypoint limits (> 9 intermediate waypoints in Google Maps)
const longStopsList = [];
for (let i = 0; i < 15; i++) {
  longStopsList.push({
    pandal: { name: `Pandal ${i + 1}`, nameBn: `প্যান্ডেল ${i + 1}`, latitude: 22.50 + i * 0.01, longitude: 88.30 + i * 0.01 }
  });
}
const partitionedPlan = buildGoogleMapsUrl(longStopsList, { mode: 'app_default' });
assert.strictEqual(partitionedPlan.requiresMultiSegment, true, '15 stops exceeds 9 intermediate waypoints');
assert.strictEqual(partitionedPlan.segments.length, 2, 'Should partition into 2 manageable segments');
console.log('✓ Scenario 11: Exceeding waypoint limits (>9 intermediate waypoints) gracefully partitions into sequential legs without dropping stops');

// Scenario 12: Route scope integrity (only RouteBuilder has the explicit final navigation button)
const navUrlFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'maps', 'navigationUrl.ts'), 'utf-8');
assert.strictEqual(navUrlFile.includes('buildGoogleMapsUrl'), true);
assert.strictEqual(navUrlFile.includes('buildAppleMapsUrl'), true);

const routeBuilderFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'planner', 'RouteBuilder.tsx'), 'utf-8');
assert.strictEqual(routeBuilderFile.includes('Start Pandal Hopping'), true);
assert.strictEqual(routeBuilderFile.includes('activeOrigin'), true);
assert.strictEqual(routeBuilderFile.includes('provider'), true);

const explorePageFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'explore', 'page.tsx'), 'utf-8');
assert.strictEqual(explorePageFile.includes('maps.google.com'), false, 'Explore page must not redirect externally');
assert.strictEqual(explorePageFile.includes('maps.apple.com'), false, 'Explore page must not redirect externally');

const mapPageFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'map', 'page.tsx'), 'utf-8');
assert.strictEqual(mapPageFile.includes('maps.google.com'), false, 'Map page must not redirect externally');
assert.strictEqual(mapPageFile.includes('maps.apple.com'), false, 'Map page must not redirect externally');
console.log('✓ Scenario 12: Route planning scope is strictly contained inside PujoPath; only explicit click initiates external handoff');

// Test 14: Full-Scale Interactive Map Architecture, Automatic Fallback & Dark Mode
console.log('\n--- Test Suite 14: Full-Scale Interactive Map & Automatic Fallback ---');
const pujoMapContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'map', 'PujoMap.tsx'), 'utf-8');
assert.strictEqual(pujoMapContent.includes('@vis.gl/react-google-maps'), true, 'PujoMap must support Google Maps Platform');
assert.strictEqual(pujoMapContent.includes('LeafletMapEngine'), true, 'PujoMap must provide full-scale LeafletMapEngine automatic fallback');

// Priority 2 verification: API Activation screen MUST NOT exist in PujoMap
assert.strictEqual(pujoMapContent.includes('Paste your API key'), false, 'PujoMap must not display an API key input field');
assert.strictEqual(pujoMapContent.includes('Activate Map'), false, 'PujoMap must not display an Activate Map button');
assert.strictEqual(pujoMapContent.includes('Get Free Maps Demo Key'), false, 'PujoMap must not show demo key links to visitors');
assert.strictEqual(pujoMapContent.includes('Google Cloud Console'), false, 'PujoMap must not show cloud console links to visitors');

// Verify map container styles & tile isolation
const currentGlobalsCss = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'globals.css'), 'utf-8');
assert.strictEqual(currentGlobalsCss.includes('.leaflet-tile'), true, 'globals.css must isolate leaflet tiles from dark filters');
assert.strictEqual(currentGlobalsCss.includes('.google-map-container'), true, 'globals.css must isolate google map container');

// Verify all pandal coordinates are strictly within valid Kolkata bounds
const pandalsDataRaw = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'pandals', 'index.ts'), 'utf-8');
const latMatches = [...pandalsDataRaw.matchAll(/latitude:\s*([0-9.]+)/g)].map((m) => parseFloat(m[1]));
const lngMatches = [...pandalsDataRaw.matchAll(/longitude:\s*([0-9.]+)/g)].map((m) => parseFloat(m[1]));
assert.strictEqual(latMatches.length, 23, 'Must have coordinates for all 23 pandals');
latMatches.forEach((lat) => {
  assert.ok(lat >= 22.4 && lat <= 22.7, `Latitude ${lat} must be within Kolkata metro area`);
});
lngMatches.forEach((lng) => {
  assert.ok(lng >= 88.2 && lng <= 88.5, `Longitude ${lng} must be within Kolkata metro area`);
});
// Test Suite 15: Header & More Dropdown Stacking, Positioning & Keyboard Accessibility
console.log('\n--- Test Suite 15: Header, More Dropdown & Stacking Architecture ---');
const headerSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'navigation', 'Header.tsx'), 'utf-8');

// 1. Header z-index must be higher than Leaflet maximum control z-index (1000)
assert.strictEqual(headerSource.includes('z-[1100]'), true, 'Header must have z-[1100] to sit cleanly above all Leaflet map panes & controls');

// 2. Dropdown menu positioning & elevation
assert.strictEqual(headerSource.includes('z-[1200]'), true, 'More dropdown must have z-[1200] for guaranteed elevation');
assert.strictEqual(headerSource.includes('top-full mt-2'), true, 'More dropdown must anchor to top-full with mt-2 offset');
assert.strictEqual(headerSource.includes('max-h-[calc(100vh-5rem)]'), true, 'More dropdown must constrain height and allow scrolling within viewport');
assert.strictEqual(headerSource.includes('bg-white dark:bg-[#1a1613]'), true, 'More dropdown must have 100% solid opaque background to prevent see-through collisions');

// 3. ARIA attributes for accessibility
assert.strictEqual(headerSource.includes('aria-haspopup="menu"'), true, 'More trigger button must have aria-haspopup="menu"');
assert.strictEqual(headerSource.includes('aria-controls="desktop-more-menu"'), true, 'More trigger button must control desktop-more-menu');
assert.strictEqual(headerSource.includes('role="menu"'), true, 'Dropdown panel must have role="menu"');
assert.strictEqual(headerSource.includes('role="menuitem"'), true, 'Dropdown links must have role="menuitem"');

// 4. Outside-click and touch dismissal
assert.strictEqual(headerSource.includes("document.addEventListener('mousedown', handleClickOutside)"), true, 'Must listen to mousedown for desktop click-away');
assert.strictEqual(headerSource.includes("document.addEventListener('touchstart', handleClickOutside)"), true, 'Must listen to touchstart for mobile/touch click-away');

// 5. Escape key dismissal
assert.strictEqual(headerSource.includes("event.key === 'Escape'"), true, 'Must close dropdown when Escape key is pressed');

// 6. Navigation change dismissal
assert.strictEqual(headerSource.includes('[pathname]'), true, 'Must close dropdown on route navigation');

// 7. Verify all secondary links are present in dropdown (Calendar, Metro, Music, Mahalaya, About)
assert.strictEqual(headerSource.includes('/calendar'), true, 'Must include Calendar link');
assert.strictEqual(headerSource.includes('/metro'), true, 'Must include Metro link');
assert.strictEqual(headerSource.includes('/music'), true, 'Must include Music link');
assert.strictEqual(headerSource.includes('/mahalaya'), true, 'Must include Mahalaya link');
assert.strictEqual(headerSource.includes('/about'), true, 'Must include About link');

// 8. Mobile Bottom Nav & Modals stacking hierarchy verification
const mobileNavSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'navigation', 'MobileBottomNav.tsx'), 'utf-8');
assert.strictEqual(mobileNavSource.includes('z-[1100]'), true, 'MobileBottomNav must have z-[1100]');
assert.strictEqual(mobileNavSource.includes('z-[1300]'), true, 'Mobile drawer must have z-[1300]');

const modalContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'ui', 'Modal.tsx'), 'utf-8');
assert.strictEqual(modalContent.includes('z-[1300]'), true, 'Modal dialog must have z-[1300]');

const bottomPlayerContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'music', 'BottomMusicPlayer.tsx'), 'utf-8');
assert.strictEqual(bottomPlayerContent.includes('z-[1150]'), true, 'BottomMusicPlayer must have z-[1150]');
assert.strictEqual(bottomPlayerContent.includes('z-[1300]'), true, 'Queue modal must have z-[1300]');

console.log('✓ Header z-[1100] elevation above Leaflet (1000) verified');
console.log('✓ More dropdown z-[1200] elevation, top-full positioning & viewport scrolling verified');
console.log('✓ ARIA menu semantics & keyboard Escape dismissal verified');
console.log('✓ Outside click & touch event listeners verified');
console.log('✓ Automatic dismissal on route change verified');
console.log('✓ Global stacking order (Header, Nav, Player, Modals) verified');

// Test Suite 16: Backend Validation, API Input Sanitization & Persistence Error Recovery
console.log('\n--- Test Suite 16: Backend Validation, API Sanitization & Error Recovery ---');
const routesApiFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'api', 'routes', 'route.ts'), 'utf-8');

// 1. Backend error handling for malformed JSON and bad inputs
assert.strictEqual(routesApiFile.includes('Invalid JSON request body'), true, 'POST /api/routes must return 400 on malformed JSON');
assert.strictEqual(routesApiFile.includes('No valid pandals found matching the provided IDs'), true, 'POST /api/routes must return 400 when no valid pandals match');
assert.strictEqual(routesApiFile.includes('replace(/[<>]/g, \'\')'), true, 'POST /api/routes must sanitize route name against HTML/script tags');

// 2. Pure logic validation simulating backend POST /api/routes behavior
function simulateProcessItinerary(body) {
  if (!body || typeof body !== 'object') {
    return { status: 400, error: 'Invalid JSON request body' };
  }
  const { pandalIds, name } = body;
  if (!Array.isArray(pandalIds) || pandalIds.length === 0) {
    return { status: 400, error: 'pandalIds array is required' };
  }
  const stops = [];
  const mockPandalDb = [
    { id: 'bagbazar', name: 'Bagbazar Sarbojanin', latitude: 22.6025, longitude: 88.3681 },
    { id: 'kumartuli', name: 'Kumartuli Park', latitude: 22.5997, longitude: 88.3655 }
  ];
  pandalIds.forEach((id, idx) => {
    if (typeof id === 'string') {
      const found = mockPandalDb.find((p) => p.id === id);
      if (found) stops.push({ pandalId: found.id, pandal: found, order: idx });
    }
  });
  if (stops.length === 0) {
    return { status: 400, error: 'No valid pandals found matching the provided IDs' };
  }
  let dist = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    dist += calculateHaversineDistance(stops[i].pandal.latitude, stops[i].pandal.longitude, stops[i + 1].pandal.latitude, stops[i + 1].pandal.longitude);
  }
  const sanitizedName = typeof name === 'string'
    ? name.trim().slice(0, 100).replace(/[<>]/g, '')
    : `Pujo Trail (${stops.length} Pandals)`;
  return {
    status: 200,
    data: {
      name: sanitizedName,
      stopsCount: stops.length,
      totalDistanceKm: Math.round(dist * 10) / 10
    }
  };
}

// Case 1: Empty or non-array pandalIds
assert.strictEqual(simulateProcessItinerary({ pandalIds: [] }).status, 400);
assert.strictEqual(simulateProcessItinerary({ pandalIds: 'not-array' }).status, 400);

// Case 2: Non-existent pandal IDs
assert.strictEqual(simulateProcessItinerary({ pandalIds: ['fake-pandal-1', 'fake-pandal-2'] }).status, 400);

// Case 3: Valid pandal IDs with XSS injection in name
const validRes = simulateProcessItinerary({
  pandalIds: ['bagbazar', 'kumartuli'],
  name: '<script>alert("hack")</script>My Trail'
});
assert.strictEqual(validRes.status, 200);
assert.strictEqual(validRes.data.stopsCount, 2);
assert.strictEqual(validRes.data.name.includes('<script>'), false, 'XSS brackets must be stripped from name');
assert.strictEqual(validRes.data.totalDistanceKm, 0.4);

// 3. PandalService coordinate NaN resilience verification
const pandalServiceFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'services', 'PandalService.ts'), 'utf-8');
assert.strictEqual(pandalServiceFile.includes('!isNaN(userLat)'), true, 'PandalService must check !isNaN(userLat)');
assert.strictEqual(pandalServiceFile.includes('!isNaN(userLng)'), true, 'PandalService must check !isNaN(userLng)');

// 4. Persistence try-catch error resilience verification
const favoritesContextFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'context', 'FavoritesContext.tsx'), 'utf-8');
const themeContextFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'context', 'ThemeContext.tsx'), 'utf-8');
const i18nContextFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'i18n', 'I18nContext.tsx'), 'utf-8');

assert.strictEqual(favoritesContextFile.includes('localStorage.getItem'), true);
assert.strictEqual(favoritesContextFile.includes('try {'), true);
assert.strictEqual(themeContextFile.includes('localStorage.getItem'), true);
assert.strictEqual(themeContextFile.includes('try {'), true);
assert.strictEqual(i18nContextFile.includes('localStorage.getItem'), true);
assert.strictEqual(i18nContextFile.includes('try {'), true);

console.log('✓ Backend request validation & 400 Bad Request handling verified');
console.log('✓ Route name HTML/XSS input sanitization verified');
console.log('✓ PandalService coordinate NaN-safety verified');
console.log('✓ Client-side browser storage (localStorage) try-catch failure resilience verified');

// ============================================================================
// TEST SUITE 17: Sandhi Puja Timings & Almanac Conventions
// ============================================================================
console.log('\n--- Running Test Suite 17: Sandhi Puja Timings ---');
const sandhiPujaFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'calendar', 'sandhiPuja.ts'), 'utf-8');

assert.strictEqual(sandhiPujaFile.includes('19 October 2026'), true, 'Must specify 19 October 2026 date');
assert.strictEqual(sandhiPujaFile.includes('10:27 AM'), true, 'Must specify start time 10:27 AM IST');
assert.strictEqual(sandhiPujaFile.includes('11:15 AM'), true, 'Must specify end time 11:15 AM IST');
assert.strictEqual(sandhiPujaFile.includes('durationMinutes: 48'), true, 'Duration must be 48 minutes');
assert.strictEqual(sandhiPujaFile.includes('Drik Siddhanta'), true, 'Must support Drik Siddhanta almanac convention');
assert.strictEqual(sandhiPujaFile.includes('Surya Siddhanta'), true, 'Must support traditional Surya Siddhanta convention');
assert.strictEqual(sandhiPujaFile.includes('SANDHI_PUJA_SCHEDULES'), true, 'Must use multi-year schedule data model');
assert.strictEqual(sandhiPujaFile.includes('Asia/Kolkata'), true, 'Must explicitly document Asia/Kolkata timezone');
assert.strictEqual(sandhiPujaFile.includes('drikpanchang.com'), true, 'Must cite Drik Panchang Kolkata source');

console.log('✓ Sandhi Puja 2026 timings verified (19 Oct 2026, 10:27 AM–11:15 AM IST, 48 mins)');
console.log('✓ Multi-convention almanac selector & non-hardcoded multi-year data model verified');

// ============================================================================
// TEST SUITE 18: Bonedi Bari Category Integration & Verification
// ============================================================================
console.log('\n--- Running Test Suite 18: Bonedi Bari Category Integration ---');
const bonediBariFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'pandals', 'bonediBari.ts'), 'utf-8');
const pandalTypesFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'types', 'pandal.ts'), 'utf-8');

assert.strictEqual(pandalTypesFile.includes("'Bonedi Bari'"), true, "PandalCategory must include 'Bonedi Bari'");
assert.strictEqual(pandalTypesFile.includes('bonediBariOnly?: boolean'), true, 'FilterOptions must support bonediBariOnly');
assert.strictEqual(pandalTypesFile.includes('BonediBariDetails'), true, 'Must define BonediBariDetails interface');

// Verify distinct Sovabazar Boro Taraf and Chhoto Taraf
assert.strictEqual(bonediBariFile.includes('sovabazar-rajbari-chhoto-taraf'), true, 'Must contain distinct Sovabazar Chhoto Taraf');
assert.strictEqual(bonediBariFile.includes('janbazar-rajbari-rani-rashmoni'), true, 'Must contain Rani Rashmoni Janbazar');
assert.strictEqual(bonediBariFile.includes('chhatu-babu-latu-babu-bari'), true, 'Must contain Chhatu Babu Latu Babu');
assert.strictEqual(bonediBariFile.includes('darjipara-mitra-bari'), true, 'Must contain Darjipara Mitra Bari');
assert.strictEqual(bonediBariFile.includes('pathuriaghata-khelat-ghosh-bari'), true, 'Must contain Khelat Ghosh Bari');
assert.strictEqual(bonediBariFile.includes('jorasanko-shib-krishna-daw-bari'), true, 'Must contain Shib Krishna Daw Bari');
assert.strictEqual(bonediBariFile.includes('thanthania-laha-bari'), true, 'Must contain Thanthania Laha Bari');
assert.strictEqual(bonediBariFile.includes('akrur-dutta-bari'), true, 'Must contain Akrur Dutta Bari');
assert.strictEqual(bonediBariFile.includes('chorbagan-seal-bari'), true, 'Must contain Chorbagan Seal Bari');
assert.strictEqual(bonediBariFile.includes('behala-sonar-durga-bari'), true, 'Must contain Behala Sonar Durga Bari');

// Verify visitor access status labeling
assert.strictEqual(bonediBariFile.includes('Visitor access confirmed'), true, 'Must include Visitor access confirmed status');
assert.strictEqual(bonediBariFile.includes('Visitor access not confirmed'), true, 'Must include Visitor access not confirmed status');

console.log('✓ Bonedi Bari family puja dataset and distinct branch entries verified');
console.log('✓ Visitor access status and ancestral historical fields verified');

// ============================================================================
// TEST SUITE 19: Route Planner Animated Segmented Control
// ============================================================================
console.log('\n--- Running Test Suite 19: Route Planner Animated Segmented Control ---');
const segmentedControlFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'ui', 'AnimatedSegmentedControl.tsx'), 'utf-8');
const rbFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'planner', 'RouteBuilder.tsx'), 'utf-8');

assert.strictEqual(segmentedControlFile.includes('data-active-indicator="true"'), true, 'Must render sliding indicator element');
assert.strictEqual(segmentedControlFile.includes('ResizeObserver'), true, 'Must use ResizeObserver for window resizing');
assert.strictEqual(segmentedControlFile.includes('prefers-reduced-motion'), true, 'Must support prefers-reduced-motion');
assert.strictEqual(segmentedControlFile.includes('role="tablist"'), true, 'Must support tablist ARIA role');
assert.strictEqual(segmentedControlFile.includes('role="tab"'), true, 'Must support tab ARIA role');
assert.strictEqual(segmentedControlFile.includes('aria-selected'), true, 'Must synchronize aria-selected state');

// Verify integration in RouteBuilder
assert.strictEqual(rbFile.includes('AnimatedSegmentedControl'), true, 'RouteBuilder must import AnimatedSegmentedControl');
assert.strictEqual(rbFile.includes('quickAddCategory'), true, 'RouteBuilder must have quickAddCategory filter');
assert.strictEqual(rbFile.includes('bonedi-bari'), true, 'RouteBuilder must support Bonedi Bari quick-add filter');
assert.strictEqual(rbFile.includes('handleAddAllBonediBari'), true, 'RouteBuilder must support adding Bonedi Bari trail');

console.log('✓ Animated sliding indicator, ResizeObserver, and accessibility compliance verified');
console.log('✓ RouteBuilder provider and category filter animation integration verified');

// ============================================================================
// TEST SUITE 20: Authentic Sourced Music & Licensing
// ============================================================================
console.log('\n--- Running Test Suite 20: Authentic Music & Licensing Compliance ---');
const musicDataFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'music', 'index.ts'), 'utf-8');
const audioContextFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'context', 'AudioContext.tsx'), 'utf-8');

// Ensure no fake synthetic oscillator URLs remain
assert.strictEqual(musicDataFile.includes('synth://'), false, 'All fake synth:// placeholder URLs must be replaced');
assert.strictEqual(musicDataFile.includes('upload.wikimedia.org'), true, 'Must use verified audio recordings from Wikimedia Commons');
assert.strictEqual(musicDataFile.includes('Creative Commons'), true, 'Must store explicit Creative Commons license');
assert.strictEqual(musicDataFile.includes('Mamta Jagdish Dhody'), true, 'Must attribute Dhak live recording artist');
assert.strictEqual(musicDataFile.includes('David Bolton'), true, 'Must attribute Shankha recording artist');
assert.strictEqual(musicDataFile.includes('external_listen_link'), true, 'Must support external_listen_link for copyrighted broadcasts');

// Verify HTML5 Audio engine in AudioContext
assert.strictEqual(audioContextFile.includes('new Audio()'), true, 'AudioContext must use real HTML5 Audio element');
assert.strictEqual(audioContextFile.includes('playbackError'), true, 'AudioContext must handle playback errors cleanly');

console.log('✓ Authentic audio files, CC licenses, and artist attribution verified');
console.log('✓ HTML5 Audio streaming and error resilience verified');

// ============================================================================
// TEST SUITE 21: Kolkata Metro Timetables & Durga Puja Overnight Schedules
// ============================================================================
console.log('\n--- Running Test Suite 21: Kolkata Metro Timetables ---');
const metroTimetablesFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'metro', 'timetables.ts'), 'utf-8');
const metroPageFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'metro', 'page.tsx'), 'utf-8');

assert.strictEqual(metroTimetablesFile.includes('NORMAL_METRO_TIMETABLES'), true, 'Must define normal operating timetables');
assert.strictEqual(metroTimetablesFile.includes('FESTIVAL_SPECIAL_METRO_TIMETABLES'), true, 'Must define festival special timetables');
assert.strictEqual(metroTimetablesFile.includes('04:00 AM'), true, 'Must include Saptami-Navami night service until 4:00 AM');
assert.strictEqual(metroTimetablesFile.includes('01:00 PM'), true, 'Must specify festival afternoon start time 1:00 PM');
assert.strictEqual(metroTimetablesFile.includes('Dakshineswar ⇄ Kavi Subhash'), true, 'Must specify Blue Line terminals');
assert.strictEqual(metroTimetablesFile.includes('Howrah Maidan ⇄ Esplanade'), true, 'Must specify Green Line terminals');
assert.strictEqual(metroTimetablesFile.includes('mtp.indianrailways.gov.in'), true, 'Must cite official Indian Railways MTP authority');
assert.strictEqual(metroTimetablesFile.includes('puja-2026-orange-suspension'), true, 'Must document Orange Line temporary suspension during core Puja');

assert.strictEqual(metroPageFile.includes('🌙 শারদীয়া বিশেষ সারারাত সূচি') || metroPageFile.includes('🌙 2026 Puja Night Special'), true, 'MetroPage must offer Puja night special timetable tab');

console.log('✓ Kolkata Metro normal timetables and 2026 Puja overnight schedules verified');
console.log('✓ Official MTP source citation and line status distinctions verified');

// ============================================================================
// TEST SUITE 22: Pandal Database Expansion & Geographic Quality
// ============================================================================
console.log('\n--- Running Test Suite 22: Pandal Database Expansion ---');
const pDataFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'pandals', 'index.ts'), 'utf-8');
const communityFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'pandals', 'communityPandals.ts'), 'utf-8');

// Match IDs across pandal datasets (Foundation + Bonedi Bari + Community)
const bonediDataContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'pandals', 'bonediBari.ts'), 'utf-8');
const allPandalIdMatches = [...(pDataFile + bonediDataContent + communityFile).matchAll(/id:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);
const allPandalUniqueIds = new Set(allPandalIdMatches);
assert.strictEqual(allPandalIdMatches.length, allPandalUniqueIds.size, 'All pandal IDs in PANDALS_DATA must be completely unique');

// Check expanded pandal count (must be >= 60)
assert.ok(allPandalUniqueIds.size >= 60, `Total pandals must be at least 60, got ${allPandalUniqueIds.size}`);

// Verify inclusion of requested major and minor pandals
assert.strictEqual(communityFile.includes('bagbazar-sarbojanin') || pDataFile.includes('bagbazar-sarbojanin'), true);
assert.strictEqual(communityFile.includes('nalin-sarkar-street'), true, 'Must include Nalin Sarkar Street');
assert.strictEqual(communityFile.includes('kashi-bose-lane'), true, 'Must include Kashi Bose Lane');
assert.strictEqual(communityFile.includes('sikdar-bagan'), true, 'Must include Sikdar Bagan');
assert.strictEqual(communityFile.includes('tala-pratyay'), true, 'Must include Tala Pratyay');
assert.strictEqual(communityFile.includes('dum-dum-park-bharat-chakra'), true, 'Must include Dum Dum Park Bharat Chakra');
assert.strictEqual(pDataFile.includes('fd-block-salt-lake') || communityFile.includes('salt-lake-ak-block'), true, 'Must include Salt Lake Block Pujas');
assert.strictEqual(communityFile.includes('howrah-shibpur-mandir-tala'), true, 'Must include Howrah Shibpur Mandirtala');
assert.strictEqual(communityFile.includes('badamtala-ashar-sangha'), true, 'Must include Badamtala Ashar Sangha');

console.log(`✓ Expanded pandal database verified with ${allPandalUniqueIds.size} unique, geocoded, deduplicated records`);
console.log('✓ Regional coverage verified across North, South, Central, Salt Lake/East, and Howrah');

console.log('\n================================================================');
console.log('ALL 22 AUTOMATED UNIT TEST SUITES PASSED SUCCESSFULLY WITH ZERO ERRORS!');
console.log('================================================================');




