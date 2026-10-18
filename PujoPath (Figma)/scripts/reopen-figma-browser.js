const http = require('http');

async function clickOpenHere() {
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
          expression: `(() => {
            const links = Array.from(document.querySelectorAll('a, button'));
            const target = links.find(el => el.innerText && el.innerText.includes('Open here instead'));
            if (target) {
              target.click();
              return 'Clicked "Open here instead"';
            }
            return 'Button "Open here instead" not found';
          })()`,
          returnByValue: true,
        },
      })
    );
  });

  console.log('Result:', result);
  ws.close();
}

clickOpenHere().catch(console.error);
