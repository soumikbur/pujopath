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

  const info = await evaluate(`(() => {
    const bottomNav = document.querySelector('nav') || Array.from(document.querySelectorAll('div')).find(d => d.className && d.className.includes('fixed') && d.className.includes('bottom'));
    
    // Find all interactive items in bottom nav
    const items = bottomNav ? Array.from(bottomNav.querySelectorAll('a, button')).map(el => ({
      tag: el.tagName,
      text: el.innerText.trim(),
      href: el.getAttribute('href'),
      className: el.className,
      ariaLabel: el.getAttribute('aria-label'),
      rect: el.getBoundingClientRect()
    })) : [];

    // Header info
    const header = document.querySelector('header');
    const headerButtons = header ? Array.from(header.querySelectorAll('button, a')).map(el => ({
      tag: el.tagName,
      text: el.innerText.trim(),
      ariaLabel: el.getAttribute('aria-label'),
      className: el.className,
      rect: el.getBoundingClientRect()
    })) : [];

    return {
      bottomNavFound: !!bottomNav,
      bottomNavClass: bottomNav ? bottomNav.className : null,
      bottomNavRect: bottomNav ? bottomNav.getBoundingClientRect() : null,
      bottomNavItems: items,
      headerButtons
    };
  })()`);

  console.log(JSON.stringify(info, null, 2));

  // Now click on More button programmatically and see what DOM elements appear
  console.log('\nClicking More button...');
  const moreResult = await evaluate(`(() => {
    const moreBtn = Array.from(document.querySelectorAll('nav a, nav button, [class*="bottom"] a, [class*="bottom"] button')).find(el => el.innerText.includes('More'));
    if (moreBtn) {
      moreBtn.click();
      return { clicked: true, tag: moreBtn.tagName };
    }
    return { clicked: false };
  })()`);
  console.log('Click result:', moreResult);

  await new Promise(r => setTimeout(r, 800));

  const afterClick = await evaluate(`(() => {
    // Check for dialogs, drawers, bottom sheets, menus
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [class*="drawer"], [class*="modal"], [class*="sheet"], [class*="menu"], [class*="overlay"]')).map(el => ({
      className: el.className,
      role: el.getAttribute('role'),
      text: el.innerText.slice(0, 200),
      rect: el.getBoundingClientRect()
    }));
    return {
      dialogCount: dialogs.length,
      dialogs,
      url: window.location.href
    };
  })()`);
  console.log('DOM after clicking More:', JSON.stringify(afterClick, null, 2));

  ws.close();
}

main().catch(console.error);
