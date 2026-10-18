const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url && t.url.includes('figma.com/design/'));
        resolve(figmaTab.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function evalInPage(wsUrl, expr) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        ws.close();
        if (msg.error) reject(new Error(msg.error.message));
        else if (msg.result && msg.result.result) resolve(msg.result.result.value);
        else resolve(msg.result);
      }
    };
    ws.onerror = reject;
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  console.log('Connected to WS:', wsUrl);

  const script = `(() => {
    const p1 = figma.root.children.find(p => p.name === 'Web — Desktop');
    const p2 = figma.root.children.find(p => p.name === 'Web — Mobile');
    const p3 = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');

    if (!p1 || !p2 || !p3) {
      return { error: 'Missing pages', pages: figma.root.children.map(p => p.name) };
    }

    const allNodes = [...p1.children, ...p2.children, ...p3.children];
    console.log('Total nodes found:', allNodes.length);

    // Group nodes by destination
    const desktopNodes = allNodes.filter(n => n.name.startsWith('01_web_desktop') || n.name.startsWith('02_web_desktop') || n.name.startsWith('03_web_desktop') || n.name.startsWith('04_web_desktop') || n.name.startsWith('05_web_desktop') || n.name.startsWith('06_web_desktop'));
    const mobileNodes = allNodes.filter(n => n.name.startsWith('01_web_mobile') || n.name.startsWith('02_web_mobile') || n.name.startsWith('03_web_mobile') || n.name.startsWith('04_web_mobile') || n.name.startsWith('05_web_mobile') || n.name.startsWith('06_web_mobile') || n.name.startsWith('07_web_mobile'));
    const capNodes = allNodes.filter(n => n.name.startsWith('01_capacitor') || n.name.startsWith('02_capacitor') || n.name.startsWith('03_capacitor') || n.name.startsWith('04_capacitor') || n.name.startsWith('05_capacitor') || n.name.startsWith('06_capacitor') || n.name.startsWith('07_capacitor') || n.name.startsWith('08_capacitor') || n.name.startsWith('09_capacitor'));

    // Move & arrange Page 1 (Desktop)
    let dX = 0;
    desktopNodes.sort((a, b) => a.name.localeCompare(b.name)).forEach(n => {
      p1.appendChild(n);
      n.x = dX;
      n.y = 0;
      dX += n.width + 160;
    });

    // Move & arrange Page 2 (Mobile)
    let mX = 0;
    mobileNodes.sort((a, b) => a.name.localeCompare(b.name)).forEach(n => {
      p2.appendChild(n);
      n.x = mX;
      n.y = 0;
      mX += n.width + 100;
    });

    // Move & arrange Page 3 (Capacitor)
    let cX = 0;
    capNodes.sort((a, b) => a.name.localeCompare(b.name)).forEach(n => {
      p3.appendChild(n);
      n.x = cX;
      n.y = 0;
      cX += n.width + 100;
    });

    // Focus Page 1
    figma.currentPage = p1;
    figma.viewport.scrollAndZoomIntoView(p1.children);

    return {
      p1: { name: p1.name, count: p1.children.length, frames: p1.children.map(c => c.name) },
      p2: { name: p2.name, count: p2.children.length, frames: p2.children.map(c => c.name) },
      p3: { name: p3.name, count: p3.children.length, frames: p3.children.map(c => c.name) }
    };
  })()`;

  const res = await evalInPage(wsUrl, script);
  console.log('Organization Result:', JSON.stringify(res, null, 2));
}

main().catch(console.error);
