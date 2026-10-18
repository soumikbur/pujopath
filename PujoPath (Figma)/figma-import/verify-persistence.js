const http = require('http');
const fs = require('fs');

async function verifyPersistence() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  console.log('Sending Page.reload to test cloud persistence...');
  ws.send(JSON.stringify({ id: 1, method: 'Page.reload' }));

  // Wait 7 seconds for Figma to re-initialize and fetch from cloud
  await new Promise(r => setTimeout(r, 7000));

  console.log('Inspecting reloaded document state...');
  const result = await new Promise((resolve) => {
    const id = 2;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result.result.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          return {
            title: document.title,
            url: window.location.href,
            rootName: figma.root ? figma.root.name : null,
            pageCount: figma.root ? figma.root.children.length : 0,
            pages: figma.root ? figma.root.children.map(p => ({
              name: p.name,
              frameCount: p.children.length,
              frames: p.children.map(f => f.name)
            })) : [],
            stylesCount: figma.getLocalPaintStyles ? figma.getLocalPaintStyles().length : 0
          };
        })()`,
        returnByValue: true
      }
    }));
  });

  console.log('RELOADED PERSISTENCE CHECK:');
  console.log(JSON.stringify(result, null, 2));

  // Capture final screenshot
  const shotId = 3;
  ws.send(JSON.stringify({ id: shotId, method: 'Page.captureScreenshot' }));
  const shotMsg = await new Promise(resolve => {
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === shotId) {
        ws.removeEventListener('message', handler);
        resolve(msg);
      }
    };
    ws.addEventListener('message', handler);
  });
  const buf = Buffer.from(shotMsg.result.data, 'base64');
  fs.writeFileSync('C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/final_persisted_figma_document.png', buf);
  console.log('Saved final_persisted_figma_document.png, bytes:', buf.length);

  ws.close();
}

verifyPersistence().catch(console.error);
