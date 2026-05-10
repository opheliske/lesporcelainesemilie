import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import { unstable_cache, revalidateTag } from 'next/cache';
import type { Oeuvre, Theme, Categorie } from '@/types/oeuvre';
import { THEMES, CATEGORIES } from './constants';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'oeuvres-emilie';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const url = (publicId: string, transformation: string) =>
  `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}.jpg`;

function toOeuvre(r: any): Oeuvre {
  const tags: string[] = r.tags || [];
  const theme = (tags.find((t) => t.startsWith('theme:'))?.slice(6) || '') as Theme;
  const categorie = (tags.find((t) => t.startsWith('cat:'))?.slice(4) || '') as Categorie;
  const pinned = tags.includes('pinned');
  const ctx = r.context?.custom || r.context || {};
  return {
    publicId: r.public_id,
    title: ctx.caption || ctx.title || 'Sans titre',
    description: ctx.alt || ctx.description || '',
    theme,
    categorie,
    thumb: url(r.public_id, 'c_fit,w_600,h_750,q_auto,f_auto'),
    full: url(r.public_id, 'c_fit,w_1200,h_1500,q_auto,f_auto'),
    createdAt: r.created_at,
    pinned,
  };
}

export async function uploadOeuvre(args: {
  buffer: Buffer;
  title: string;
  theme: string;
  categorie: string;
  description: string;
}): Promise<Oeuvre> {
  if (!THEMES.includes(args.theme as Theme)) throw new Error('Thème invalide');
  if (!CATEGORIES.includes(args.categorie as Categorie)) throw new Error('Catégorie invalide');

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        tags: [`theme:${args.theme}`, `cat:${args.categorie}`],
        context: { caption: args.title, alt: args.description },
      },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(args.buffer);
  });
  return toOeuvre(result);
}

async function fetchAllOeuvres(): Promise<Oeuvre[]> {
  const all: any[] = [];
  let cursor: string | undefined;
  do {
    const query = cloudinary.search
      .expression(`folder:${FOLDER}`)
      .sort_by('created_at', 'desc')
      .max_results(500)
      .with_field('tags')
      .with_field('context');
    if (cursor) query.next_cursor(cursor);
    const res = await query.execute();
    all.push(...(res.resources || []));
    cursor = res.next_cursor;
  } while (cursor);
  return all.map(toOeuvre);
}

export const getAllOeuvres = unstable_cache(fetchAllOeuvres, ['all-oeuvres'], {
  tags: ['oeuvres'],
  revalidate: 3600,
});

export async function getRecentOeuvres(n: number): Promise<Oeuvre[]> {
  const all = await getAllOeuvres();
  return all.slice(0, n);
}

export async function getPinnedOeuvres(): Promise<Oeuvre[]> {
  const all = await getAllOeuvres();
  const pinned = all.filter((o) => o.pinned);
  return pinned.length > 0 ? pinned : all.slice(0, 10);
}

export async function setPinned(publicId: string, pin: boolean): Promise<void> {
  if (pin) {
    await cloudinary.uploader.add_tag('pinned', [publicId]);
  } else {
    await cloudinary.uploader.remove_tag('pinned', [publicId]);
  }
  revalidateTag('oeuvres', {});
}

export function invalidateOeuvresCache() {
  revalidateTag('oeuvres', {});
}

export async function updateOeuvre(args: {
  publicId: string;
  title: string;
  theme: string;
  categorie: string;
  description: string;
  buffer?: Buffer;
}): Promise<Oeuvre> {
  if (!THEMES.includes(args.theme as Theme)) throw new Error('Thème invalide');
  if (!CATEGORIES.includes(args.categorie as Categorie)) throw new Error('Catégorie invalide');

  if (args.buffer) {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: args.publicId,
          overwrite: true,
          invalidate: true,
          tags: [`theme:${args.theme}`, `cat:${args.categorie}`],
          context: { caption: args.title, alt: args.description },
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(args.buffer);
    });
    return toOeuvre(result);
  }

  await cloudinary.uploader.remove_all_tags([args.publicId]);
  await Promise.all([
    cloudinary.uploader.add_tag(`theme:${args.theme}`, [args.publicId]),
    cloudinary.uploader.add_tag(`cat:${args.categorie}`, [args.publicId]),
    cloudinary.uploader.explicit(args.publicId, {
      type: 'upload',
      context: { caption: args.title, alt: args.description },
    }),
  ]);

  return {
    publicId: args.publicId,
    title: args.title,
    description: args.description,
    theme: args.theme as Theme,
    categorie: args.categorie as Categorie,
    thumb: url(args.publicId, 'c_fit,w_600,h_750,q_auto,f_auto'),
    full: url(args.publicId, 'c_fit,w_1200,h_1500,q_auto,f_auto'),
    createdAt: '',
    pinned: false,
  };
}

export async function deleteOeuvre(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
