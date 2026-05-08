import { execSync } from 'child_process';
import { createReadStream, readdirSync, statSync, readFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { tmpdir } from 'os';
import { v2 as cloudinary } from 'cloudinary';

// Load .env.local
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

const FOLDER  = process.env.CLOUDINARY_FOLDER || 'oeuvres-emilie';
const ZIP     = '/Users/ophelie/Downloads/lpde.zip';
const TMP_DIR = join(tmpdir(), 'lpde-upload');

const THEME_MAP = {
  animaux:       'animaux',
  divers:        'divers',
  enfants:       'enfants',
  ethnique:      'ethnique',
  fleurs:        'fleurs',
  fruits_legumes:'fruits',
  graphique:     'graphique',
  mer_poissons:  'mer',
  nature:        'nature',
};

const CAT_MAP = {
  assiettes:              'assiettes',
  autre:                  'autre',
  plats:                  'plats',
  repose_sachet_de_the:   'reposesachets',
  the_cafe:               'thecafe',
  vide_poche:             'videpoche',
};

function parseFolderName(name) {
  // folder format: {theme}_{categorie}  e.g. animaux_assiettes
  // themes can have underscores (fruits_legumes, mer_poissons)
  for (const [themeKey, themeVal] of Object.entries(THEME_MAP)) {
    if (name.startsWith(themeKey + '_')) {
      const catKey = name.slice(themeKey.length + 1);
      const catVal = CAT_MAP[catKey];
      if (catVal) return { theme: themeVal, categorie: catVal };
    }
  }
  return null;
}

function titleFromFilename(filename) {
  return basename(filename, extname(filename))
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function uploadFile(filePath, theme, categorie, title) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        tags: [`theme:${theme}`, `cat:${categorie}`],
        context: { caption: title, alt: '' },
      },
      (err, res) => err ? reject(err) : resolve(res)
    );
    createReadStream(filePath).pipe(stream);
  });
}

// Extract zip
console.log('Extraction du zip...');
execSync(`rm -rf "${TMP_DIR}" && mkdir -p "${TMP_DIR}" && unzip -q "${ZIP}" -d "${TMP_DIR}"`);
console.log('Extraction terminée.\n');

// Gather files
const toUpload = [];
for (const entry of readdirSync(TMP_DIR)) {
  if (entry === 'Accueil') continue;
  const meta = parseFolderName(entry);
  if (!meta) { console.warn(`Dossier ignoré (pas reconnu): ${entry}`); continue; }
  const dir = join(TMP_DIR, entry);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir)) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
    toUpload.push({ filePath: join(dir, file), ...meta, title: titleFromFilename(file) });
  }
}

console.log(`${toUpload.length} images à uploader dans "${FOLDER}"...\n`);

let done = 0, errors = 0;
const CONCURRENCY = 5;

async function runQueue() {
  let i = 0;
  async function next() {
    if (i >= toUpload.length) return;
    const item = toUpload[i++];
    try {
      await uploadFile(item.filePath, item.theme, item.categorie, item.title);
      done++;
      process.stdout.write(`\r${done}/${toUpload.length} uploadées, ${errors} erreurs`);
    } catch (e) {
      errors++;
      console.error(`\nErreur: ${item.filePath} — ${e.message}`);
    }
    await next();
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, next));
}

await runQueue();

console.log(`\n\nTerminé ! ${done} images uploadées, ${errors} erreurs.`);
execSync(`rm -rf "${TMP_DIR}"`);
