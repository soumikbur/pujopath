const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const refDir = path.resolve('PujoPath (Figma)/validation/reference_captures');
  const files = fs.readdirSync(refDir).filter(f => f.endsWith('.png'));
  
  console.log('--- Reference Captures Analysis ---');
  for (const f of files) {
    const filePath = path.join(refDir, f);
    await page.goto('file:///' + filePath.replace(/\\/g, '/'));
    
    const analysis = await page.evaluate(() => {
      const img = document.querySelector('img');
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const getHex = (x, y) => {
        if (x >= canvas.width || y >= canvas.height || x < 0 || y < 0) return '#000000';
        const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
      };
      
      return {
        w: img.naturalWidth,
        h: img.naturalHeight,
        topBg: getHex(canvas.width / 2, 20),
        midBg: getHex(canvas.width / 2, 300),
        botBg: getHex(canvas.width / 2, canvas.height - 30)
      };
    });
    
    console.log(f, ':', analysis.w, 'x', analysis.h, 'top:', analysis.topBg, 'mid:', analysis.midBg, 'bot:', analysis.botBg);
  }
  
  await browser.close();
}

main().catch(console.error);
