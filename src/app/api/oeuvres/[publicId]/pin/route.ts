import { NextRequest, NextResponse } from 'next/server';
import { setPinned } from '@/lib/cloudinary';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const { pinned } = await req.json();
  await setPinned(decodeURIComponent(publicId), Boolean(pinned));
  return NextResponse.json({ ok: true });
}
