const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url && t.url.includes('figma.com/design/'));
        resolve(figmaTab.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    });
  }

  const info = await evalExpr(`(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const pageEls = all.filter(el => el.children.length === 0 && (el.textContent === 'Web — Desktop' || el.textContent === 'Web — Mobile' || el.textContent === 'Capacitor — Android Mobile'));
    return pageEls.map(el => {
      const chain = [];
      let curr = el;
      for (let i = 0; i < 6 && curr; i++) {
        const rect = curr.getBoundingClientRect();
        chain.push({
          tag: curr.tagName,
          className: curr.className,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
        });
        curr = curr.parentElement;
      }
      return { text: el.textContent, chain };
    });
  })()`);

  console.log('Page elements found:', JSON.stringify(info, null, 2));
  ws.close();
}

main().catch(console.error);
