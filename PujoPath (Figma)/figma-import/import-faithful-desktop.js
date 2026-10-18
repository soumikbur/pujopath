const http = require('http');
const fs = require('fs');
const path = require('path');

const SVG_DIR = path.resolve(__dirname, '../exports/web-desktop-faithful');

async function getFigmaConnection() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
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

async function main() {
  console.log('Connecting to Figma tab...');
  const { ws, evaluate } = await getFigmaConnection();

  // 1. Inspect Figma pages
  console.log('\nInspecting Figma pages...');
  const pageCheck = await evaluate(`(() => {
    return figma.root.children.map(p => ({
      id: p.id,
      name: p.name,
      childCount: p.children.length,
      frames: p.children.map(c => c.name)
    }));
  })()`);
  console.log('Figma pages:', JSON.stringify(pageCheck, null, 2));

  const desktopPage = pageCheck.find(p => p.name === 'Web — Desktop');
  if (!desktopPage) {
    console.error('Target page "Web — Desktop" not found!');
    ws.close();
    process.exit(1);
  }

  // Confirm protection of other pages
  console.log('\nCONFIRMATION: Web — Mobile and Capacitor — Android Mobile will NOT be modified.');

  // 2. Clear ONLY children on "Web — Desktop"
  console.log('\nClearing existing children ONLY on "Web — Desktop"...');
  const clearRes = await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
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
  console.log('Cleared Web — Desktop:', clearRes);

  // 3. Define the 11 faithful desktop screens
  const svgFiles = [
    { file: '01_web_desktop_home.svg', name: '01_web_desktop_home' },
    { file: '02_web_desktop_explore.svg', name: '02_web_desktop_explore' },
    { file: '03_web_desktop_map.svg', name: '03_web_desktop_map' },
    { file: '04_web_desktop_planner.svg', name: '04_web_desktop_planner' },
    { file: '05_web_desktop_calendar.svg', name: '05_web_desktop_calendar' },
    { file: '06_web_desktop_metro.svg', name: '06_web_desktop_metro' },
    { file: '07_web_desktop_music.svg', name: '07_web_desktop_music' },
    { file: '08_web_desktop_mahalaya.svg', name: '08_web_desktop_mahalaya' },
    { file: '09_web_desktop_developer.svg', name: '09_web_desktop_developer' },
    { file: '10_web_desktop_about.svg', name: '10_web_desktop_about' },
    { file: '11_web_desktop_feedback.svg', name: '11_web_desktop_feedback' }
  ];

  let currentX = 0;
  const GAP = 120; // 120px gap between desktop screens (1440 + 120 = 1560)

  for (let i = 0; i < svgFiles.length; i++) {
    const item = svgFiles[i];
    const filePath = path.join(SVG_DIR, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn('SVG not found:', filePath);
      continue;
    }

    const svgContent = fs.readFileSync(filePath, 'utf8');
    const sizeKb = (svgContent.length / 1024).toFixed(1);
    console.log(`\n[${i + 1}/${svgFiles.length}] Importing ${item.name} (${sizeKb} KB)...`);

    // Assign temporary global SVG string to avoid parsing huge parameter in expression
    await evaluate(`window.__tempDesktopSvg = ${JSON.stringify(svgContent)}`);

    const posX = currentX;
    const importRes = await evaluate(`(() => {
      try {
        const page = figma.root.children.find(p => p.name === 'Web — Desktop');
        const node = figma.createNodeFromSvg(window.__tempDesktopSvg);
        node.name = '${item.name}';
        node.x = ${posX};
        node.y = 0;
        page.appendChild(node);
        delete window.__tempDesktopSvg;
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
        delete window.__tempDesktopSvg;
        return { success: false, error: err.message, stack: err.stack };
      }
    })()`);

    if (!importRes.success) {
      console.error(`Failed to import ${item.name}:`, importRes.error);
    } else {
      console.log(`✓ Imported ${item.name}: ${importRes.width}x${importRes.height} at x=${importRes.x}, y=${importRes.y} (${importRes.childrenCount} top-level nodes)`);
      currentX += importRes.width + GAP;
    }
  }

  // 4. Focus and zoom into view on "Web — Desktop"
  console.log('\nCentering viewport on Web — Desktop frames...');
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

  // 5. Final audit of document pages to confirm ONLY Web — Desktop was changed
  console.log('\n--- Final Verification of All Pages in Document ---');
  const finalSummary = await evaluate(`(() => {
    return figma.root.children.map(p => ({
      name: p.name,
      childCount: p.children.length,
      frames: p.children.map(c => ({
        name: c.name,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height,
        childrenCount: c.children ? c.children.length : 0
      }))
    }));
  })()`);

  console.log(JSON.stringify(finalSummary, null, 2));

  ws.close();
  console.log('\n✓ Web — Desktop import and verification completed successfully!');
}

main().catch(console.error);
