const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'exports');
const pluginDir = path.join(__dirname, 'plugin');

const desktopFiles = [
  '01_web_desktop_home.svg',
  '02_web_desktop_developer.svg',
  '03_web_desktop_explore.svg',
  '04_web_desktop_calendar.svg',
  '05_web_desktop_planner.svg',
  '06_web_desktop_metro.svg'
];

const webMobileFiles = [
  '01_web_mobile_home.svg',
  '02_web_mobile_developer.svg',
  '03_web_mobile_explore.svg',
  '04_web_mobile_calendar.svg',
  '05_web_mobile_planner.svg'
];

const capMobileFiles = [
  '01_capacitor_launch_splash.svg',
  '02_capacitor_android_developer.svg',
  '03_capacitor_android_drawer.svg',
  '04_capacitor_android_home.svg',
  '05_capacitor_android_calendar.svg',
  '06_capacitor_android_explore.svg'
];

function loadSvgs(folder, files) {
  return files.map(f => {
    const filePath = path.join(exportsDir, folder, f);
    const content = fs.readFileSync(filePath, 'utf8');
    const name = f.replace('.svg', '');
    return { name, svg: content };
  });
}

const desktopSvgs = loadSvgs('web-desktop', desktopFiles);
const webMobileSvgs = loadSvgs('web-mobile', webMobileFiles);
const capMobileSvgs = loadSvgs('capacitor-mobile', capMobileFiles);

console.log(`Loaded ${desktopSvgs.length} desktop SVGs, ${webMobileSvgs.length} web mobile SVGs, ${capMobileSvgs.length} capacitor SVGs.`);

const pluginCode = `// PujoPath Complete UI/UX Importer & Design System Generator
// Creates 3 pages, 19 design tokens, and 17 genuine editable vector frames

figma.showUI(__html__, { width: 400, height: 480, title: 'PujoPath Design Importer' });

function log(msg) {
  figma.ui.postMessage({ log: msg });
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b };
}

function createPaintStyles() {
  log('Generating 19 Design Token Color Styles...');
  const tokens = [
    { name: 'PujoPath/Brand/Primary Red', hex: '#b42323' },
    { name: 'PujoPath/Brand/Red Hover', hex: '#971e1e' },
    { name: 'PujoPath/Brand/Red Soft', hex: '#fdeeee' },
    { name: 'PujoPath/Brand/Gold Accent', hex: '#d97706' },
    { name: 'PujoPath/Brand/Gold Light', hex: '#fef3c7' },
    { name: 'PujoPath/Light/Canvas Background', hex: '#fcfaf7' },
    { name: 'PujoPath/Light/Card Surface', hex: '#ffffff' },
    { name: 'PujoPath/Light/Secondary Surface', hex: '#f5f1eb' },
    { name: 'PujoPath/Light/Border', hex: '#e8e1d9' },
    { name: 'PujoPath/Light/Border Subtle', hex: '#f0eae2' },
    { name: 'PujoPath/Light/Text Primary', hex: '#242424' },
    { name: 'PujoPath/Light/Text Secondary', hex: '#5c524a' },
    { name: 'PujoPath/Light/Text Muted', hex: '#7e7268' },
    { name: 'PujoPath/Dark/Canvas Background', hex: '#14110e' },
    { name: 'PujoPath/Dark/Card Surface', hex: '#1a1613' },
    { name: 'PujoPath/Dark/Secondary Surface', hex: '#251e18' },
    { name: 'PujoPath/Dark/Border', hex: '#2f2720' },
    { name: 'PujoPath/Dark/Text Primary', hex: '#ede5dc' },
    { name: 'PujoPath/Dark/Text Secondary', hex: '#b5aaa0' }
  ];

  for (const t of tokens) {
    const existing = figma.getLocalPaintStyles().find(s => s.name === t.name);
    const style = existing || figma.createPaintStyle();
    style.name = t.name;
    style.paints = [{ type: 'SOLID', color: hexToRgb(t.hex) }];
  }
  log('✓ Created 19 Design Token Color Styles');
}

const DESKTOP_SCREENS = ${JSON.stringify(desktopSvgs)};
const WEB_MOBILE_SCREENS = ${JSON.stringify(webMobileSvgs)};
const CAPACITOR_SCREENS = ${JSON.stringify(capMobileSvgs)};

function getOrCreatePage(pageName) {
  let page = figma.root.children.find(p => p.name === pageName);
  if (!page) {
    const unrenamed = figma.root.children.find(p => p.name === 'Page 1' || p.name === 'Untitled');
    if (unrenamed && !figma.root.children.find(p => p.name === 'Web — Desktop')) {
      unrenamed.name = pageName;
      page = unrenamed;
    } else {
      page = figma.createPage();
      page.name = pageName;
    }
  }
  return page;
}

function importScreensToPage(page, screens, spacing = 120) {
  figma.currentPage = page;
  let currentX = 0;
  const createdNodes = [];

  for (const s of screens) {
    try {
      const node = figma.createNodeFromSvg(s.svg);
      node.name = s.name;
      node.x = currentX;
      node.y = 0;
      page.appendChild(node);
      createdNodes.push(node);
      currentX += node.width + spacing;
      log('  ✓ Created frame: ' + s.name);
    } catch (err) {
      log('  ⚠️ Error importing ' + s.name + ': ' + err.message);
    }
  }

  if (createdNodes.length > 0) {
    figma.viewport.scrollAndZoomIntoView(createdNodes);
  }
  return createdNodes;
}

function generateDesktop() {
  log('Importing 6 Web Desktop screens...');
  const page = getOrCreatePage('Web — Desktop');
  importScreensToPage(page, DESKTOP_SCREENS, 120);
  log('✓ Web — Desktop completed (6 screens)');
}

function generateWebMobile() {
  log('Importing 5 Web Mobile screens...');
  const page = getOrCreatePage('Web — Mobile');
  importScreensToPage(page, WEB_MOBILE_SCREENS, 80);
  log('✓ Web — Mobile completed (5 screens)');
}

function generateCapacitor() {
  log('Importing 6 Capacitor Android screens...');
  const page = getOrCreatePage('Capacitor — Android Mobile');
  importScreensToPage(page, CAPACITOR_SCREENS, 80);
  log('✓ Capacitor — Android Mobile completed (6 screens)');
}

function runAll() {
  log('Starting full import...');
  try {
    figma.root.name = 'PujoPath — Complete UI/UX Design';
    log('✓ Document renamed to \"PujoPath — Complete UI/UX Design\"');
  } catch (e) {
    log('Notice: Document title unchanged (' + e.message + ')');
  }

  createPaintStyles();
  generateDesktop();
  generateWebMobile();
  generateCapacitor();

  const desktopPage = figma.root.children.find(p => p.name === 'Web — Desktop');
  if (desktopPage) figma.currentPage = desktopPage;

  log('🎉 SUCCESS: All 3 Pages & 17 Screens Imported with genuine editable vectors!');
  log('Document: ' + figma.root.name);
  log('Pages: ' + figma.root.children.map(p => p.name + ' (' + p.children.length + ' frames)').join(', '));
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-all' || msg.type === 'run-import') {
    runAll();
  } else if (msg.type === 'generate-desktop') {
    generateDesktop();
  } else if (msg.type === 'generate-web-mobile') {
    generateWebMobile();
  } else if (msg.type === 'generate-capacitor') {
    generateCapacitor();
  } else if (msg.type === 'generate-tokens') {
    createPaintStyles();
  }
};
`;

fs.writeFileSync(path.join(pluginDir, 'code.js'), pluginCode, 'utf8');
console.log('Successfully wrote updated bundled code.js, size:', (pluginCode.length / 1024).toFixed(1), 'KB');
