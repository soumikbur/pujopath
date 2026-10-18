const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const routes = ['/', '/explore', '/map', '/planner', '/plan', '/calendar', '/metro', '/music', '/developer', '/about'];
  
  for (const r of routes) {
    try {
      const resp = await page.goto('https://pujopath-five.vercel.app' + r, { waitUntil: 'domcontentloaded', timeout: 8000 });
      const title = await page.title();
      const h = await page.evaluate(() => {
        const h1 = document.querySelector('h1, h2');
        return h1 ? h1.innerText.replace(/\n/g, ' ') : 'none';
      });
      console.log(r, '-> status:', resp.status(), 'final url:', page.url(), 'title:', title, 'h1:', h);
    } catch (e) {
      console.log(r, '-> error:', e.message);
    }
  }
  
  await browser.close();
})();
