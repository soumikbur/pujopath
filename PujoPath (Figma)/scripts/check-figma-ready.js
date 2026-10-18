const http = require('http');

async function check() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const figmaTab = tabs.find((t) => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) {
    console.error('Figma tab not found');
    return;
  }

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  for (let i = 0; i < 20; i++) {
    const res = await new Promise((resolve) => {
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === 10 + i) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(
        JSON.stringify({
          id: 10 + i,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              if (typeof figma !== 'undefined' && figma.root && figma.root.children.length > 0) {
                return {
                  title: document.title,
                  pageCount: figma.root.children.length,
                  pages: figma.root.children.map(p => ({
                    name: p.name,
                    frameCount: p.children.length,
                    frames: p.children.map(c => c.name)
                  }))
                };
              }
              return null;
            })()`,
            returnByValue: true,
          },
        })
      );
    });

    if (res) {
      console.log('FIGMA READY & VERIFIED:');
      console.log(JSON.stringify(res, null, 2));
      ws.close();
      return;
    }
    console.log(`Waiting for Figma WASM engine... attempt ${i + 1}`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  ws.close();
}

check().catch(console.error);
