const http = require('http');

async function toggleToLight() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const webTab = tabs.find(t => t.url && t.url.includes('pujopath-five.vercel.app'));
  if (!webTab) throw new Error('Live website tab not found');

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

  // Set viewport to 1440x900
  ws.send(JSON.stringify({
    id: 999,
    method: 'Emulation.setDeviceMetricsOverride',
    params: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    }
  }));

  const res = await evalExpr(`(() => {
    const btn = document.querySelector('button[aria-label*="mode"], button[aria-label*="theme"], button[aria-label*="Switch"]');
    let wasDark = document.documentElement.classList.contains('dark');
    if (wasDark && btn) {
      btn.click();
    } else if (wasDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    return {
      wasDark,
      isDarkNow: document.documentElement.classList.contains('dark'),
      htmlClass: document.documentElement.className,
      themeInStorage: localStorage.getItem('theme'),
      btnAria: btn ? btn.getAttribute('aria-label') : null
    };
  })()`);

  console.log('Theme toggle result:', JSON.stringify(res, null, 2));
  ws.close();
}

toggleToLight().catch(console.error);
