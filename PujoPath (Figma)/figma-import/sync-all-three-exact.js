const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'exports');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url && t.url.includes('figma.com/design/'));
        if (figmaTab && figmaTab.webSocketDebuggerUrl) {
          resolve(figmaTab.webSocketDebuggerUrl);
        } else {
          reject(new Error('Figma design tab not found! Available: ' + JSON.stringify(list)));
        }
      });
    }).on('error', reject);
  });
}

function createEvalFn(ws) {
  return function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const timeout = setTimeout(() => {
        ws.removeEventListener('message', handler);
        reject(new Error('CDP evaluation timed out after 30s'));
      }, 30000);

      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          clearTimeout(timeout);
          ws.removeEventListener('message', handler);
          if (msg.error) reject(new Error(msg.error.message));
          else if (msg.result && msg.result.result) resolve(msg.result.result.value);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    });
  };
}

async function syncPage(evalExpr, pageName, folderName, fileNames, spacing = 120) {
  console.log(`\n==================================================`);
  console.log(`SYNCING PAGE: ${pageName} (${fileNames.length} screens)`);
  console.log(`==================================================`);

  // 1. Switch to page and clear old approximate frames
  const switchRes = await evalExpr(`(() => {
    let page = figma.root.children.find(p => p.name === '${pageName}');
    if (!page) {
      page = figma.createPage();
      page.name = '${pageName}';
    }
    figma.currentPage = page;
    const removed = page.children.length;
    // Remove all old frames to rebuild clean from scratch
    while (page.children.length > 0) {
      page.children[0].remove();
    }
    return { pageName: page.name, removedCount: removed };
  })()`);
  console.log(`Switched to page "${switchRes.pageName}", cleared ${switchRes.removedCount} old frames.`);

  // 2. Import each SVG screen individually
  let currentX = 0;
  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const filePath = path.join(exportsDir, folderName, fileName);
    const svgContent = fs.readFileSync(filePath, 'utf8');
    const frameName = fileName.replace('.svg', '');
    
    console.log(`[${i + 1}/${fileNames.length}] Importing "${frameName}" (${(svgContent.length / 1024).toFixed(1)} KB)...`);
    
    // Pass SVG string to Figma
    const importRes = await evalExpr(`(() => {
      const svg = ${JSON.stringify(svgContent)};
      const node = figma.createNodeFromSvg(svg);
      node.name = '${frameName}';
      node.x = ${currentX};
      node.y = 0;
      figma.currentPage.appendChild(node);
      return {
        name: node.name,
        type: node.type,
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
        childCount: node.children ? node.children.length : 0
      };
    })()`);

    console.log(`  ✓ Imported ${importRes.name} (${importRes.width}x${importRes.height}) with ${importRes.childCount} child nodes at x=${importRes.x}`);
    currentX += importRes.width + spacing;
  }

  // 3. Zoom and center viewport
  await evalExpr(`(() => {
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  })()`);
  console.log(`✓ Zoomed and centered all frames on "${pageName}".`);

  // Wait 2.5 seconds to let Figma sync state to cloud
  await new Promise(r => setTimeout(r, 2500));
}

async function main() {
  const wsUrl = await getWsUrl();
  console.log('Connected to Figma DevTools WebSocket:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);
  const evalExpr = createEvalFn(ws);

  // Verify Figma environment
  const envInfo = await evalExpr(`(() => {
    return {
      title: document.title,
      hasFigma: typeof figma !== 'undefined',
      pageCount: figma.root.children.length,
      pageNames: figma.root.children.map(p => p.name)
    };
  })()`);
  console.log('Figma Environment:', envInfo);

  // 1. PAGE 1: Web — Desktop
  const desktopFiles = [
    '01_web_desktop_home.svg',
    '02_web_desktop_developer.svg',
    '03_web_desktop_explore.svg',
    '04_web_desktop_calendar.svg',
    '05_web_desktop_planner.svg',
    '06_web_desktop_metro.svg'
  ];
  await syncPage(evalExpr, 'Web — Desktop', 'web-desktop', desktopFiles, 160);

  // 2. PAGE 2: Web — Mobile
  const mobileFiles = [
    '01_web_mobile_home.svg',
    '02_web_mobile_developer.svg',
    '03_web_mobile_explore.svg',
    '04_web_mobile_calendar.svg',
    '05_web_mobile_planner.svg',
    '06_web_mobile_metro.svg',
    '07_web_mobile_music.svg'
  ];
  await syncPage(evalExpr, 'Web — Mobile', 'web-mobile', mobileFiles, 100);

  // 3. PAGE 3: Capacitor — Android Mobile
  const capacitorFiles = [
    '01_capacitor_launch_splash.svg',
    '02_capacitor_android_home.svg',
    '03_capacitor_android_explore.svg',
    '04_capacitor_android_map.svg',
    '05_capacitor_android_planner.svg',
    '06_capacitor_android_calendar.svg',
    '07_capacitor_android_drawer.svg',
    '08_capacitor_android_developer.svg',
    '09_capacitor_android_music_player.svg'
  ];
  await syncPage(evalExpr, 'Capacitor — Android Mobile', 'capacitor-mobile', capacitorFiles, 100);

  // 4. Final Document Verification
  console.log(`\n==================================================`);
  console.log(`VERIFYING FINAL STATE ACROSS ALL 3 PAGES`);
  console.log(`==================================================`);
  const finalState = await evalExpr(`(() => {
    return figma.root.children.map(p => ({
      name: p.name,
      id: p.id,
      frameCount: p.children.length,
      frames: p.children.map(c => ({
        name: c.name,
        type: c.type,
        w: c.width,
        h: c.height,
        x: c.x,
        y: c.y,
        childCount: c.children ? c.children.length : 0
      }))
    }));
  })()`);

  console.log('Final Document Summary:', JSON.stringify(finalState, null, 2));

  // Switch back to Page 1 for presentation
  await evalExpr(`(() => {
    const p1 = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (p1) figma.currentPage = p1;
  })()`);

  ws.close();
  console.log('\n✓ Sync completed successfully! All 3 pages rebuilt and populated with exact designs.');
}

main().catch(err => {
  console.error('Sync Error:', err);
  process.exit(1);
});
