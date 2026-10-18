const fs = require('fs');
const path = require('path');
const http = require('http');

const FIGMA_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(FIGMA_DIR, 'exports', 'capacitor-mobile');

const capFiles = [
  '01_capacitor_launch_splash.svg',
  '02_capacitor_android_home.svg',
  '03_capacitor_android_explore.svg',
  '04_capacitor_android_map.svg',
  '05_capacitor_android_planner.svg',
  '06_capacitor_android_calendar.svg',
  '07_capacitor_android_drawer.svg',
  '08_capacitor_android_developer.svg',
  '09_capacitor_android_music_player.svg',
];

async function syncCapacitorPage() {
  console.log('Connecting to Chrome debugging on port 9222...');
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const figmaTab = tabs.find((t) => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) {
    throw new Error('Figma design tab not found on port 9222');
  }

  console.log('Found Figma Tab:', figmaTab.title);
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  function evaluate(expr) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result && msg.result.result) {
            resolve(msg.result.result.value);
          } else if (msg.error) {
            reject(new Error(msg.error.message));
          } else {
            resolve(msg);
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(
        JSON.stringify({
          id,
          method: 'Runtime.evaluate',
          params: { expression: expr, returnByValue: true, awaitPromise: true },
        })
      );
    });
  }

  // 1. Verify and PRESERVE Web Pages
  console.log('\n--- Verifying that "Web — Desktop" and "Web — Mobile" exist and are PRESERVED ---');
  const webCheck = await evaluate(`(() => {
    const desktop = figma.root.children.find(p => p.name === 'Web — Desktop');
    const mobile = figma.root.children.find(p => p.name === 'Web — Mobile');
    return {
      desktop: desktop ? { name: desktop.name, frameCount: desktop.children.length, frames: desktop.children.map(c => c.name) } : null,
      mobile: mobile ? { name: mobile.name, frameCount: mobile.children.length, frames: mobile.children.map(c => c.name) } : null,
    };
  })()`);

  console.log('Preserved Desktop:', webCheck.desktop);
  console.log('Preserved Mobile:', webCheck.mobile);

  if (!webCheck.desktop || !webCheck.mobile) {
    throw new Error('Preserved web pages not found! Aborting to protect designs.');
  }

  // 2. Select page "Capacitor — Android Mobile" and clear existing frames
  console.log('\n--- Preparing Page "Capacitor — Android Mobile" ---');
  const prepRes = await evaluate(`(async () => {
    let page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    if (!page) {
      page = figma.createPage();
      page.name = 'Capacitor — Android Mobile';
    }
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    const initialCount = page.children.length;
    while (page.children.length > 0) {
      page.children[0].remove();
    }
    return { page: page.name, clearedCount: initialCount };
  })()`);
  console.log(`Page "Capacitor — Android Mobile" selected. Cleared ${prepRes.clearedCount} old frames.`);

  // 3. Import each authentic screen SVG
  const gap = 120;
  let currentX = 0;
  const importedResults = [];

  for (let i = 0; i < capFiles.length; i++) {
    const filename = capFiles[i];
    const frameName = filename.replace('.svg', '');
    const filePath = path.join(EXPORTS_DIR, filename);
    const sizeKb = (fs.statSync(filePath).size / 1024).toFixed(1);
    console.log(`\n[${i + 1}/${capFiles.length}] Importing "${frameName}" (${sizeKb} KB)...`);

    const svgContent = fs.readFileSync(filePath, 'utf8');

    const importRes = await evaluate(`(async () => {
      const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
      const node = figma.createNodeFromSvg(${JSON.stringify(svgContent)});
      node.name = '${frameName}';
      node.x = ${currentX};
      node.y = 0;
      page.appendChild(node);

      // Verify layer editability
      let textCount = 0;
      let imageCount = 0;
      let vectorCount = 0;
      let rectCount = 0;
      let groupCount = 0;

      function traverse(n) {
        if (n.type === 'TEXT') textCount++;
        if (n.type === 'VECTOR') vectorCount++;
        if (n.type === 'GROUP' || n.type === 'FRAME') groupCount++;
        if (n.type === 'RECTANGLE') {
          rectCount++;
          if (n.fills && Array.isArray(n.fills) && n.fills.some(f => f.type === 'IMAGE')) {
            imageCount++;
          }
        }
        if (n.children) {
          for (const c of n.children) traverse(c);
        }
      }
      traverse(node);

      return {
        name: node.name,
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
        layers: { textCount, imageCount, vectorCount, rectCount, groupCount }
      };
    })()`);

    console.log(`  -> Imported "${importRes.name}": ${importRes.width}x${importRes.height} at x=${importRes.x}`);
    console.log(`     Editable Elements: ${importRes.layers.textCount} Text nodes, ${importRes.layers.imageCount} Image fills, ${importRes.layers.vectorCount} Vectors, ${importRes.layers.rectCount} Rectangles.`);
    importedResults.push(importRes);

    currentX += importRes.width + gap;
    await new Promise((r) => setTimeout(r, 600));
  }

  // 4. Zoom all frames into view on the Capacitor page
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);

  // 5. Final Full Cloud Document Verification
  console.log('\n--- Final Cloud Verification Across All 3 Pages ---');
  const finalSummary = await evaluate(`(() => {
    return {
      title: document.title,
      pageCount: figma.root.children.length,
      pages: figma.root.children.map(p => ({
        name: p.name,
        frameCount: p.children.length,
        frames: p.children.map(c => ({
          name: c.name,
          width: c.width,
          height: c.height,
          x: c.x,
          y: c.y,
        }))
      }))
    };
  })()`);

  console.log(JSON.stringify(finalSummary, null, 2));
  ws.close();

  // Save summary to disk
  fs.writeFileSync(
    path.join(FIGMA_DIR, 'validation', 'capacitor_sync_summary.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), importedResults, finalSummary }, null, 2)
  );
  console.log('\nSync completed and summary saved.');
}

syncCapacitorPage().catch(console.error);
