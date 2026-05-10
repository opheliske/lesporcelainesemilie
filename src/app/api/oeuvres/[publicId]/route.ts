import { NextRequest, NextResponse } from 'next/server';
import { deleteOeuvre, updateOeuvre, invalidateOeuvresCache } from '@/lib/cloudinary';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const formData = await req.formData();
  const title = String(formData.get('title') || '').trim();
  const theme = String(formData.get('theme') || '');
  const categorie = String(formData.get('categorie') || '');
  const description = String(formData.get('description') || '');

  if (!title || !theme || !categorie) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const file = formData.get('file');
  const buffer =
    file instanceof File && file.size > 0
      ? Buffer.from(await file.arrayBuffer())
      : undefined;

  const oeuvre = await updateOeuvre({
    publicId: decodeURIComponent(publicId),
    title,
    theme,
    categorie,
    description,
    buffer,
  });
  invalidateOeuvresCache();

  return NextResponse.json(oeuvre);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  await deleteOeuvre(decodeURIComponent(publicId));
  invalidateOeuvresCache();
  return NextResponse.json({ ok: true });
}
