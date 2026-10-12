const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = [
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_pandal_illumination_1791805728007.jpg',
    outName: 'ghibli-pandal-illumination.webp',
    title: 'Illuminated Pandal Night',
    description: 'An ornate Durga Puja pandal glowing with warm golden lights and festive twilight mist.',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_devotees_praying_1791806002467.jpg',
    outName: 'ghibli-devotees-praying.webp',
    title: 'Devotees in Anjali',
    description: 'Bengali devotees in traditional garad and dhoti offering heartfelt prayers before Goddess Durga.',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_priest_aarti_1791806253625.jpg',
    outName: 'ghibli-priest-aarti.webp',
    title: 'Sacred Sandhya Aarti',
    description: 'A Brahmin priest conducting evening puja with a tiered brass panchapradip and fragrant dhuno.',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_durga_idol_flowers_1791806538520.jpg',
    outName: 'ghibli-durga-idol-flowers.webp',
    title: 'Ekchala Protima & Kash Phool',
    description: 'Traditional sholapith daaker saaj Durga idol surrounded by autumn kash flowers and red hibiscus.',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_evening_pandal_crowd_1791806913720.jpg',
    outName: 'ghibli-evening-pandal-crowd.webp',
    title: 'Festive Evening Pandal & Dhakis',
    description: 'Joyful Kolkata families, festive street stalls, and rhythmic dhakis playing outside a glowing pandal.',
  },
  {
    src: 'C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\73e47e40-919a-4c44-8d4c-29b258b56c22\\ghibli_traditional_diyas_incense_1791807186381.jpg',
    outName: 'ghibli-traditional-diyas-incense.webp',
    title: 'Alpana, Diyas & Dhunuchi',
    description: 'A serene sanctum floor with intricate white alpana, glowing terracotta lamps, and frankincense smoke.',
  },
];

async function run() {
  console.log('Optimizing Ghibli illustrations for web delivery...');
  for (const img of images) {
    const dest = path.join(targetDir, img.outName);
    await sharp(img.src)
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 82, effort: 5 })
      .toFile(dest);

    const stats = fs.statSync(dest);
    console.log(`✓ Processed ${img.outName} (${(stats.size / 1024).toFixed(1)} KB) - ${img.title}`);
  }
  console.log('All 6 Ghibli illustrations successfully optimized into public/images/backgrounds/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
