const http = require('http');
const fs = require('fs');
const path = require('path');

async function testMime() {
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

  const webpBuf = fs.readFileSync(path.join(__dirname, '../assets/images/pandals/bagbazar-sarbojanin.webp'));
  const webpBase64 = webpBuf.toString('base64');

  // Test 1: webp with image/webp
  const svg1 = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <image href="data:image/webp;base64,${webpBase64}" width="200" height="200"/>
  </svg>`;

  // Test 2: webp with image/jpeg mime header (some parsers check mime string)
  const svg2 = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <image href="data:image/jpeg;base64,${webpBase64}" width="200" height="200"/>
  </svg>`;

  const evalTest = (svg) =>
    new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(
        JSON.stringify({
          id,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              try {
                const node = figma.createNodeFromSvg(${JSON.stringify(svg)});
                let fill = null;
                function f(n) {
                  if (n.fills && Array.isArray(n.fills) && n.fills.length > 0) fill = n.fills[0].type;
                  if (n.children) n.children.forEach(f);
                }
                f(node);
                node.remove();
                return fill;
              } catch(e) {
                return 'ERROR: ' + e.message;
              }
            })()`,
            returnByValue: true,
          },
        })
      );
    });

  const res1 = await evalTest(svg1);
  const res2 = await evalTest(svg2);

  console.log('Result 1 (image/webp):', res1);
  console.log('Result 2 (image/jpeg header on webp):', res2);

  ws.close();
}

testMime().catch(console.error);
