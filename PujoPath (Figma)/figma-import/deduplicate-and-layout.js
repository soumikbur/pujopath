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
    const pages = figma.root.children;
    const report = [];

    for (const page of pages) {
      const seen = new Set();
      const toRemove = [];
      const toKeep = [];

      for (const child of page.children) {
        if (seen.has(child.name)) {
          toRemove.push(child);
        } else {
          seen.add(child.name);
          toKeep.push(child);
        }
      }

      toRemove.forEach(n => n.remove());

      // Sort and lay out horizontally
      toKeep.sort((a, b) => a.name.localeCompare(b.name));
      let curX = 0;
      const spacing = page.name === 'Web — Desktop' ? 160 : 100;
      toKeep.forEach(n => {
        n.x = curX;
        n.y = 0;
        curX += n.width + spacing;
      });

      figma.currentPage = page;
      figma.viewport.scrollAndZoomIntoView(page.children);

      report.push({
        page: page.name,
        keptCount: toKeep.length,
        removedDuplicates: toRemove.length,
        frames: toKeep.map(n => ({ name: n.name, w: n.width, h: n.height, x: n.x, y: n.y }))
      });
    }

    // Return to Page 1
    const p1 = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (p1) {
      figma.currentPage = p1;
      figma.viewport.scrollAndZoomIntoView(p1.children);
    }

    return report;
  })()`;

  const res = await evalInPage(wsUrl, script);
  console.log('Deduplication & Layout Report:', JSON.stringify(res, null, 2));
}

main().catch(console.error);
