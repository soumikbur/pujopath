const http = require('http');
const fs = require('fs');
const path = require('path');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url && t.url.includes('figma.com/design/'));
        resolve(figmaTab.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  console.log('Connected to Figma WS:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          if (m.error) reject(new Error(m.error.message));
          else resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const brainDir = 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc';

  const targets = [
    {
      pageName: 'Web — Desktop',
      nodeId: '0-1',
      outName: 'figma_verified_desktop_canvas.png'
    },
    {
      pageName: 'Web — Mobile',
      nodeId: '1-710',
      outName: 'figma_verified_mobile_canvas.png'
    },
    {
      pageName: 'Capacitor — Android Mobile',
      nodeId: '1-1149',
      outName: 'figma_verified_capacitor_canvas.png'
    }
  ];

  for (const t of targets) {
    const targetUrl = `https://www.figma.com/design/JygRV7jLCZYwmauz1RSHZ6/PujoPath-%E2%80%94-Complete-UI-UX-Design?node-id=${t.nodeId}&p=f&t=test-0`;
    console.log(`\nNavigating to ${t.pageName} via URL: ${targetUrl}...`);
    await sendCmd('Page.navigate', { url: targetUrl });
    
    // Wait 5 seconds for canvas to load and render
    await new Promise(r => setTimeout(r, 5000));

    // Check if "Open here instead" button is present and click it
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Open here'));
        if (btn) {
          btn.click();
          return 'Clicked Open here';
        }
        return 'No banner';
      })()`,
      returnByValue: true
    });

    // Wait 3 seconds
    await new Promise(r => setTimeout(r, 3000));

    console.log(`Capturing screenshot for ${t.pageName}...`);
    const shot = await sendCmd('Page.captureScreenshot');
    const outPath = path.join(brainDir, t.outName);
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log(`✓ Saved ${t.outName} (${(shot.data.length / 1024).toFixed(1)} KB base64)`);
  }

  ws.close();
  console.log('\nAll canvas screenshots successfully captured!');
}

main().catch(console.error);
