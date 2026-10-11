const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeImages() {
  const dirs = [
    path.join(__dirname, '../public/images'),
    path.join(__dirname, '../public/images/pandals'),
  ];

  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
        const filePath = path.join(dir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const sizeBefore = fileBuffer.length;
        totalBefore += sizeBefore;

        // Create optimized buffer from buffer (not file path to avoid Windows file locks)
        const image = sharp(fileBuffer);
        const metadata = await image.metadata();

        let pipeline = image;
        if (metadata.width && metadata.width > 1200) {
          pipeline = pipeline.resize(1200, null, { withoutEnlargement: true });
        }

        const optimizedBuffer = await pipeline
          .jpeg({ quality: 80, mozjpeg: true, progressive: true })
          .toBuffer();

        if (optimizedBuffer.length < sizeBefore) {
          fs.writeFileSync(filePath, optimizedBuffer);
          totalAfter += optimizedBuffer.length;
          console.log(
            `✓ Optimized ${file}: ${(sizeBefore / 1024).toFixed(1)}KB -> ${(optimizedBuffer.length / 1024).toFixed(1)}KB (-${Math.round((1 - optimizedBuffer.length / sizeBefore) * 100)}%)`
          );
        } else {
          totalAfter += sizeBefore;
        }
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Before: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total After:  ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Overall Savings: -${Math.round((1 - totalAfter / totalBefore) * 100)}%`);
  console.log(`========================================\n`);
}

optimizeImages().catch(console.error);
