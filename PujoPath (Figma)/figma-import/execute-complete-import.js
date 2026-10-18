const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'exports');

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

console.log(`Loaded ${desktopSvgs.length} desktop SVGs, ${webMobileSvgs.length} web mobile SVGs, ${capMobileSvgs.length} capacitor mobile SVGs.`);

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

async function main() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!tab) {
    throw new Error('Figma design tab not found');
  }

  console.log('Connecting to Figma design tab:', tab.url);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  const importPayload = {
    tokens,
    desktopSvgs,
    webMobileSvgs,
    capMobileSvgs
  };

  const evalExpression = `(() => {
    try {
      const data = ${JSON.stringify(importPayload)};
      
      function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        return { r, g, b };
      }

      // 1. Create paint styles
      const createdStyles = [];
      for (const t of data.tokens) {
        let style = figma.getLocalPaintStyles().find(s => s.name === t.name);
        if (!style) {
          style = figma.createPaintStyle();
          style.name = t.name;
        }
        style.paints = [{ type: 'SOLID', color: hexToRgb(t.hex) }];
        createdStyles.push(style.name);
      }

      // 2. Helper to get or create page
      function getOrCreatePage(pageName) {
        let page = figma.root.children.find(p => p.name === pageName);
        if (!page) {
          // If Page 1 exists and hasn't been repurposed
          const page1 = figma.root.children.find(p => p.name === 'Page 1');
          if (page1 && pageName === 'Web — Desktop') {
            page1.name = 'Web — Desktop';
            page = page1;
          } else {
            page = figma.createPage();
            page.name = pageName;
          }
        }
        return page;
      }

      // 3. Helper to import screens onto a page
      function importScreens(page, screens, spacing = 120) {
        figma.currentPage = page;
        // Clean existing test nodes if any
        const testNodes = page.children.filter(c => c.name === 'Test_Node');
        for (const tn of testNodes) tn.remove();

        let currentX = 0;
        const frames = [];
        for (const s of screens) {
          // Check if already exists to avoid duplicates
          let existing = page.children.find(c => c.name === s.name);
          if (existing) {
            existing.remove();
          }
          const node = figma.createNodeFromSvg(s.svg);
          node.name = s.name;
          node.x = currentX;
          node.y = 0;
          page.appendChild(node);
          frames.push({
            name: node.name,
            type: node.type,
            width: node.width,
            height: node.height,
            childCount: node.children ? node.children.length : 0
          });
          currentX += node.width + spacing;
        }
        if (page.children.length > 0) {
          figma.viewport.scrollAndZoomIntoView(page.children);
        }
        return frames;
      }

      // Execute Page 1
      const p1 = getOrCreatePage('Web — Desktop');
      const dFrames = importScreens(p1, data.desktopSvgs, 140);

      // Execute Page 2
      const p2 = getOrCreatePage('Web — Mobile');
      const wmFrames = importScreens(p2, data.webMobileSvgs, 80);

      // Execute Page 3
      const p3 = getOrCreatePage('Capacitor — Android Mobile');
      const cmFrames = importScreens(p3, data.capMobileSvgs, 80);

      // Set current page back to desktop
      figma.currentPage = p1;

      return {
        success: true,
        documentTitle: document.title,
        pages: figma.root.children.map(p => ({
          name: p.name,
          frameCount: p.children.length,
          frames: p.children.map(c => c.name)
        })),
        totalStyles: figma.getLocalPaintStyles().length,
        framesSummary: {
          desktop: dFrames,
          webMobile: wmFrames,
          capacitorMobile: cmFrames
        }
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        stack: err.stack
      };
    }
  })()`;

  ws.onopen = () => {
    console.log('Sending import command via CDP...');
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: evalExpression,
        returnByValue: true
      }
    }));
  };

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('IMPORT COMPLETE RESPONSE:');
      console.log(JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };

  ws.onerror = err => console.error('WS Error:', err);
}

main().catch(console.error);
