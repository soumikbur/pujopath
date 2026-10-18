const fs = require('fs');
const path = require('path');

const FIGMA_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(FIGMA_DIR, 'exports');
const ASSETS_DIR = path.join(FIGMA_DIR, 'assets');

// Helper to find and read image to base64
function getBase64Image(relPath) {
  const possiblePaths = [
    path.join(ASSETS_DIR, 'images', relPath),
    path.join(ASSETS_DIR, relPath)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p);
      let mime = 'image/jpeg';
      if (p.endsWith('.webp')) mime = 'image/webp';
      else if (p.endsWith('.png')) mime = 'image/png';
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
  }
  console.warn('Asset not found:', relPath);
  return '';
}

console.log('Encoding authentic high-resolution assets...');
const IMAGES = {
  moumita: getBase64Image('developers/moumita.jpg'),
  soumik: getBase64Image('developers/soumik.jpg'),
  bagbazar: getBase64Image('pandals/bagbazar-sarbojanin.jpg'),
  kumartuli: getBase64Image('pandals/kumartuli-park.jpg'),
  sovabazar: getBase64Image('pandals/sovabazar-rajbari.jpg'),
  suruchi: getBase64Image('pandals/suruchi-sangha.jpg'),
  ekdalia: getBase64Image('pandals/ekdalia-evergreen.jpg'),
  sreebhumi: getBase64Image('pandals/sreebhumi-sporting-club.jpg'),
  collegeSquare: getBase64Image('pandals/college-square.jpg'),
  durgaBg: getBase64Image('durga-bg.jpg'),
  durgaMandala: getBase64Image('durga-mandala.jpg'),
  miniplayer: getBase64Image('backgrounds/durga-miniplayer.jpg') || getBase64Image('durga-miniplayer.jpg'),
  ghibliBg: getBase64Image('backgrounds/ghibli-durga-idol-flowers-landscape.jpg'),
  heroDurga: getBase64Image('hero-durga.jpg'),
};
console.log('All authentic assets loaded successfully.');

// Common Color Palette
const COLORS = {
  // Brand
  red: '#b42323',
  redHover: '#971e1e',
  redSoftDark: 'rgba(180, 35, 35, 0.22)',
  redBorderDark: 'rgba(180, 35, 35, 0.45)',
  redSoftLight: '#fbe8e6',
  redBorderLight: '#f5c6c2',
  gold: '#d97706',
  goldLight: '#f59e0b',
  
  // Dark Theme (Web Desktop & Web Mobile)
  darkBg: '#161311',
  darkCard: '#201c18',
  darkCardElevated: '#26201b',
  darkCardHover: '#2b241e',
  darkBorder: '#332b24',
  darkBorderSubtle: '#2a231d',
  darkTextMain: '#ffffff',
  darkTextSecondary: '#ede5dc',
  darkTextMuted: '#a89e95',
  darkTextFaint: '#6e645c',
  
  // Light Theme (Capacitor Android)
  lightBg: '#fcfaf7',
  lightCard: '#ffffff',
  lightCardElevated: '#ffffff',
  lightBorder: '#e8e1d9',
  lightBorderSubtle: '#f0eae2',
  lightTextMain: '#1a1715',
  lightTextSecondary: '#242424',
  lightTextMuted: '#625b55',
  lightTextFaint: '#8f847b',
  
  // Accents
  teal: '#0d9488',
  blue: '#2563eb',
  purple: '#7c3aed',
  orange: '#ea580c',
  linkedin: '#0a66c2',
};

const SVG_FONTS_AND_STYLES = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800;900&amp;display=swap');
      text { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      .brand { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
  </defs>
`;

module.exports = {
  FIGMA_DIR,
  EXPORTS_DIR,
  IMAGES,
  COLORS,
  SVG_FONTS_AND_STYLES,
};
