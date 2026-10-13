const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const sources = JSON.parse(fs.readFileSync('scripts/pandal-sources.json', 'utf8'));
const outputDir = path.join(__dirname, '..', 'public', 'images', 'pandals');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PujoPathApp/1.0 (contact@pujopath.org)' } }, res => {
      // Handle redirect if any
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function processAll() {
  console.log(`Starting download and WebP optimization for ${sources.length} pandals...`);
  const report = [];

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const targetFilename = `${s.id}.webp`;
    const targetPath = path.join(outputDir, targetFilename);

    console.log(`[${i + 1}/${sources.length}] Downloading ${s.id} from ${s.url.substring(0, 60)}...`);
    try {
      const buffer = await downloadBuffer(s.url);
      const originalSize = buffer.length;

      // Optimize and resize to 1200x675 (16:9 aspect-video)
      const optimizedBuffer = await sharp(buffer)
        .resize(1200, 675, {
          fit: 'cover',
          position: sharp.strategy.entropy, // Smart focus on high-detail regions
        })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();

      fs.writeFileSync(targetPath, optimizedBuffer);
      const optimizedSize = optimizedBuffer.length;
      const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(`   ✓ Saved ${targetFilename} (${Math.round(optimizedSize / 1024)} KB, -${reduction}% from ${Math.round(originalSize / 1024)} KB)`);

      report.push({
        id: s.id,
        filename: targetFilename,
        author: s.author,
        license: s.license,
        originalSizeKB: Math.round(originalSize / 1024),
        optimizedSizeKB: Math.round(optimizedSize / 1024),
        dimensions: '1200x675',
      });
    } catch (err) {
      console.error(`   ✗ Error processing ${s.id}:`, err.message);
    }
  }

  // Also create an optimized fallback if not exists
  const fallbackPath = path.join(outputDir, 'pandal-fallback.webp');
  if (fs.existsSync(path.join(outputDir, 'pandal-fallback.jpg'))) {
    const fallbackBuf = fs.readFileSync(path.join(outputDir, 'pandal-fallback.jpg'));
    const optFallback = await sharp(fallbackBuf)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
    fs.writeFileSync(fallbackPath, optFallback);
    console.log(`   ✓ Created optimized pandal-fallback.webp (${Math.round(optFallback.length / 1024)} KB)`);
  }

  fs.writeFileSync('scripts/pandal-attribution.json', JSON.stringify(report, null, 2));
  console.log(`\nCompleted! Processed ${report.length} / ${sources.length} pandal images.`);
}

processAll();
