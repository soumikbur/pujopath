const { spawn } = require('child_process');
const http = require('http');

async function ensureChrome() {
  try {
    const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej));
    return { process: null, list };
  } catch (e) {
    const p = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${process.env.TEMP}\\chrome-dbg-${Date.now()}`,
      '--no-first-run',
      '--disable-gpu',
      '--hide-scrollbars'
    ]);
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 400));
      try {
        const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
          let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
        }).on('error', rej));
        return { process: p, list };
      } catch (err) {}
    }
    throw new Error('Chrome launch timeout');
  }
}

async function inspect(routes) {
  const { process: chromeProc, list: targets } = await ensureChrome();

  const page = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (m, p = {}) => new Promise((resolve) => {
    const i = id++;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === i) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });

  for (const route of routes) {
    await send('Page.navigate', { url: 'http://localhost:3000' + route });
    await new Promise(r => setTimeout(r, 1200));

    for (const width of [320, 360, 375, 390, 412]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 2, mobile: true });
      await new Promise(r => setTimeout(r, 300));

      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const w = window.innerWidth;
          const list = [];
          for (const el of document.querySelectorAll('*')) {
            const r = el.getBoundingClientRect();
            if (r.right > w + 2 && !['svg','circle','path','g','defs','clipPath'].includes(el.tagName.toLowerCase())) {
              list.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                cls: (el.className && typeof el.className === 'string' ? el.className.slice(0, 70) : ''),
                right: Math.round(r.right),
                width: Math.round(r.width),
                excess: Math.round(r.right - w)
              });
            }
          }
          return list;
        })()`,
        returnByValue: true
      });

      const overflowElements = res.result.value || [];
      if (overflowElements.length > 0) {
        console.log(`[${route} @ ${width}px] Overflowing elements (${overflowElements.length}):`);
        for (const el of overflowElements.slice(0, 5)) {
          console.log(`   <${el.tag} id="${el.id}" class="${el.cls}"> right=${el.right}px, w=${el.width}px, excess=+${el.excess}px`);
        }
      } else {
        console.log(`[${route} @ ${width}px] All clean!`);
      }
    }
  }

  ws.close();
  if (chromeProc) chromeProc.kill();
}

const routes = ['/', '/explore', '/kali-puja', '/map', '/planner', '/metro', '/music', '/calendar', '/helpline', '/about', '/feedback'];
inspect(routes).catch(console.error);
