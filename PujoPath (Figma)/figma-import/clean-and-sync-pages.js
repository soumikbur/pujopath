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

async function main() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result && msg.result.result) {
            resolve(msg.result.result.value);
          } else {
            resolve(msg);
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  console.log('1. Cleaning up and repopulating Page 1: Web — Desktop...');
  const res1 = await evalExpr(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }

    // Remove all existing children
    while (page.children.length > 0) {
      page.children[0].remove();
    }

    const svgs = ${JSON.stringify(desktopSvgs)};
    let currentX = 0;
    for (const s of svgs) {
      const node = figma.createNodeFromSvg(s.svg);
      node.name = s.name;
      node.x = currentX;
      node.y = 0;
      page.appendChild(node);
      currentX += node.width + 140;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
    return { page: page.name, count: page.children.length, frames: page.children.map(c => c.name) };
  })()`);
  console.log('Page 1 result:', res1);

  await new Promise(r => setTimeout(r, 2000));

  console.log('2. Cleaning up and repopulating Page 2: Web — Mobile...');
  const res2 = await evalExpr(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }

    while (page.children.length > 0) {
      page.children[0].remove();
    }

    const svgs = ${JSON.stringify(webMobileSvgs)};
    let currentX = 0;
    for (const s of svgs) {
      const node = figma.createNodeFromSvg(s.svg);
      node.name = s.name;
      node.x = currentX;
      node.y = 0;
      page.appendChild(node);
      currentX += node.width + 80;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
    return { page: page.name, count: page.children.length, frames: page.children.map(c => c.name) };
  })()`);
  console.log('Page 2 result:', res2);

  await new Promise(r => setTimeout(r, 2000));

  console.log('3. Cleaning up and repopulating Page 3: Capacitor — Android Mobile...');
  const res3 = await evalExpr(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }

    while (page.children.length > 0) {
      page.children[0].remove();
    }

    const svgs = ${JSON.stringify(capMobileSvgs)};
    let currentX = 0;
    for (const s of svgs) {
      const node = figma.createNodeFromSvg(s.svg);
      node.name = s.name;
      node.x = currentX;
      node.y = 0;
      page.appendChild(node);
      currentX += node.width + 80;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
    return { page: page.name, count: page.children.length, frames: page.children.map(c => c.name) };
  })()`);
  console.log('Page 3 result:', res3);

  await new Promise(r => setTimeout(r, 2000));

  console.log('4. Returning to Page 1: Web — Desktop...');
  await evalExpr(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);

  console.log('5. Summary of document structure:');
  const summary = await evalExpr(`(() => {
    return {
      docTitle: document.title,
      rootName: figma.root.name,
      pageCount: figma.root.children.length,
      pages: figma.root.children.map(p => ({
        name: p.name,
        frameCount: p.children.length,
        frames: p.children.map(c => c.name)
      })),
      stylesCount: figma.getLocalPaintStyles().length
    };
  })()`);
  console.log('FINAL SUMMARY:');
  console.log(JSON.stringify(summary, null, 2));

  ws.close();
}

main().catch(console.error);
