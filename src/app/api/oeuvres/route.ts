import { NextRequest, NextResponse } from 'next/server';
import { uploadOeuvre, getAllOeuvres } from '@/lib/cloudinary';

export async function GET() {
  const oeuvres = await getAllOeuvres();
  return NextResponse.json(oeuvres);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  const title = String(formData.get('title') || '').trim();
  const theme = String(formData.get('theme') || '');
  const categorie = String(formData.get('categorie') || '');
  const description = String(formData.get('description') || '');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
  }
  if (!title || !theme || !categorie) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const oeuvre = await uploadOeuvre({ buffer, title, theme, categorie, description });

  return NextResponse.json(oeuvre, { status: 201 });
}
