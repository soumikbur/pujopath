const http = require('http');

async function verifyFills() {
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

  const result = await new Promise((resolve) => {
    const id = 1;
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
          expression: `(async () => {
            const audit = {};
            for (const page of figma.root.children) {
              if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
              else figma.currentPage = page;

              audit[page.name] = page.children.map(frame => {
                let textNodes = [];
                let imageCount = 0;

                function scan(node) {
                  try {
                    if (node.type === 'TEXT') textNodes.push(node.characters);
                    if (Array.isArray(node.fills) && node.fills.some(f => f.type === 'IMAGE')) {
                      imageCount++;
                    }
                    if (node.children) {
                      for (const c of node.children) scan(c);
                    }
                  } catch (e) {}
                }
                scan(frame);

                return {
                  frameName: frame.name,
                  dimensions: frame.width + 'x' + frame.height,
                  textCount: textNodes.length,
                  imageCount: imageCount,
                  textSample: textNodes.slice(0, 5)
                };
              });
            }
            return audit;
          })()`,
          returnByValue: true,
          awaitPromise: true,
        },
      })
    );
  });

  console.log('AUDIT OF ALL FRAMES AND IMAGE FILLS:');
  console.log(JSON.stringify(result, null, 2));
  ws.close();
}

verifyFills().catch(console.error);
