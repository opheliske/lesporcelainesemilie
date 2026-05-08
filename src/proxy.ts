import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from './lib/auth';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth =
    pathname.startsWith('/admin') ||
    (pathname.startsWith('/api/oeuvres') && req.method !== 'GET');

  if (!needsAuth) return NextResponse.next();

  const session = req.cookies.get('admin-session')?.value;
  const ok = session ? await isValidSession(session) : false;

  if (!ok) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/oeuvres/:path*'],
};
