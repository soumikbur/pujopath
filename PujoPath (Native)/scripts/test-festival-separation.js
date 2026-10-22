// scripts/test-festival-separation.js
// Automated regression test for PujoPath Native festival pandal separation

const path = require('path');

// Compile or evaluate typescript source or load data
const ts = require('typescript');
const fs = require('fs');

function loadTsModule(filePath) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  const tsCode = fs.readFileSync(fullPath, 'utf8');
  // Simple transpile with CommonJS
  const jsCode = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  }).outputText;

  const mod = { exports: {} };
  const customRequire = (reqPath) => {
    if (reqPath.startsWith('@/')) {
      const rel = 'src/' + reqPath.slice(2);
      let target = rel;
      const abs = path.resolve(__dirname, '..', target);
      if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
        target += '/index.ts';
      } else if (!fs.existsSync(abs)) {
        if (fs.existsSync(abs + '.ts')) target += '.ts';
        else if (fs.existsSync(abs + '.tsx')) target += '.tsx';
        else if (fs.existsSync(abs + '/index.ts')) target += '/index.ts';
      }
      return loadTsModule(target);
    }
    if (reqPath.startsWith('./') || reqPath.startsWith('../')) {
      const dir = path.dirname(fullPath);
      let resolved = path.resolve(dir, reqPath);
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        resolved = path.join(resolved, 'index.ts');
      } else if (!fs.existsSync(resolved)) {
        if (fs.existsSync(resolved + '.ts')) resolved += '.ts';
        else if (fs.existsSync(resolved + '.tsx')) resolved += '.tsx';
        else if (fs.existsSync(resolved + '/index.ts')) resolved += '/index.ts';
      }
      return loadTsModule(path.relative(path.resolve(__dirname, '..'), resolved));
    }
    return require(reqPath);
  };

  const fn = new Function('require', 'module', 'exports', '__dirname', '__filename', jsCode);
  fn(customRequire, mod, mod.exports, path.dirname(fullPath), fullPath);
  return mod.exports;
}

console.log('🧪 Starting PujoPath Native Festival Separation Test Suite...\n');

const { PANDALS_DATA, KALI_PANDALS_DATA } = loadTsModule('src/data/pandals/index.ts');
const { PandalService } = loadTsModule('src/lib/services/PandalService.ts');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failCount++;
  }
}

// 1. DATASET INTEGRITY
console.log('--- 1. DATASET INTEGRITY & EXPLICIT FESTIVAL PROPERTY ---');
assert(PANDALS_DATA.length > 700, `PANDALS_DATA contains ${PANDALS_DATA.length} Durga Puja pandals (> 700)`);
assert(KALI_PANDALS_DATA.length >= 30, `KALI_PANDALS_DATA contains ${KALI_PANDALS_DATA.length} Kali Puja pandals (>= 30)`);

const allDurgaTagged = PANDALS_DATA.every((p) => p.festival === 'durga');
assert(allDurgaTagged, 'Every pandal in PANDALS_DATA has explicit festival: "durga"');

const allKaliTagged = KALI_PANDALS_DATA.every((p) => p.festival === 'kali');
assert(allKaliTagged, 'Every pandal in KALI_PANDALS_DATA has explicit festival: "kali"');

// 2. EXPLORE INITIAL LIST SEPARATION
console.log('\n--- 2. EXPLORE INITIAL LIST SEPARATION ---');
const durgaList = PandalService.filterPandals({}, undefined, undefined, [], 'durga');
const kaliList = PandalService.filterPandals({}, undefined, undefined, [], 'kali');

assert(durgaList.length === PANDALS_DATA.length, `Durga Explore returns all ${durgaList.length} Durga pandals`);
assert(!durgaList.some((p) => p.festival === 'kali' || p.id.startsWith('kali-')), 'Durga Explore contains ZERO Kali pandals');

assert(kaliList.length === KALI_PANDALS_DATA.length, `Kali Explore returns all ${kaliList.length} Kali pandals`);
assert(!kaliList.some((p) => p.festival === 'durga'), 'Kali Explore contains ZERO Durga pandals');

// 3. SEARCH LEAKAGE TESTS
console.log('\n--- 3. CROSS-FESTIVAL SEARCH ISOLATION ---');
// Search for known Durga pandals: 'bagbazar', 'suruchi sangha', 'college square'
const durgaSearchInDurga = PandalService.filterPandals({ searchQuery: 'bagbazar' }, undefined, undefined, [], 'durga');
const durgaSearchInKali = PandalService.filterPandals({ searchQuery: 'bagbazar' }, undefined, undefined, [], 'kali');
assert(durgaSearchInDurga.length > 0, `Search for 'bagbazar' in Durga mode returns ${durgaSearchInDurga.length} result(s)`);
assert(durgaSearchInKali.length === 0, `Search for 'bagbazar' in Kali mode returns EXACTLY 0 results (no leakage)`);

const suruchiInDurga = PandalService.filterPandals({ searchQuery: 'suruchi sangha' }, undefined, undefined, [], 'durga');
const suruchiInKali = PandalService.filterPandals({ searchQuery: 'suruchi sangha' }, undefined, undefined, [], 'kali');
assert(suruchiInDurga.length > 0, `Search for 'suruchi sangha' in Durga mode returns ${suruchiInDurga.length} result(s)`);
assert(suruchiInKali.length === 0, `Search for 'suruchi sangha' in Kali mode returns EXACTLY 0 results (no leakage)`);

// Search for known Kali pandals: 'pioneer athletic', 'knc regiment', 'boro maa'
const pioneerInKali = PandalService.filterPandals({ searchQuery: 'pioneer athletic' }, undefined, undefined, [], 'kali');
const pioneerInDurga = PandalService.filterPandals({ searchQuery: 'pioneer athletic' }, undefined, undefined, [], 'durga');
assert(pioneerInKali.length > 0, `Search for 'pioneer athletic' in Kali mode returns ${pioneerInKali.length} result(s)`);
assert(pioneerInDurga.length === 0, `Search for 'pioneer athletic' in Durga mode returns EXACTLY 0 results (no leakage)`);

const kncInKali = PandalService.filterPandals({ searchQuery: 'knc regiment' }, undefined, undefined, [], 'kali');
const kncInDurga = PandalService.filterPandals({ searchQuery: 'knc regiment' }, undefined, undefined, [], 'durga');
assert(kncInKali.length > 0, `Search for 'knc regiment' in Kali mode returns ${kncInKali.length} result(s)`);
assert(kncInDurga.length === 0, `Search for 'knc regiment' in Durga mode returns EXACTLY 0 results (no leakage)`);

const boroMaaInKali = PandalService.filterPandals({ searchQuery: 'boro maa' }, undefined, undefined, [], 'kali');
const boroMaaInDurga = PandalService.filterPandals({ searchQuery: 'boro maa' }, undefined, undefined, [], 'durga');
assert(boroMaaInKali.length > 0, `Search for 'boro maa' in Kali mode returns ${boroMaaInKali.length} result(s)`);
assert(boroMaaInDurga.length === 0, `Search for 'boro maa' in Durga mode returns EXACTLY 0 results (no leakage)`);

// 4. ZONE & CATEGORY FILTERING SEPARATION
console.log('\n--- 4. ZONE & CATEGORY FILTERING ISOLATION ---');
const barasatInDurga = PandalService.filterPandals({ zone: 'Barasat' }, undefined, undefined, [], 'durga');
const barasatInKali = PandalService.filterPandals({ zone: 'Barasat' }, undefined, undefined, [], 'kali');
assert(barasatInDurga.length === 0, 'Filtering zone "Barasat" in Durga mode returns 0 results');
assert(barasatInKali.length > 0, `Filtering zone "Barasat" in Kali mode returns ${barasatInKali.length} results`);

const bonediInDurga = PandalService.filterPandals({ bonediBariOnly: true }, undefined, undefined, [], 'durga');
const bonediInKali = PandalService.filterPandals({ bonediBariOnly: true }, undefined, undefined, [], 'kali');
assert(bonediInDurga.length > 0, `Bonedi Bari filter in Durga mode returns ${bonediInDurga.length} results`);
assert(bonediInKali.every((p) => p.festival === 'kali'), 'Bonedi Bari filter in Kali mode returns ONLY Kali items (0 Durga leakage)');

// 5. ACCEPTANCE TEST: DELIBERATE CUSTOM INJECTION
console.log('\n--- 5. ACCEPTANCE TEST: DELIBERATE CROSS-INJECTION ---');
const dummyDurga = {
  id: 'test-custom-durga',
  name: 'Test Custom Durga Pandal',
  nameBn: 'টেস্ট দুর্গা প্যান্ডেল',
  festival: 'durga',
  zone: 'North Kolkata',
  latitude: 22.58,
  longitude: 88.37,
  category: 'Theme',
  crowdLevel: 'Moderate',
  locality: 'Shyambazar',
  localityBn: 'শ্যামবাজার',
  address: 'Test Address',
  addressBn: 'টেস্ট ঠিকানা',
  theme: 'Test',
  themeBn: 'টেস্ট',
  description: 'Test',
  descriptionBn: 'টেস্ট',
  openingTime: '06:00',
  closingTime: '02:00',
  popularityScore: 50,
  rating: 4.5,
  reviewCount: 10,
  imageUrl: '',
  galleryImages: [],
  isFeatured: false,
  isHeritage: false,
  metroLinks: [],
  facilities: { wheelchairAccessible: true, drinkingWater: true, medicalBooth: false, vipPassEntry: false, parkingAvailable: false },
};

const dummyKali = {
  id: 'kali-custom-test',
  name: 'Test Custom Kali Pandal',
  nameBn: 'টেস্ট কালী মণ্ডপ',
  festival: 'kali',
  zone: 'Barasat',
  latitude: 22.72,
  longitude: 88.48,
  category: 'Artistic',
  crowdLevel: 'High',
  locality: 'Barasat',
  localityBn: 'বারাসাত',
  address: 'Test Address',
  addressBn: 'টেস্ট ঠিকানা',
  theme: 'Test',
  themeBn: 'টেস্ট',
  description: 'Test',
  descriptionBn: 'টেস্ট',
  openingTime: '06:00',
  closingTime: '02:00',
  popularityScore: 50,
  rating: 4.5,
  reviewCount: 10,
  imageUrl: '',
  galleryImages: [],
  isFeatured: false,
  isHeritage: false,
  metroLinks: [],
  facilities: { wheelchairAccessible: true, drinkingWater: true, medicalBooth: false, vipPassEntry: false, parkingAvailable: false },
};

const injectedExtras = [dummyDurga, dummyKali];

const durgaWithInjection = PandalService.filterPandals({}, undefined, undefined, injectedExtras, 'durga');
const kaliWithInjection = PandalService.filterPandals({}, undefined, undefined, injectedExtras, 'kali');

assert(
  durgaWithInjection.some((p) => p.id === 'test-custom-durga') &&
  !durgaWithInjection.some((p) => p.id === 'kali-custom-test'),
  'Durga pipeline accepts dummy Durga pandal and REJECTS injected dummy Kali pandal'
);

assert(
  kaliWithInjection.some((p) => p.id === 'kali-custom-test') &&
  !kaliWithInjection.some((p) => p.id === 'test-custom-durga'),
  'Kali pipeline accepts dummy Kali pandal and REJECTS injected dummy Durga pandal'
);

// 6. NEARBY PANDALS SEPARATION
console.log('\n--- 6. NEARBY PANDAL ISOLATION ---');
const sampleDurga = PANDALS_DATA[0];
const sampleKali = KALI_PANDALS_DATA[0];

const nearbyDurga = PandalService.getNearbyPandals(sampleDurga, 4, 'durga');
const nearbyKali = PandalService.getNearbyPandals(sampleKali, 4, 'kali');

assert(nearbyDurga.length === 4 && nearbyDurga.every((p) => p.festival === 'durga'), 'Nearby for Durga returns 4 Durga pandals (0 Kali)');
assert(nearbyKali.length === 4 && nearbyKali.every((p) => p.festival === 'kali'), 'Nearby for Kali returns 4 Kali pandals (0 Durga)');

console.log(`\n==========================================`);
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`==========================================`);

if (failCount > 0) {
  process.exit(1);
}
