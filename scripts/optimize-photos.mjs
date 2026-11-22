/**
 * Turns the raw job photos in "Before and afters/" into web-ready WebP files in public/images/.
 *   npm run photos
 *
 * - Outputs a 1600px desktop and an 800px mobile version of each photo.
 * - Renames every file to a neutral name, so customer names never reach the site's URLs or alt text.
 * - The raw folder is git-ignored on purpose.
 *
 * Edit MAP below so each raw file name points to the right neutral name. Names are matched
 * case-insensitively, and a raw name only has to *contain* the key.
 */
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'Before and afters';
const OUT = 'public/images';

// TODO(owner): adjust once the photos are in the folder. Key = part of the raw file name, value = neutral output name.
const MAP = {
  'patio before': 'patio-1-before',
  'paio after': 'patio-1-after', // the original file name is misspelled. This pairs it with "Patio Before".
  'patio after': 'patio-1-after',
  'wood deck before': 'deck-1-before',
  'wood deck after': 'deck-1-after',
  'stairs before': 'stairs-1-before',
  'stairs after': 'stairs-1-after',
  'walkway before': 'walkway-1-before',
  'walkway after': 'walkway-1-after',
  // House photos often carry customer names, e.g. "<Name> house before.jpeg"; map each one here:
  // 'jill house before': 'house-wash-1-before',
  // 'jill house after': 'house-wash-1-after',
};

const files = await readdir(SRC).catch(() => {
  console.error(`No "${SRC}/" folder found. Put the raw photos there and run again.`);
  process.exit(1);
});
await mkdir(OUT, { recursive: true });

for (const file of files) {
  if (!/\.(jpe?g|png|heic|webp)$/i.test(file)) continue;
  const lower = file.toLowerCase();
  const key = Object.keys(MAP).find((k) => lower.includes(k));
  if (!key) {
    console.warn(`skip (no mapping): ${file}`);
    continue;
  }
  const name = MAP[key];
  const input = sharp(path.join(SRC, file)).rotate();
  await input.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${OUT}/${name}.webp`);
  await input.clone().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 74 }).toFile(`${OUT}/${name}-800.webp`);
  console.log(`${file}  →  ${OUT}/${name}.webp (+ -800)`);
}
console.log('\nNow set before/after paths for each service in src/data/services.ts, e.g. before: "/images/patio-1-before.webp".');
