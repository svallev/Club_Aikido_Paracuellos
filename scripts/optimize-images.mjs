import { readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/images';
const QUALITY = 82;

let totalIn = 0;
let totalOut = 0;
let converted = 0;

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? filesIn(p) : [p];
  });
}

for (const file of filesIn(ROOT)) {
  if (!/\.(jpe?g)$/i.test(file)) continue;
  const out = join(parse(file).dir, `${parse(file).name}.webp`);
  if (statSync(out, { throwIfNoEntry: false })) continue;

  const { size: inSize } = statSync(file);
  const data = await sharp(file)
    .rotate()
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();
  writeFileSync(out, data);
  const { size: outSize } = statSync(out);
  totalIn += inSize;
  totalOut += outSize;
  converted += 1;
  console.log(`${file} → ${out}  (${(inSize / 1024).toFixed(0)} KB → ${(outSize / 1024).toFixed(0)} KB)`);
  rmSync(file);
}

console.log(`\nConvertidas: ${converted}`);
console.log(`Total original: ${(totalIn / 1024 / 1024).toFixed(2)} MB → WebP: ${(totalOut / 1024 / 1024).toFixed(2)} MB (${totalIn ? Math.round(100 - (totalOut / totalIn) * 100) : 0}% menos)`);