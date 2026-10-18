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
    const all = Array.from(document.querySelectorAll('*'));
    const fixedBottom = all.filter(el => {
      const s = window.getComputedStyle(el);
      return s.position === 'fixed' && el.getBoundingClientRect().bottom >= window.innerHeight - 5 && el.offsetHeight > 20;
    });

    return fixedBottom.map(el => ({
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      text: el.innerText.replace(/\\n/g, ' | '),
      buttons: Array.from(el.querySelectorAll('button, a')).map(b => ({
        tag: b.tagName,
        text: b.innerText.replace(/\\n/g, ' '),
        href: b.getAttribute('href'),
        className: b.className
      }))
    }));
  })()`);

  console.log(JSON.stringify(res, null, 2));

  // Also test clicking the bottom More button
  console.log('\n--- Clicking the bottom More item ---');
  const clickMore = await evaluate(`(() => {
    const bottomNav = document.querySelector('[class*="bottom-0"], [class*="bottom"]');
    const moreBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('More') && el.getBoundingClientRect().top > 500);
    if (moreBtn) {
      moreBtn.click();
      return { clicked: true, tag: moreBtn.tagName, text: moreBtn.innerText };
    }
    return { clicked: false };
  })()`);
  console.log('Click More result:', clickMore);

  await new Promise(r => setTimeout(r, 1000));

  const modalCheck = await evaluate(`(() => {
    return Array.from(document.querySelectorAll('*')).filter(el => {
      const s = window.getComputedStyle(el);
      return (s.position === 'fixed' || s.position === 'absolute') && el.offsetHeight > 100 && el.offsetWidth > 100 && parseInt(s.zIndex || '0') > 10;
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      text: el.innerText.replace(/\\n/g, ' | ').slice(0, 300)
    }));
  })()`);

  console.log('Modals/Drawers open:', JSON.stringify(modalCheck, null, 2));

  ws.close();
}

main().catch(console.error);
