const http = require('http');

async function getTab() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  return tabs.find((t) => t.url && t.url.includes('pujopath-five.vercel.app'));
}

async function main() {
  const tab = await getTab();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  function evaluate(expr) {
    return new Promise((resolve) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  const res = await evaluate(`(() => {
    const menu = document.querySelector('[class*="w-52"], [class*="w-56"]');
    if (!menu) return { found: false };
    return {
      found: true,
      className: menu.className,
      rect: menu.getBoundingClientRect(),
      links: Array.from(menu.querySelectorAll('a')).map(a => ({
        text: a.innerText.replace(/\\n/g, ' '),
        href: a.getAttribute('href'),
        className: a.className,
        html: a.outerHTML
      }))
    };
  })()`);

  console.log(JSON.stringify(res, null, 2));
  ws.close();
}

main().catch(console.error);
