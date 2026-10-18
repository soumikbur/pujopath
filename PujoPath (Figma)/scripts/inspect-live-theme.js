const http = require('http');

async function inspectThemeToggle() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const webTab = tabs.find(t => t.url && t.url.includes('pujopath-five.vercel.app'));
  if (!webTab) throw new Error('Web tab not found');

  const ws = new WebSocket(webTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 100000);
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
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  const themeInfo = await evalExpr(`(() => {
    const html = document.documentElement;
    const body = document.body;
    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.textContent.trim(),
      ariaLabel: b.getAttribute('aria-label'),
      className: b.className
    }));
    return {
      htmlTheme: html.getAttribute('data-theme'),
      htmlClass: html.className,
      bodyClass: body.className,
      localStorageTheme: localStorage.getItem('theme'),
      buttons: buttons.filter(b => b.ariaLabel || b.text.includes('☼') || b.text.includes('☀️') || b.text.includes('🌙'))
    };
  })()`);

  console.log('Theme info:', JSON.stringify(themeInfo, null, 2));
  ws.close();
}

inspectThemeToggle().catch(console.error);
