const http = require('http');
const fs = require('fs');
const path = require('path');

async function testWebp() {
  const imgPath = path.resolve(__dirname, '../assets/images/pandals/sovabazar-rajbari.webp');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');

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
    <image href="data:image/webp;base64,${imgBase64}" width="100" height="100"/>
  </svg>`;

  const result = await new Promise((resolve) => {
    const id = 123;
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
            try {
              const node = figma.createNodeFromSvg(${JSON.stringify(testSvg)});
              const fillType = node.children[0] ? node.children[0].fills[0].type : null;
              node.remove();
              return { success: true, fillType };
            } catch(e) {
              return { success: false, error: e.message };
            }
          })()`,
          returnByValue: true,
          awaitPromise: true,
        },
      })
    );
  });

  console.log('Result of WebP import:', result);
  ws.close();
}

testWebp().catch(console.error);
