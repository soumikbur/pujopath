const http = require('http');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '../assets/images');

async function getTab() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  return tabs.find((t) => t.url && t.url.includes('figma.com/design/'));
}

async function convertAll() {
  const tab = await getTab();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  function evaluate(expr) {
    return new Promise((resolve) => {
      const id = reqId++;
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(
        JSON.stringify({
          id,
          method: 'Runtime.evaluate',
          params: { expression: expr, returnByValue: true, awaitPromise: true },
        })
      );
    });
  }

  const webpFiles = [
    'backgrounds/ghibli-durga-idol-flowers-landscape.webp',
    'pandals/bagbazar-sarbojanin.webp',
    'pandals/kumartuli-park.webp',
    'pandals/sovabazar-rajbari.webp',
    'pandals/suruchi-sangha.webp',
    'pandals/ekdalia-evergreen.webp',
    'pandals/sreebhumi-sporting-club.webp',
    'pandals/college-square.webp',
  ];

  for (const rel of webpFiles) {
    const fullPath = path.join(ASSETS_DIR, rel);
    if (!fs.existsSync(fullPath)) continue;

    const outPath = fullPath.replace('.webp', '.jpg');
    console.log(`Converting ${rel} to JPEG via Chrome canvas...`);
    const webpBase64 = fs.readFileSync(fullPath).toString('base64');

    const jpegDataUrl = await evaluate(`(async () => {
      const img = new Image();
      img.src = 'data:image/webp;base64,${webpBase64}';
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(img.width, 1200);
      canvas.height = Math.round((img.height / img.width) * canvas.width);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.88);
    })()`);

    if (jpegDataUrl && jpegDataUrl.startsWith('data:image/jpeg;base64,')) {
      const b64 = jpegDataUrl.replace('data:image/jpeg;base64,', '');
      fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
      console.log(`  -> Saved ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    } else {
      console.error(`  -> Failed to convert ${rel}`);
    }
  }

  ws.close();
  console.log('All WebP images converted to JPEG successfully!');
}

convertAll().catch(console.error);
