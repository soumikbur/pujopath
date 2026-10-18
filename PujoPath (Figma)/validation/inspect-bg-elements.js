const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const tab = list.find(t => t.url && t.url.includes('pujopath-five.vercel.app'));
        resolve(tab.webSocketDebuggerUrl);
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

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCmd('Page.navigate', { url: 'https://pujopath-five.vercel.app/' });
  await new Promise(r => setTimeout(r, 2500));

  const bgInfo = await evalExpr(`(() => {
    const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.offsetWidth,
      height: img.offsetHeight,
      classes: img.className
    }));

    const svgs = Array.from(document.querySelectorAll('svg')).map(s => ({
      width: s.getAttribute('width') || s.clientWidth,
      height: s.getAttribute('height') || s.clientHeight,
      classes: s.getAttribute('class')
    })).slice(0, 10);

    // Look for any element with background-image or absolute background
    const allEls = Array.from(document.querySelectorAll('div, section, main, header'));
    const bgEls = allEls.filter(el => {
      const s = window.getComputedStyle(el);
      return s.backgroundImage !== 'none' || el.className.includes('background') || el.className.includes('bg-');
    }).map(el => ({
      classes: el.className,
      bgImage: window.getComputedStyle(el).backgroundImage,
      bgColor: window.getComputedStyle(el).backgroundColor
    })).slice(0, 10);

    return { imgs, svgs, bgEls };
  })()`);

  console.log('Background & Images Info:', JSON.stringify(bgInfo, null, 2));

  ws.close();
}

main().catch(console.error);
