const http = require('http');
const fs = require('fs');

async function inspectFigmaDOM() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const figmaTab = tabs.find((t) => t.url && t.url.includes('figma.com'));
  if (!figmaTab) {
    console.error('No figma tab found');
    return;
  }

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  const evalResult = await new Promise((resolve) => {
    const id = 11;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === id) {
        ws.removeEventListener('message', h);
        resolve(m.result ? m.result.result.value : null);
      }
    };
    ws.addEventListener('message', h);
    ws.send(
      JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const pageItems = Array.from(document.querySelectorAll('[data-testid="page-row"], [class*="pages_panel--pageRow"], [class*="page_row"]')).map(el => el.innerText.trim());
            const layerItems = Array.from(document.querySelectorAll('[data-testid="layer-row"], [class*="layer_row"]')).map(el => el.innerText.trim());
            const selectedTab = document.querySelector('[class*="pages_panel--selected"]')?.innerText || '';
            return {
              url: window.location.href,
              title: document.title,
              pageItems,
              layerItems: layerItems.slice(0, 50),
              totalLayers: layerItems.length
            };
          })()`,
          returnByValue: true,
        },
      })
    );
  });

  console.log('Figma State:', JSON.stringify(evalResult, null, 2));

  // Screenshot
  const shotId = 12;
  ws.send(JSON.stringify({ id: shotId, method: 'Page.captureScreenshot' }));
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id === shotId) {
      const buf = Buffer.from(msg.result.data, 'base64');
      fs.writeFileSync(
        'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/figma_canvas_inspect.png',
        buf
      );
      console.log('Saved figma_canvas_inspect.png');
      ws.close();
    }
  };
}

inspectFigmaDOM().catch(console.error);
