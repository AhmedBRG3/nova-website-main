// One-off build script: generates responsive WebP + JPEG variants of every
// gallery photo (grid thumbnail, tablet, and lightbox sizes) so the browser
// never downloads a 1600px original to show inside a 380px grid cell.
//
// Source originals live in assets/work-source/ (outside public/) so the
// unoptimized files never ship in the built site. Re-run this after adding
// new photos there, then paste the printed WORK_MANIFEST array into
// src/data/index.js.
//
// Run with: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('assets/work-source');
const OUT_DIR = path.resolve('public/work');
const WIDTHS = [420, 800, 1400]; // grid-mobile, grid-desktop, lightbox

const files = readdirSync(SRC_DIR).filter(
  (f) => /^work-\d+\.(jpe?g)$/i.test(f) && statSync(path.join(SRC_DIR, f)).isFile(),
);

const rows = [];

for (const file of files.sort()) {
  const base = file.replace(/\.(jpe?g)$/i, '');
  const srcPath = path.join(SRC_DIR, file);
  const meta = await sharp(srcPath).metadata();
  const widths = [];

  for (const w of WIDTHS) {
    if (w > meta.width) continue; // never upscale
    await sharp(srcPath).resize({ width: w }).webp({ quality: 72 }).toFile(path.join(OUT_DIR, `${base}-${w}.webp`));
    await sharp(srcPath).resize({ width: w }).jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(OUT_DIR, `${base}-${w}.jpg`));
    widths.push(w);
  }
  const aspect = +(meta.width / meta.height).toFixed(4);
  rows.push(`  ['${base}', ${aspect}, [${widths.join(', ')}]],`);
  console.log(`✓ ${file} (${meta.width}x${meta.height})`);
}

console.log('\nWORK_MANIFEST rows (paste into src/data/index.js):\n');
console.log(rows.join('\n'));
