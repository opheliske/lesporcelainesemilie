import { readFileSync } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const envPath = new URL('../.env.local', import.meta.url).pathname;
const env = readFileSync(envPath, 'utf8');
for (const line of env.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && !key.startsWith('#') && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'oeuvres-emilie';

const THEME_FOLDER = {
  animaux:   'animaux',
  fleurs:    'fleurs',
  mer:       'mer_poissons',
  nature:    'nature',
  ethnique:  'ethnique',
  enfants:   'enfants',
  fruits:    'fruits_legumes',
  graphique: 'graphique',
  divers:    'divers',
};

const CAT_FOLDER = {
  assiettes:    'assiettes',
  plats:        'plats',
  thecafe:      'the_cafe',
  reposesachets:'repose_sachet_de_the',
  videpoche:    'vide_poche',
  autre:        'autre',
};

// Fetch all resources
async function fetchAll() {
  const all = [];
  let cursor;
  do {
    const q = cloudinary.search
      .expression(`folder:${FOLDER}`)
      .max_results(500)
      .with_field('tags');
    if (cursor) q.next_cursor(cursor);
    const res = await q.execute();
    all.push(...(res.resources || []));
    cursor = res.next_cursor;
  } while (cursor);
  return all;
}

const resources = await fetchAll();
console.log(`${resources.length} images trouvées\n`);

// Only move images that are directly in oeuvres-emilie/ (not already in a subfolder)
const toMove = resources.filter(r => r.public_id.split('/').length === 2);
const alreadyMoved = resources.length - toMove.length;
if (alreadyMoved > 0) console.log(`${alreadyMoved} images déjà dans des sous-dossiers (ignorées)`);
console.log(`${toMove.length} images à déplacer\n`);

let done = 0, skipped = 0, errors = 0;
const CONCURRENCY = 5;

async function moveItem(r) {
  const tags = r.tags || [];
  const theme = tags.find(t => t.startsWith('theme:'))?.slice(6);
  const cat   = tags.find(t => t.startsWith('cat:'))?.slice(4);
  const tf = THEME_FOLDER[theme];
  const cf = CAT_FOLDER[cat];

  if (!tf || !cf) {
    skipped++;
    console.warn(`Ignoré (tags inconnus): ${r.public_id} | theme=${theme} cat=${cat}`);
    return;
  }

  const filename  = r.public_id.split('/').pop();
  const newId = `${FOLDER}/${tf}_${cf}/${filename}`;
  await cloudinary.uploader.rename(r.public_id, newId, { overwrite: false, invalidate: true });
  done++;
  process.stdout.write(`\r${done}/${toMove.length} déplacées, ${errors} erreurs`);
}

let i = 0;
async function next() {
  if (i >= toMove.length) return;
  const item = toMove[i++];
  try { await moveItem(item); } catch (e) {
    errors++;
    console.error(`\nErreur ${item.public_id}: ${e.message}`);
  }
  await next();
}
await Promise.all(Array.from({ length: CONCURRENCY }, next));

console.log(`\n\nTerminé ! ${done} déplacées, ${skipped} ignorées, ${errors} erreurs.`);
