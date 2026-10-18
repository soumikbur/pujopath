const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url.includes('figma.com'));
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
        resolve(msg.result.result.value);
      }
    };
    ws.onerror = reject;
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  const script = `(() => {
    return figma.root.children.map(p => ({
      name: p.name,
      id: p.id,
      childCount: p.children.length,
      children: p.children.map(c => ({ name: c.name, type: c.type, w: c.width, h: c.height, x: c.x, y: c.y }))
    }));
  })()`;
  const res = await evalInPage(wsUrl, script);
  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);
