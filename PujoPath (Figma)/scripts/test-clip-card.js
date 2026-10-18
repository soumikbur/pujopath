const http = require('http');
const fs = require('fs');
const path = require('path');

async function testCard() {
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

  const bagbazarBase64 = fs.readFileSync(path.join(__dirname, '../assets/images/pandals/bagbazar-sarbojanin.webp')).toString('base64');

  // Test with clip-path
  const svgWithClip = `<svg width="406" height="190" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="c1"><rect width="406" height="190" rx="16"/></clipPath></defs>
    <image href="data:image/webp;base64,${bagbazarBase64}" width="406" height="190" clip-path="url(#c1)" preserveAspectRatio="xMidYMid slice"/>
  </svg>`;

  // Test without clip-path
  const svgNoClip = `<svg width="406" height="190" xmlns="http://www.w3.org/2000/svg">
    <image href="data:image/webp;base64,${bagbazarBase64}" width="406" height="190" rx="16" preserveAspectRatio="xMidYMid slice"/>
  </svg>`;

  const evalTest = (svg, name) =>
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
              const node = figma.createNodeFromSvg(${JSON.stringify(svg)});
              const fills = [];
              function f(n) {
                if (Array.isArray(n.fills) && n.fills.length > 0) fills.push({ type: n.type, fill: n.fills[0].type });
                if (n.children) n.children.forEach(f);
              }
              f(node);
              node.remove();
              return { name: '${name}', fills };
            })()`,
            returnByValue: true,
          },
        })
      );
    });

  console.log('Testing with clip-path:', await evalTest(svgWithClip, 'with-clip'));
  console.log('Testing without clip-path:', await evalTest(svgNoClip, 'no-clip'));

  ws.close();
}

testCard().catch(console.error);
