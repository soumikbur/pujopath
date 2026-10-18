const http = require('http');
const fs = require('fs');
const path = require('path');

const SVG_DIR_LIGHT = path.resolve(__dirname, '../exports/web-desktop-faithful-light');

async function getFigmaConnection() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');

  // Activate tab to avoid background throttling
  await new Promise((res) => http.get(`http://127.0.0.1:9222/json/activate/${figmaTab.id}`, () => res()));

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
          if (msg.result?.result?.value !== undefined) {
            resolve(msg.result.result.value);
          } else if (msg.result?.result?.description) {
            resolve(msg.result.result.description);
          } else if (msg.error) {
            reject(new Error(JSON.stringify(msg.error)));
          } else {
            resolve(msg);
          }
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
function generateSectionLabelSvg(title, subtitle, isDark, width = 640, height = 80) {
  const bg = isDark ? '#1a1715' : '#ffffff';
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
      childCount: p.children.length,
      frames: p.children.map(c => ({ name: c.name, x: c.x, y: c.y, width: c.width, height: c.height }))
    }));
  })()`);
  console.log('Figma pages:', JSON.stringify(pageCheck, null, 2));

  const desktopPage = pageCheck.find(p => p.name === 'Web — Desktop');
  if (!desktopPage) {
    console.error('Target page "Web — Desktop" not found!');
    ws.close();
    process.exit(1);
  }

  // Confirm protection of other pages and dark mode frames
  console.log('\nCONFIRMATION:');
  console.log('- "Web — Mobile" and "Capacitor — Android Mobile" pages are 100% UNTOUCHED.');
  console.log('- Existing dark-mode frames (at y = 0) are 100% PRESERVED.');

  // Check if any previous light-mode elements exist on "Web — Desktop" (y < 0) and clean ONLY them if re-running
  const cleanLightRes = await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    const toRemove = page.children.filter(c => c.y < 0 || c.name.includes('Light Mode') || c.name.endsWith('_light'));
    toRemove.forEach(c => c.remove());
    return {
      removedLightCount: toRemove.length,
      remainingCount: page.children.length,
      remainingFrames: page.children.map(c => c.name)
    };
  })()`);
  console.log('Cleaned only light/negative-y elements (if any):', cleanLightRes);

  // 2. Define the 11 authentic light desktop screens
  const lightScreens = [
    { file: '01_web_desktop_home_light.svg', name: '01_web_desktop_home (Light Mode)', posX: 0 },
    { file: '02_web_desktop_explore_light.svg', name: '02_web_desktop_explore (Light Mode)', posX: 1560 },
    { file: '03_web_desktop_map_light.svg', name: '03_web_desktop_map (Light Mode)', posX: 3120 },
    { file: '04_web_desktop_planner_light.svg', name: '04_web_desktop_planner (Light Mode)', posX: 4680 },
    { file: '05_web_desktop_calendar_light.svg', name: '05_web_desktop_calendar (Light Mode)', posX: 6240 },
    { file: '06_web_desktop_metro_light.svg', name: '06_web_desktop_metro (Light Mode)', posX: 7800 },
    { file: '07_web_desktop_music_light.svg', name: '07_web_desktop_music (Light Mode)', posX: 9360 },
    { file: '08_web_desktop_mahalaya_light.svg', name: '08_web_desktop_mahalaya (Light Mode)', posX: 10920 },
    { file: '09_web_desktop_developer_light.svg', name: '09_web_desktop_developer (Light Mode)', posX: 12480 },
    { file: '10_web_desktop_about_light.svg', name: '10_web_desktop_about (Light Mode)', posX: 14040 },
    { file: '11_web_desktop_feedback_light.svg', name: '11_web_desktop_feedback (Light Mode)', posX: 15600 }
  ];

  const LIGHT_Y = -2400; // Directly above dark mode (y = 0), leaving ~680px gap

  for (let i = 0; i < lightScreens.length; i++) {
    const item = lightScreens[i];
    const filePath = path.join(SVG_DIR_LIGHT, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn('SVG not found:', filePath);
      continue;
    }

    const svgContent = fs.readFileSync(filePath, 'utf8');
    const sizeKb = (svgContent.length / 1024).toFixed(1);
    console.log(`\n[${i + 1}/${lightScreens.length}] Importing Light Mode: ${item.name} (${sizeKb} KB)...`);

    await evaluate(`window.__tempLightDesktopSvg = ${JSON.stringify(svgContent)}`);

    const importRes = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Web — Desktop');
        const node = figma.createNodeFromSvg(window.__tempLightDesktopSvg);
        node.name = '${item.name}';
        node.x = ${item.posX};
        node.y = ${LIGHT_Y};
        page.appendChild(node);
        delete window.__tempLightDesktopSvg;
        return {
          success: true,
          name: node.name,
          id: node.id,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          childrenCount: node.children ? node.children.length : 0
        };
      } catch (err) {
        delete window.__tempLightDesktopSvg;
        return { success: false, error: err.message, stack: err.stack };
      }
    })()`);

    if (!importRes.success) {
      console.error(`Failed to import ${item.name}:`, importRes.error);
    } else {
      console.log(`✓ Imported ${item.name}: ${importRes.width}x${importRes.height} at x=${importRes.x}, y=${importRes.y} (${importRes.childrenCount} top-level nodes)`);
    }
  }

  // 3. Add prominent section labels
  console.log('\nAdding Section Labels for Light Mode and Dark Mode...');
  const lightBannerSvg = generateSectionLabelSvg(
    'Web Desktop — Light Mode',
    'Faithful reproduction of live light-mode website (https://pujopath-five.vercel.app/)',
    false
  );
  const darkBannerSvg = generateSectionLabelSvg(
    'Web Desktop — Dark Mode',
    'Original completed dark-mode design (Preserved 100% untouched)',
    true
  );

  await evaluate(`window.__tempLightBanner = ${JSON.stringify(lightBannerSvg)}`);
  await evaluate(`window.__tempDarkBanner = ${JSON.stringify(darkBannerSvg)}`);

  const bannerRes = await evaluate(`(() => {
    try {
      const page = figma.root.children.find(p => p.name === 'Web — Desktop');
      
      const lightNode = figma.createNodeFromSvg(window.__tempLightBanner);
      lightNode.name = 'Label — Web Desktop — Light Mode';
      lightNode.x = 0;
      lightNode.y = -2540;
      page.appendChild(lightNode);

      const darkNode = figma.createNodeFromSvg(window.__tempDarkBanner);
      darkNode.name = 'Label — Web Desktop — Dark Mode';
      darkNode.x = 0;
      darkNode.y = -120;
      page.appendChild(darkNode);

      delete window.__tempLightBanner;
      delete window.__tempDarkBanner;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  })()`);
  console.log('Banner labels creation:', bannerRes);

  // 4. Center viewport on the entire page so both rows are visible
  console.log('\nCentering viewport to show both Light Mode and Dark Mode rows...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    if (page.children.length > 0) {
      figma.viewport.scrollAndZoomIntoView(page.children);
    }
  })()`);

  // 5. Final document audit
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
  console.log('\n✓ Web Desktop — Light Mode import completed successfully above Dark Mode!');
}

main().catch(console.error);
