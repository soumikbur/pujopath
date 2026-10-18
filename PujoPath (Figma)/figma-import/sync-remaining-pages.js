const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'exports');

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

const webMobileSvgs = loadSvgs('web-mobile', webMobileFiles);
const capMobileSvgs = loadSvgs('capacitor-mobile', capMobileFiles);

async function main() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result.result.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    });
  }

  console.log('1. Switching to Web — Mobile...');
  const res1 = await evalExpr(`(() => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    figma.currentPage = page;
    return { pageName: figma.currentPage.name, children: page.children.length };
  })()`);
  console.log('Switched to:', res1);

  console.log('2. Importing Web Mobile SVGs onto current page...');
  const res2 = await evalExpr(`(() => {
    const svgs = ${JSON.stringify(webMobileSvgs)};
    const page = figma.currentPage;
    let currentX = 0;
    const imported = [];
    for (const s of svgs) {
      const node = figma.createNodeFromSvg(s.svg);
      node.name = s.name;
      node.x = currentX;
      node.y = 0;
      page.appendChild(node);
      imported.push(node.name);
      currentX += node.width + 80;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
    return { importedCount: imported.length, frames: imported };
  })()`);
  console.log('Imported Web Mobile:', res2);

  // Wait 3 seconds for Figma to sync Page 2 to cloud
  await new Promise(r => setTimeout(r, 3000));

  console.log('3. Switching to Capacitor — Android Mobile...');
  const res3 = await evalExpr(`(() => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    figma.currentPage = page;
    return { pageName: figma.currentPage.name, children: page.children.length };
  })()`);
  console.log('Switched to:', res3);

  console.log('4. Importing Capacitor Mobile SVGs onto current page...');
  const res4 = await evalExpr(`(() => {
    const svgs = ${JSON.stringify(capMobileSvgs)};
    const page = figma.currentPage;
    let currentX = 0;
    const imported = [];
    for (const s of svgs) {
      const node = figma.createNodeFromSvg(s.svg);
      node.name = s.name;
      node.x = currentX;
      node.y = 0;
      page.appendChild(node);
      imported.push(node.name);
      currentX += node.width + 80;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
    return { importedCount: imported.length, frames: imported };
  })()`);
  console.log('Imported Capacitor Mobile:', res4);

  // Wait 3 seconds for Figma to sync Page 3 to cloud
  await new Promise(r => setTimeout(r, 3000));

  console.log('5. Switching back to Web — Desktop...');
  await evalExpr(`(() => {
    figma.currentPage = figma.root.children.find(p => p.name === 'Web — Desktop');
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  })()`);

  // Final check
  const finalCheck = await evalExpr(`(() => {
    return {
      pages: figma.root.children.map(p => ({
        name: p.name,
        frameCount: p.children.length,
        frames: p.children.map(c => c.name)
      }))
    };
  })()`);
  console.log('Final page state before reload:', JSON.stringify(finalCheck, null, 2));

  ws.close();
}

main().catch(console.error);
