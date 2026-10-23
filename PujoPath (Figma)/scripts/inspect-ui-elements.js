const http = require('http');

async function main() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));

  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise(resolve => {
      const id = 100;
      const h = e => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', h);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
    });
  }

  const res = await evalExpr(`(() => {
    // Left dock icons
    const leftElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.left >= 0 && r.right <= 60 && r.top > 40 && r.height >= 30 && r.height <= 60;
    }).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: el.className,
      text: el.innerText,
      aria: el.getAttribute('aria-label') || el.getAttribute('data-tooltip-text'),
      rect: el.getBoundingClientRect()
    }));

    // Survey close button
    const closeBtn = Array.from(document.querySelectorAll('button, svg, [role="button"]')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.right > 1850 && r.top > 660 && r.top < 710;
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect()
    }));

    return { leftElements, closeBtn };
  })()`);

  console.log(JSON.stringify(res, null, 2));
  ws.close();
}

main().catch(console.error);
