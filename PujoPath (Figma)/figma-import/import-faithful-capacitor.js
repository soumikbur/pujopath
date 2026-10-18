const http = require('http');
const fs = require('fs');
const path = require('path');

const SVG_DIR = path.resolve(__dirname, '../exports/capacitor-mobile');

async function getFigmaConnection() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');

  await new Promise((res) => http.get(`http://127.0.0.1:9222/json/activate/${figmaTab.id}`, () => res()));

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') contexts.push(msg.params.context);
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

// Banner SVGs for section labeling
function generateSectionLabelSvg(title, subtitle, isDark, width = 620, height = 80) {
  const bg = isDark ? '#1e1915' : '#ffffff';
  const border = isDark ? '#3d3227' : '#e8e1d9';
  const textTitle = isDark ? '#f8f3ec' : '#1a1715';
  const textSub = isDark ? '#d4c7ba' : '#7e7268';
  const icon = isDark ? '🌙' : '☀️';

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="16" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
    <text x="24" y="38" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="${textTitle}">${icon} ${title}</text>
    <text x="24" y="60" font-family="Inter, sans-serif" font-size="12" font-weight="500" fill="${textSub}">${subtitle}</text>
  </svg>`;
}

async function main() {
  console.log('Connecting to Figma tab...');
  const { ws, evaluate } = await getFigmaConnection();

  // 1. Inspect existing Figma pages
  console.log('\nInspecting Figma pages...');
  const pageCheck = await evaluate(`(() => {
    return figma.root.children.map(p => ({
      id: p.id,
      name: p.name,
      childCount: p.children.length
    }));
  })()`);
  console.log('Figma pages:', JSON.stringify(pageCheck, null, 2));

  const capPage = pageCheck.find(p => p.name === 'Capacitor — Android Mobile');
  if (!capPage) {
    console.error('Target page "Capacitor — Android Mobile" not found!');
    ws.close();
    process.exit(1);
  }

  console.log('\nCONFIRMATION OF STRICT BOUNDARIES:');
  console.log('- "Web — Desktop" (all 24 frames/labels) will NOT be modified.');
  console.log('- "Web — Mobile" (all 26 frames/labels) will NOT be modified.');
  console.log('- "Capacitor — Android Mobile" will be updated with 13 Light Mode + 13 Dark Mode authentic frames.');

  // 2. Clear old placeholder children ONLY on "Capacitor — Android Mobile"
  console.log('\nClearing old children ONLY on "Capacitor — Android Mobile"...');
  const clearRes = await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    const removedCount = page.children.length;
    while (page.children.length > 0) {
      page.children[0].remove();
    }
    return { removedCount, currentCount: page.children.length };
  })()`);
  console.log('Cleared Capacitor — Android Mobile:', clearRes);

  // 3. Define the 13 screens
  const screenDefs = [
    { num: '01', id: 'splash', name: '01_capacitor_android_splash' },
    { num: '02', id: 'home', name: '02_capacitor_android_home' },
    { num: '03', id: 'explore', name: '03_capacitor_android_explore' },
    { num: '04', id: 'map', name: '04_capacitor_android_map' },
    { num: '05', id: 'planner', name: '05_capacitor_android_planner' },
    { num: '06', id: 'calendar', name: '06_capacitor_android_calendar' },
    { num: '07', id: 'metro', name: '07_capacitor_android_metro' },
    { num: '08', id: 'music_player', name: '08_capacitor_android_music_player' },
    { num: '09', id: 'mahalaya', name: '09_capacitor_android_mahalaya' },
    { num: '10', id: 'developer', name: '10_capacitor_android_developer' },
    { num: '11', id: 'about', name: '11_capacitor_android_about' },
    { num: '12', id: 'feedback', name: '12_capacitor_android_feedback' },
    { num: '13', id: 'more_drawer', name: '13_capacitor_android_more_drawer' }
  ];

  const STEP_X = 500; // 412 + 88 gap
  const LIGHT_Y = 0;
  const DARK_Y = 2540;

  // 4. Import Row 1: Capacitor Android — Light Mode
  console.log('\n--- IMPORTING ROW 1: CAPACITOR ANDROID — LIGHT MODE ---');
  for (let i = 0; i < screenDefs.length; i++) {
    const s = screenDefs[i];
    const fileName = `${s.name}_light.svg`;
    const filePath = path.join(SVG_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn('SVG missing:', filePath);
      continue;
    }
    const svgContent = fs.readFileSync(filePath, 'utf8');
    const posX = i * STEP_X;
    const frameName = `${s.name} (Light Mode)`;

    await evaluate(`window.__tempCapSvg = ${JSON.stringify(svgContent)}`);

    const res = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
        const node = figma.createNodeFromSvg(window.__tempCapSvg);
        node.name = '${frameName}';
        node.x = ${posX};
        node.y = ${LIGHT_Y};
        page.appendChild(node);
        delete window.__tempCapSvg;
        return { success: true, name: node.name, x: node.x, y: node.y, w: node.width, h: node.height };
      } catch (err) {
        delete window.__tempCapSvg;
        return { success: false, error: err.message };
      }
    })()`);

    if (res.success) {
      console.log(`[${i + 1}/${screenDefs.length}] Imported ${res.name} at (${res.x}, ${res.y}) [${res.w}x${res.h}]`);
    } else {
      console.error(`Failed to import ${frameName}:`, res.error);
    }
  }

  // Add Row 1 Section Label Banner
  const lightBannerSvg = generateSectionLabelSvg(
    'Capacitor Android — Light Mode',
    'Installed PujoPath APK Reference • Status Bar 40px • Gesture Pill • No Install Button • 412x915 CSS',
    false,
    640,
    80
  );
  await evaluate(`window.__tempCapBanner = ${JSON.stringify(lightBannerSvg)}`);
  await evaluate(`(() => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const node = figma.createNodeFromSvg(window.__tempCapBanner);
    node.name = 'Label — Capacitor Android — Light Mode';
    node.x = 0;
    node.y = -140;
    page.appendChild(node);
    delete window.__tempCapBanner;
  })()`);
  console.log('Added Section Label for Light Mode at (0, -140)');

  // 5. Import Row 2: Capacitor Android — Dark Mode
  console.log('\n--- IMPORTING ROW 2: CAPACITOR ANDROID — DARK MODE ---');
  for (let i = 0; i < screenDefs.length; i++) {
    const s = screenDefs[i];
    const fileName = `${s.name}_dark.svg`;
    const filePath = path.join(SVG_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn('SVG missing:', filePath);
      continue;
    }
    const svgContent = fs.readFileSync(filePath, 'utf8');
    const posX = i * STEP_X;
    const frameName = `${s.name} (Dark Mode)`;

    await evaluate(`window.__tempCapSvg = ${JSON.stringify(svgContent)}`);

    const res = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
        const node = figma.createNodeFromSvg(window.__tempCapSvg);
        node.name = '${frameName}';
        node.x = ${posX};
        node.y = ${DARK_Y};
        page.appendChild(node);
        delete window.__tempCapSvg;
        return { success: true, name: node.name, x: node.x, y: node.y, w: node.width, h: node.height };
      } catch (err) {
        delete window.__tempCapSvg;
        return { success: false, error: err.message };
      }
    })()`);

    if (res.success) {
      console.log(`[${i + 1}/${screenDefs.length}] Imported ${res.name} at (${res.x}, ${res.y}) [${res.w}x${res.h}]`);
    } else {
      console.error(`Failed to import ${frameName}:`, res.error);
    }
  }

  // Add Row 2 Section Label Banner
  const darkBannerSvg = generateSectionLabelSvg(
    'Capacitor Android — Dark Mode',
    'Installed PujoPath APK Reference • Status Bar 40px • Gesture Pill • No Install Button • 412x915 CSS',
    true,
    640,
    80
  );
  await evaluate(`window.__tempCapBanner = ${JSON.stringify(darkBannerSvg)}`);
  await evaluate(`(() => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const node = figma.createNodeFromSvg(window.__tempCapBanner);
    node.name = 'Label — Capacitor Android — Dark Mode';
    node.x = 0;
    node.y = 2400;
    page.appendChild(node);
    delete window.__tempCapBanner;
  })()`);
  console.log('Added Section Label for Dark Mode at (0, 2400)');

  // 6. Center Viewport on all elements
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);

  // 7. Verify all pages
  console.log('\n--- VERIFYING ENTIRE DOCUMENT STRUCTURE ---');
  const finalAudit = await evaluate(`(async () => {
    for (const p of figma.root.children) {
      if (typeof p.loadAsync === 'function') await p.loadAsync();
    }
    return figma.root.children.map(p => ({
      name: p.name,
      childCount: p.children.length,
      children: p.children.map(c => ({
        name: c.name,
        type: c.type,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height
      }))
    }));
  })()`);

  console.log(JSON.stringify(finalAudit, null, 2));

  ws.close();
  console.log('\nCapacitor Android Light & Dark Mode import completed successfully!');
}

main().catch(console.error);
