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
    // Find any element containing the text "Explore" and "Planner" together
    const all = Array.from(document.querySelectorAll('*'));
    const bottomNavEl = all.find(el => {
      return el.innerText && 
             el.innerText.includes('Home') && 
             el.innerText.includes('Explore') && 
             el.innerText.includes('Map') && 
             el.innerText.includes('Planner') && 
             el.innerText.includes('More') &&
             el.children.length >= 5;
    });

    if (!bottomNavEl) return { found: false };

    const items = Array.from(bottomNavEl.querySelectorAll('a, button, div')).filter(el => {
      return ['Home', 'Explore', 'Map', 'Planner', 'More'].includes(el.innerText?.trim());
    });

    return {
      found: true,
      tag: bottomNavEl.tagName,
      className: bottomNavEl.className,
      style: bottomNavEl.getAttribute('style'),
      computed: {
        position: window.getComputedStyle(bottomNavEl).position,
        bottom: window.getComputedStyle(bottomNavEl).bottom,
        height: window.getComputedStyle(bottomNavEl).height,
        backgroundColor: window.getComputedStyle(bottomNavEl).backgroundColor,
        borderColor: window.getComputedStyle(bottomNavEl).borderColor,
        boxShadow: window.getComputedStyle(bottomNavEl).boxShadow,
        zIndex: window.getComputedStyle(bottomNavEl).zIndex
      },
      rect: bottomNavEl.getBoundingClientRect(),
      items: Array.from(bottomNavEl.children).map(c => ({
        tag: c.tagName,
        className: c.className,
        text: c.innerText.replace(/\\n/g, ' '),
        rect: c.getBoundingClientRect(),
        html: c.outerHTML
      }))
    };
  })()`);

  console.log(JSON.stringify(res, null, 2));

  // Now find the More button in this bottom nav and click it
  console.log('\n--- Finding and clicking the bottom nav "More" button ---');
  const clickMoreRes = await evaluate(`(() => {
    const all = Array.from(document.querySelectorAll('a, button, [role="button"], div'));
    const moreBtn = all.find(el => {
      const t = el.innerText?.trim();
      return (t === 'More' || t === 'More\\n•••' || t === '•••\\nMore') && el.getBoundingClientRect().top > 700;
    });
    if (moreBtn) {
      moreBtn.click();
      return { clicked: true, tag: moreBtn.tagName, className: moreBtn.className, rect: moreBtn.getBoundingClientRect() };
    }
    return { clicked: false };
  })()`);
  console.log('Click More result:', clickMoreRes);

  await new Promise(r => setTimeout(r, 600));

  const popupRes = await evaluate(`(() => {
    const popups = Array.from(document.querySelectorAll('*')).filter(el => {
      const s = window.getComputedStyle(el);
      return (s.position === 'fixed' || s.position === 'absolute') && 
             el.offsetWidth > 150 && 
             el.offsetHeight > 80 && 
             parseInt(s.zIndex || '0') >= 50;
    });
    return popups.map(p => ({
      tag: p.tagName,
      className: p.className,
      rect: p.getBoundingClientRect(),
      text: p.innerText.replace(/\\n/g, ' | ')
    }));
  })()`);
  console.log('Open popups / sheets / menus:', JSON.stringify(popupRes, null, 2));

  ws.close();
}

main().catch(console.error);
