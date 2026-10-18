const http = require('http');
const fs = require('fs');
const path = require('path');

const SVG_DIR = path.resolve(__dirname, '../exports/web-mobile-faithful');

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

// Banner SVGs for clear section labeling
function generateSectionLabelSvg(title, subtitle, isDark, width = 560, height = 80) {
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

  const mobilePage = pageCheck.find(p => p.name === 'Web — Mobile');
  if (!mobilePage) {
    console.error('Target page "Web — Mobile" not found!');
    ws.close();
    process.exit(1);
  }

  console.log('\nCONFIRMATION:');
  console.log('- "Web — Desktop" (all 24 frames/banners) will NOT be modified.');
  console.log('- "Capacitor — Android Mobile" will NOT be modified.');
  console.log('- "Web — Mobile" will be updated with 12 Light Mode + 12 Dark Mode authentic frames.');

  // 2. Clear old placeholder children ONLY on "Web — Mobile"
  console.log('\nClearing old children ONLY on "Web — Mobile"...');
  const clearRes = await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
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
  console.log('Cleared Web — Mobile:', clearRes);

  // 3. Define the 12 screens
  const screenDefs = [
    { num: '01', id: 'home', name: '01_web_mobile_home' },
    { num: '02', id: 'explore', name: '02_web_mobile_explore' },
    { num: '03', id: 'map', name: '03_web_mobile_map' },
    { num: '04', id: 'planner', name: '04_web_mobile_planner' },
    { num: '05', id: 'calendar', name: '05_web_mobile_calendar' },
    { num: '06', id: 'metro', name: '06_web_mobile_metro' },
    { num: '07', id: 'music', name: '07_web_mobile_music' },
    { num: '08', id: 'mahalaya', name: '08_web_mobile_mahalaya' },
    { num: '09', id: 'developer', name: '09_web_mobile_developer' },
    { num: '10', id: 'about', name: '10_web_mobile_about' },
    { num: '11', id: 'feedback', name: '11_web_mobile_feedback' },
    { num: '12', id: 'more_drawer', name: '12_web_mobile_more_drawer' }
  ];

  const STEP_X = 470; // 390 + 80 gap
  const LIGHT_Y = 0;
  const DARK_Y = 2500;

  // 4. Import Row 1: Mobile Web — Light Mode
  console.log('\n--- IMPORTING ROW 1: MOBILE WEB — LIGHT MODE ---');
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

    await evaluate(`window.__tempMobSvg = ${JSON.stringify(svgContent)}`);

    const res = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Web — Mobile');
        const node = figma.createNodeFromSvg(window.__tempMobSvg);
        node.name = '${frameName}';
        node.x = ${posX};
        node.y = ${LIGHT_Y};
        page.appendChild(node);
        delete window.__tempMobSvg;
        return { success: true, name: node.name, x: node.x, y: node.y, w: node.width, h: node.height };
      } catch (err) {
        delete window.__tempMobSvg;
        return { success: false, error: err.message };
      }
    })()`);

    if (res.success) {
      console.log(`✓ [Light ${i + 1}/12] ${res.name}: ${res.w}x${res.h} at (${res.x}, ${res.y})`);
    } else {
      console.error(`Failed Light ${frameName}:`, res.error);
    }
  }

  // 5. Import Row 2: Mobile Web — Dark Mode
  console.log('\n--- IMPORTING ROW 2: MOBILE WEB — DARK MODE ---');
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

    await evaluate(`window.__tempMobSvg = ${JSON.stringify(svgContent)}`);

    const res = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Web — Mobile');
        const node = figma.createNodeFromSvg(window.__tempMobSvg);
        node.name = '${frameName}';
        node.x = ${posX};
        node.y = ${DARK_Y};
        page.appendChild(node);
        delete window.__tempMobSvg;
        return { success: true, name: node.name, x: node.x, y: node.y, w: node.width, h: node.height };
      } catch (err) {
        delete window.__tempMobSvg;
        return { success: false, error: err.message };
      }
    })()`);

    if (res.success) {
      console.log(`✓ [Dark ${i + 1}/12] ${res.name}: ${res.w}x${res.h} at (${res.x}, ${res.y})`);
    } else {
      console.error(`Failed Dark ${frameName}:`, res.error);
    }
  }

  // 6. Add prominent section labels
  console.log('\nAdding Section Labels for Mobile Web Light and Dark Modes...');
  const lightBannerSvg = generateSectionLabelSvg(
    'Mobile Web — Light Mode',
    'Faithful reproduction of live mobile website (390px viewport, Light Mode)',
    false
  );
  const darkBannerSvg = generateSectionLabelSvg(
    'Mobile Web — Dark Mode',
    'Faithful reproduction of live mobile website (390px viewport, Dark Mode)',
    true
  );

  await evaluate(`window.__tempLightBanner = ${JSON.stringify(lightBannerSvg)}`);
  await evaluate(`window.__tempDarkBanner = ${JSON.stringify(darkBannerSvg)}`);

  const bannerRes = await evaluate(`(() => {
    try {
      const page = figma.root.children.find(p => p.name === 'Web — Mobile');
      
      const lightNode = figma.createNodeFromSvg(window.__tempLightBanner);
      lightNode.name = 'Label — Mobile Web — Light Mode';
      lightNode.x = 0;
      lightNode.y = -140;
      page.appendChild(lightNode);

      const darkNode = figma.createNodeFromSvg(window.__tempDarkBanner);
      darkNode.name = 'Label — Mobile Web — Dark Mode';
      darkNode.x = 0;
      darkNode.y = 2360;
      page.appendChild(darkNode);

      delete window.__tempLightBanner;
      delete window.__tempDarkBanner;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  })()`);
  console.log('Banner labels creation:', bannerRes);

  // 7. Center viewport to show all frames
  console.log('\nCentering viewport to show all mobile frames on Web — Mobile...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    if (page.children.length > 0) {
      figma.viewport.scrollAndZoomIntoView(page.children);
    }
  })()`);

  // 8. Final document audit
  console.log('\n--- Final Verification of All Pages in Document ---');
  const finalSummary = await evaluate(`(() => {
    return figma.root.children.map(p => ({
      name: p.name,
      childCount: p.children.length,
      children: p.children.map(c => ({
        name: c.name,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height
      }))
    }));
  })()`);

  console.log(JSON.stringify(finalSummary, null, 2));

  ws.close();
  console.log('\n✓ Web — Mobile import and verification completed successfully!');
}

main().catch(console.error);
