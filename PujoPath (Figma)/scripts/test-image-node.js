const http = require('http');

async function testImageNode() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const figmaTab = tabs.find((t) => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  const testSvg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" width="100" height="100" rx="20"/>
  </svg>`;

  const result = await new Promise((resolve) => {
    const id = 124;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result?.result?.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(
      JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: `(async () => {
            const node = figma.createNodeFromSvg(${JSON.stringify(testSvg)});
            const child = node.children[0];
            const res = { type: child.type, cornerRadius: child.cornerRadius, fills: child.fills.map(f=>f.type) };
            node.remove();
            return res;
          })()`,
          returnByValue: true,
          awaitPromise: true,
        },
      })
    );
  });

  console.log('Figma image node details:', result);
  ws.close();
}

testImageNode().catch(console.error);
