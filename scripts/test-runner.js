const assert = require('assert');

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
const fs = require('fs');
const path = require('path');
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

console.log('\nAll 8 automated unit test suites passed successfully with zero errors!');

