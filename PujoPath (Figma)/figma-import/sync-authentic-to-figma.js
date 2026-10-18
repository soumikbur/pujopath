const fs = require('fs');
const path = require('path');
const http = require('http');

const FIGMA_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(FIGMA_DIR, 'exports');

const desktopFiles = [
  '01_web_desktop_home.svg',
  '02_web_desktop_developer.svg',
  '03_web_desktop_explore.svg',
  '04_web_desktop_calendar.svg',
  '05_web_desktop_planner.svg',
  '06_web_desktop_metro.svg',
];

const webMobileFiles = [
  '01_web_mobile_home.svg',
  '02_web_mobile_developer.svg',
  '03_web_mobile_explore.svg',
  '04_web_mobile_calendar.svg',
  '05_web_mobile_planner.svg',
];

const capMobileFiles = [
  '01_capacitor_launch_splash.svg',
  '02_capacitor_android_developer.svg',
  '03_capacitor_android_drawer.svg',
  '04_capacitor_android_home.svg',
  '05_capacitor_android_calendar.svg',
  '06_capacitor_android_explore.svg',
];

async function syncAll() {
  console.log('Connecting to Figma Chrome browser session on port 9222...');
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

  console.log('Found Figma Tab:', figmaTab.title, figmaTab.url);
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

  // Helper to sync a page frame by frame
  async function syncPage(pageName, folderName, files, gap = 140) {
    console.log(`\n=======================================================`);
    console.log(`Starting sync for page: "${pageName}"...`);
    console.log(`=======================================================`);

    // 1. Select page and clear existing children
    const clearRes = await evaluate(`(async () => {
      let page = figma.root.children.find(p => p.name === '${pageName}');
      if (!page) {
        page = figma.createPage();
        page.name = '${pageName}';
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
      return { page: page.name, cleared: initialCount };
    })()`);
    console.log('Page cleared:', clearRes);

    // 2. Import each frame individually
    let currentX = 0;
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const frameName = filename.replace('.svg', '');
      const filePath = path.join(EXPORTS_DIR, folderName, filename);
      console.log(`  [${i + 1}/${files.length}] Importing "${frameName}" (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)...`);

      const svgContent = fs.readFileSync(filePath, 'utf8');

      const importRes = await evaluate(`(async () => {
        const page = figma.root.children.find(p => p.name === '${pageName}');
        const node = figma.createNodeFromSvg(${JSON.stringify(svgContent)});
        node.name = '${frameName}';
        node.x = ${currentX};
        node.y = 0;
        page.appendChild(node);

        // Analyze node layers to confirm editability
        let textCount = 0;
        let imageCount = 0;
        let vectorCount = 0;
        let rectCount = 0;

        function traverse(n) {
          if (n.type === 'TEXT') textCount++;
          if (n.type === 'VECTOR') vectorCount++;
          if (n.type === 'RECTANGLE') {
            rectCount++;
            if (n.fills && n.fills.some(f => f.type === 'IMAGE')) imageCount++;
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
          layers: { textCount, imageCount, vectorCount, rectCount }
        };
      })()`);

      console.log(`    -> Imported "${importRes.name}": ${importRes.width}x${importRes.height} at x=${importRes.x}`);
      console.log(`       Layers: ${importRes.layers.textCount} editable text nodes, ${importRes.layers.imageCount} native image fills, ${importRes.layers.vectorCount} vectors, ${importRes.layers.rectCount} rects.`);

      currentX += importRes.width + gap;
      await new Promise((r) => setTimeout(r, 600));
    }

    // 3. Zoom into view
    await evaluate(`(async () => {
      const page = figma.root.children.find(p => p.name === '${pageName}');
      figma.viewport.scrollAndZoomIntoView(page.children);
    })()`);
    console.log(`Page "${pageName}" complete and zoomed into view.`);
  }

  // Sync Page 1: Web — Desktop
  await syncPage('Web — Desktop', 'web-desktop', desktopFiles, 160);

  // Sync Page 2: Web — Mobile
  await syncPage('Web — Mobile', 'web-mobile', webMobileFiles, 100);

  // Sync Page 3: Capacitor — Android Mobile
  await syncPage('Capacitor — Android Mobile', 'capacitor-mobile', capMobileFiles, 100);

  // Return to Page 1: Web — Desktop as default active view
  console.log('\nSetting active page back to "Web — Desktop"...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);

  // Final Cloud Verification Summary
  const finalSummary = await evaluate(`(() => {
    return {
      docTitle: document.title,
      fileUrl: window.location.href,
      pageCount: figma.root.children.length,
      pages: figma.root.children.map(p => ({
        name: p.name,
        childCount: p.children.length,
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

  console.log('\n=======================================================');
  console.log('FINAL FIGMA CLOUD VERIFICATION:');
  console.log(JSON.stringify(finalSummary, null, 2));
  console.log('=======================================================');

  ws.close();
}

syncAll().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
