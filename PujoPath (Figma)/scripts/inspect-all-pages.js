const http = require('http');
const fs = require('fs');

async function inspectAllPages() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const figmaTab = tabs.find((t) => t.url && t.url.includes('figma.com'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  // Function to click a page in pages panel
  async function selectPage(pageName) {
    const res = await new Promise((resolve) => {
      const id = 100;
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
              const rows = Array.from(document.querySelectorAll('[data-testid="page-row"], [class*="pages_panel--pageRow"], [class*="page_row"]'));
              const target = rows.find(r => r.innerText.trim() === '${pageName}');
              if (target) {
                target.click();
                return true;
              }
              return false;
            })()`,
            returnByValue: true,
          },
        })
      );
    });
    console.log(`Selecting page "${pageName}":`, res);
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Inspect Web - Mobile
  await selectPage('Web — Mobile');
  await new Promise((resolve) => {
    const shotId = 201;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === shotId) {
        ws.removeEventListener('message', h);
        fs.writeFileSync(
          'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/figma_web_mobile_canvas.png',
          Buffer.from(m.result.data, 'base64')
        );
        console.log('Saved figma_web_mobile_canvas.png');
        resolve();
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: shotId, method: 'Page.captureScreenshot' }));
  });

  // Inspect Capacitor - Android Mobile
  await selectPage('Capacitor — Android Mobile');
  await new Promise((resolve) => {
    const shotId = 202;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === shotId) {
        ws.removeEventListener('message', h);
        fs.writeFileSync(
          'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/figma_capacitor_canvas.png',
          Buffer.from(m.result.data, 'base64')
        );
        console.log('Saved figma_capacitor_canvas.png');
        resolve();
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: shotId, method: 'Page.captureScreenshot' }));
  });

  ws.close();
}

inspectAllPages().catch(console.error);
