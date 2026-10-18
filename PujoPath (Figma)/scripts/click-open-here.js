const http = require('http');

async function main() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) {
    console.error('Figma tab not found');
    return;
  }
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(new Error(JSON.stringify(msg.error)));
          else resolve(msg.result?.result?.value);
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

  console.log('Evaluating click on "Open here instead"...');
  const res = await evalExpr(`(() => {
    const links = Array.from(document.querySelectorAll('a, button, [role="button"]'));
    const openHere = links.find(el => el.textContent && el.textContent.toLowerCase().includes('open here'));
    if (openHere) {
      openHere.click();
      return { clicked: true, text: openHere.textContent, href: openHere.href };
    }
    return { clicked: false, links: links.map(l => l.textContent) };
  })()`);

  console.log('Click result:', res);
  ws.close();
}

main().catch(console.error);
