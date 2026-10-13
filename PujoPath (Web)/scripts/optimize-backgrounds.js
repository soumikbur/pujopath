const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const landscapeImages = [
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_pandal_illumination_1791805728007.jpg',
    baseName: 'ghibli-pandal-illumination',
    title: 'Illuminated Pandal Night',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_devotees_praying_1791806002467.jpg',
    baseName: 'ghibli-devotees-praying',
    title: 'Devotees in Anjali',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_priest_aarti_1791806253625.jpg',
    baseName: 'ghibli-priest-aarti',
    title: 'Sacred Sandhya Aarti',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_durga_idol_flowers_1791806538520.jpg',
    baseName: 'ghibli-durga-idol-flowers',
    title: 'Ekchala Protima & Kash Phool',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_evening_pandal_crowd_1791806913720.jpg',
    baseName: 'ghibli-evening-pandal-crowd',
    title: 'Festive Evening Pandal & Dhakis',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_traditional_diyas_incense_1791807186381.jpg',
    baseName: 'ghibli-traditional-diyas-incense',
    title: 'Alpana, Diyas & Dhunuchi',
  },
];

const portraitImages = [
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_pandal_illumination_portrait_1791811988035.jpg',
    baseName: 'ghibli-pandal-illumination',
    title: 'Illuminated Pandal Night (Portrait)',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_devotees_praying_portrait_1791812233729.jpg',
    baseName: 'ghibli-devotees-praying',
    title: 'Devotees in Anjali (Portrait)',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_priest_aarti_portrait_1791812406032.jpg',
    baseName: 'ghibli-priest-aarti',
    title: 'Sacred Sandhya Aarti (Portrait)',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_durga_idol_flowers_portrait_1791812688646.jpg',
    baseName: 'ghibli-durga-idol-flowers',
    title: 'Ekchala Protima & Kash Phool (Portrait)',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_evening_pandal_crowd_portrait_1791812874669.jpg',
    baseName: 'ghibli-evening-pandal-crowd',
    title: 'Festive Evening Pandal & Dhakis (Portrait)',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_traditional_diyas_incense_1791807186381.jpg',
    baseName: 'ghibli-traditional-diyas-incense',
    title: 'Alpana, Diyas & Dhunuchi (Portrait)',
    customFit: { width: 1080, height: 1440, fit: 'cover', position: 'center' },
  },
];

async function run() {
  console.log('--- Optimizing Ghibli Landscape (16:9) & Portrait (3:4) Illustrations ---');

  // 1. Process Landscape Images
  for (const item of landscapeImages) {
    const landscapeName = `${item.baseName}-landscape.webp`;
    const legacyName = `${item.baseName}.webp`;

    const destLandscape = path.join(targetDir, landscapeName);
    const destLegacy = path.join(targetDir, legacyName);

    await sharp(item.src)
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 82, effort: 5 })
      .toFile(destLandscape);

    // Also write legacy filename for backwards compatibility
    fs.copyFileSync(destLandscape, destLegacy);

    const stats = fs.statSync(destLandscape);
    console.log(`✓ [Landscape 16:9] ${landscapeName} (${(stats.size / 1024).toFixed(1)} KB) - ${item.title}`);
  }

  // 2. Process Portrait Images
  for (const item of portraitImages) {
    const portraitName = `${item.baseName}-portrait.webp`;
    const destPortrait = path.join(targetDir, portraitName);

    const resizeOpts = item.customFit || { width: 1080, height: 1440, fit: 'cover' };

    await sharp(item.src)
      .resize(resizeOpts.width, resizeOpts.height, { fit: resizeOpts.fit, position: resizeOpts.position || 'center' })
      .webp({ quality: 82, effort: 5 })
      .toFile(destPortrait);

    const stats = fs.statSync(destPortrait);
    console.log(`✓ [Portrait 3:4]   ${portraitName} (${(stats.size / 1024).toFixed(1)} KB) - ${item.title}`);
  }

  console.log('All 12 illustrations (6 Landscape 16:9 + 6 Portrait 3:4) successfully generated in public/images/backgrounds/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
