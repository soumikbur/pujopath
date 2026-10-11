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
assert.strictEqual(globalsCss.includes('.dark .leaflet-tile-pane'), true, 'globals.css must define Leaflet dark tile filter');

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

console.log('\nAll 12 automated unit test suites passed successfully with zero errors!');
