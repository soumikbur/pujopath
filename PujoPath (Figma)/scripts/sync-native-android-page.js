const fs = require('fs');
const path = require('path');
const http = require('http');

const SVG_DIR = path.resolve(__dirname, '../exports/native-android');

const screenDefs = [
  { name: '01_native_festival_select', title: 'Festival Select' },
  { name: '02_native_home', title: 'Home (Durga Puja)' },
  { name: '03_native_explore', title: 'Explore Pandals' },
  { name: '04_native_map', title: 'Interactive Map' },
  { name: '05_native_planner', title: 'Route Planner' },
  { name: '06_native_calendar', title: 'Puja Calendar & Almanac' },
  { name: '07_native_metro', title: 'Metro Transit Guide' },
  { name: '08_native_music_player', title: 'Festive Puja Music' },
  { name: '09_native_mahalaya', title: 'Mahalaya Broadcast Archive' },
  { name: '10_native_developer', title: 'Developer & Team' },
  { name: '11_native_helpline', title: 'Emergency Helplines' },
  { name: '12_native_feedback', title: 'Feedback & Rating' },
  { name: '13_native_notifications', title: 'Notifications & Alerts' },
  { name: '14_native_pandal_detail', title: 'Pandal Detail View' },
  { name: '15_native_more_drawer', title: 'Navigation Drawer' },
  { name: '16_native_kali_home', title: 'Kali Puja Experience' }
];

function generateSectionLabelSvg(title, subtitle, isDark, width = 640, height = 80) {
  const bg = isDark ? '#1a1613' : '#ffffff';
  const border = isDark ? '#3d3834' : '#e5e0d8';
  const textTitle = isDark ? '#ffffff' : '#1a1715';
  const textSub = isDark ? '#a8a29e' : '#736c65';
  const icon = isDark ? '🌙' : '☀️';

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="16" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
    <text x="24" y="38" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="${textTitle}">${icon} ${title}</text>
    <text x="24" y="60" font-family="Inter, sans-serif" font-size="12" font-weight="500" fill="${textSub}">${subtitle}</text>
  </svg>`;
}

async function getFigmaConnection() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));

  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      contexts.push(msg.params.context);
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  await new Promise(r => setTimeout(r, 1000));

  let targetContextId = null;
  for (const ctx of contexts) {
    const res = await new Promise(resolve => {
      const id = 1000 + ctx.id;
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: 'typeof figma', contextId: ctx.id, returnByValue: true }
      }));
    });

    if (res === 'object') {
      targetContextId = ctx.id;
      console.log(`Discovered Figma API Context ID: ${ctx.id}`);
      break;
    }
  }

  if (!targetContextId) {
    ws.close();
    throw new Error('Figma context not found');
  }

  let reqId = 2000;
  function evaluate(expr) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result?.result?.value !== undefined) resolve(msg.result.result.value);
          else if (msg.result?.result?.description) resolve(msg.result.result.description);
          else if (msg.error) reject(new Error(JSON.stringify(msg.error)));
          else resolve(msg);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: expr,
          contextId: targetContextId,
          returnByValue: true,
          awaitPromise: true
        }
      }));
    });
  }

  return { ws, evaluate };
}

async function main() {
  console.log('Connecting to Figma via CDP...');
  const { ws, evaluate } = await getFigmaConnection();

  // 1. Inspect existing Figma pages
  console.log('\n--- 1. Inspecting Existing Figma Pages ---');
  const initialPages = await evaluate(`(() => {
    return figma.root.children.map(p => ({
      id: p.id,
      name: p.name,
      childCount: p.children.length
    }));
  })()`);
  console.log('Initial Figma Pages:', JSON.stringify(initialPages, null, 2));

  // Remove obsolete Capacitor page if it somehow remains
  const capRemoval = await evaluate(`(() => {
    const capPage = figma.root.children.find(p => p.name.includes('Capacitor'));
    if (capPage) {
      capPage.remove();
      return { removed: true, name: capPage.name };
    }
    return { removed: false };
  })()`);
  if (capRemoval.removed) {
    console.log('✓ Successfully removed obsolete Capacitor page:', capRemoval.name);
  }

  // 2. Locate or create "Native Android" page
  console.log('\n--- 2. Setting Up "Native Android" Page ---');
  const pageSetup = await evaluate(`(async () => {
    let nativePage = figma.root.children.find(p => p.name === 'Native Android');
    let created = false;
    if (!nativePage) {
      nativePage = figma.createPage();
      nativePage.name = 'Native Android';
      created = true;
    }

    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(nativePage);
    } else {
      figma.currentPage = nativePage;
    }

    // Clean existing children if any
    while (nativePage.children.length > 0) {
      nativePage.children[0].remove();
    }

    return {
      id: nativePage.id,
      name: nativePage.name,
      created,
      childCount: nativePage.children.length
    };
  })()`);
  console.log('Native Android Page Setup:', pageSetup);

  // Layout parameters
  const STEP_X = 520;
  const LIGHT_Y = 0;
  const DARK_Y = 1600;

  // 3. Import Row 1: Native Android — Light Mode (16 screens)
  console.log('\n--- 3. Importing Row 1: Native Android — Light Mode (16 Screens) ---');
  for (let i = 0; i < screenDefs.length; i++) {
    const s = screenDefs[i];
    const fileName = `${s.name}_light.svg`;
    const filePath = path.join(SVG_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`SVG missing: ${filePath}`);
      continue;
    }

    const svgContent = fs.readFileSync(filePath, 'utf8');
    const posX = i * STEP_X;
    const frameName = `${s.name} (Light Mode)`;

    await evaluate(`window.__tempNativeSvg = ${JSON.stringify(svgContent)}`);

    const res = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Native Android');
        const node = figma.createNodeFromSvg(window.__tempNativeSvg);
        node.name = '${frameName}';
        node.x = ${posX};
        node.y = ${LIGHT_Y};
        page.appendChild(node);
        delete window.__tempNativeSvg;
        return { success: true, name: node.name, x: node.x, y: node.y, w: node.width, h: node.height };
      } catch (err) {
        delete window.__tempNativeSvg;
        return { success: false, error: err.message };
      }
    })()`);

    if (res.success) {
      console.log(`✓ [Light ${i + 1}/16] ${res.name}: ${res.w}x${res.h} at (${res.x}, ${res.y})`);
    } else {
      console.error(`✗ Failed Light ${frameName}:`, res.error);
    }
  }

  // 4. Import Row 2: Native Android — Dark Mode (16 screens)
  console.log('\n--- 4. Importing Row 2: Native Android — Dark Mode (16 Screens) ---');
  for (let i = 0; i < screenDefs.length; i++) {
    const s = screenDefs[i];
    const fileName = `${s.name}_dark.svg`;
    const filePath = path.join(SVG_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`SVG missing: ${filePath}`);
      continue;
    }

    const svgContent = fs.readFileSync(filePath, 'utf8');
    const posX = i * STEP_X;
    const frameName = `${s.name} (Dark Mode)`;

    await evaluate(`window.__tempNativeSvg = ${JSON.stringify(svgContent)}`);

    const res = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Native Android');
        const node = figma.createNodeFromSvg(window.__tempNativeSvg);
        node.name = '${frameName}';
        node.x = ${posX};
        node.y = ${DARK_Y};
        page.appendChild(node);
        delete window.__tempNativeSvg;
        return { success: true, name: node.name, x: node.x, y: node.y, w: node.width, h: node.height };
      } catch (err) {
        delete window.__tempNativeSvg;
        return { success: false, error: err.message };
      }
    })()`);

    if (res.success) {
      console.log(`✓ [Dark ${i + 1}/16] ${res.name}: ${res.w}x${res.h} at (${res.x}, ${res.y})`);
    } else {
      console.error(`✗ Failed Dark ${frameName}:`, res.error);
    }
  }

  // 5. Add Section Labels
  console.log('\n--- 5. Adding Section Labels ---');
  const lightBannerSvg = generateSectionLabelSvg(
    'Native Android — Light Mode',
    'Faithful reproduction of live native Android application (Pixel 10 Pro XL / 412x915 viewport, Light Mode)',
    false
  );
  const darkBannerSvg = generateSectionLabelSvg(
    'Native Android — Dark Mode',
    'Faithful reproduction of live native Android application (Pixel 10 Pro XL / 412x915 viewport, Dark Mode)',
    true
  );

  await evaluate(`window.__tempLightBanner = ${JSON.stringify(lightBannerSvg)}`);
  await evaluate(`window.__tempDarkBanner = ${JSON.stringify(darkBannerSvg)}`);

  const bannerRes = await evaluate(`(() => {
    try {
      const page = figma.root.children.find(p => p.name === 'Native Android');
      
      const lightNode = figma.createNodeFromSvg(window.__tempLightBanner);
      lightNode.name = 'Label — Native Android — Light Mode';
      lightNode.x = 0;
      lightNode.y = -140;
      page.appendChild(lightNode);

      const darkNode = figma.createNodeFromSvg(window.__tempDarkBanner);
      darkNode.name = 'Label — Native Android — Dark Mode';
      darkNode.x = 0;
      darkNode.y = ${DARK_Y - 140};
      page.appendChild(darkNode);

      delete window.__tempLightBanner;
      delete window.__tempDarkBanner;

      // Frame the page nicely in viewport
      figma.viewport.scrollAndZoomIntoView(page.children);

      return { success: true, childCount: page.children.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  })()`);
  console.log('Banner labels creation & viewport zoom:', bannerRes);

  // 6. Comprehensive Verification of Document State
  console.log('\n--- 6. Document State Verification ---');
  const finalDoc = await evaluate(`(() => {
    return {
      title: document.title,
      pages: figma.root.children.map(p => ({
        id: p.id,
        name: p.name,
        childCount: p.children.length,
        frames: p.children.map(c => c.name)
      }))
    };
  })()`);
  console.log('Final Document Pages Summary:');
  finalDoc.pages.forEach(p => {
    console.log(`- Page "${p.name}" (ID: ${p.id}): ${p.childCount} children`);
  });

  ws.close();
  console.log('\n✓ Native Android page synchronization complete!');
}

main().catch(err => {
  console.error('Fatal error during Native Android sync:', err);
  process.exit(1);
});
