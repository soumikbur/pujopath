const fs = require('fs');
const path = require('path');
const sharp = require(path.resolve(__dirname, '../../PujoPath (Web)/node_modules/sharp'));

const WEB_DIR = path.resolve(__dirname, '../../PujoPath (Web)');
const OUT_FILE = path.join(__dirname, 'desktop-assets-base64.json');

async function processImage(srcPath, width = 600, quality = 75) {
  if (!fs.existsSync(srcPath)) {
    console.warn('File not found:', srcPath);
    return '';
  }
  const buf = await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function main() {
  console.log('Generating optimized base64 assets for Web Desktop...');
  const assets = {
    ghibliEveningBg: await processImage(path.join(WEB_DIR, 'public/images/backgrounds/ghibli-evening-pandal-crowd-landscape.webp'), 1440, 70),
    moumita: await processImage(path.join(WEB_DIR, 'public/images/developers/moumita.jpg'), 300, 80),
    soumik: await processImage(path.join(WEB_DIR, 'public/images/developers/soumik.jpg'), 300, 80),
    sovabazar: await processImage(path.join(WEB_DIR, 'public/images/pandals/sovabazar-rajbari.webp'), 400, 75),
    bagbazar: await processImage(path.join(WEB_DIR, 'public/images/pandals/bagbazar-sarbojanin.webp'), 400, 75),
    collegeSquare: await processImage(path.join(WEB_DIR, 'public/images/pandals/college-square.webp'), 400, 75),
    sreebhumi: await processImage(path.join(WEB_DIR, 'public/images/pandals/sreebhumi-sporting-club.webp'), 400, 75),
    santoshMitra: await processImage(path.join(WEB_DIR, 'public/images/pandals/santosh-mitra-square.webp'), 400, 75),
    maddox: await processImage(path.join(WEB_DIR, 'public/images/pandals/maddox-square.webp'), 400, 75),
    ekdalia: await processImage(path.join(WEB_DIR, 'public/images/pandals/ekdalia-evergreen.webp'), 400, 75),
    suruchi: await processImage(path.join(WEB_DIR, 'public/images/pandals/suruchi-sangha.webp'), 400, 75),
    naktala: await processImage(path.join(WEB_DIR, 'public/images/pandals/naktala-udayan-sangha.webp'), 400, 75),
    mahalayaArt: await processImage(path.join(WEB_DIR, 'public/images/mahalaya-art.jpg'), 400, 75)
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(assets, null, 2));
  console.log('✓ Successfully generated desktop-assets-base64.json! Total keys:', Object.keys(assets).length);
}

main().catch(console.error);
