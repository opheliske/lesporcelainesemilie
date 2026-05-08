import 'server-only';

const enc = new TextEncoder();
const SECRET = process.env.SESSION_SECRET || '';

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Buffer.from(new Uint8Array(sig)).toString('base64url');
}

export async function createSession(): Promise<string> {
  const payload = JSON.stringify({ ok: true, ts: Date.now() });
  const data = Buffer.from(payload).toString('base64url');
  const sig = await hmac(data);
  return `${data}.${sig}`;
}

export async function isValidSession(token: string): Promise<boolean> {
  if (!SECRET) return false;
  const [data, sig] = token.split('.');
  if (!data || !sig) return false;
  const expected = await hmac(data);
  return sig === expected;
}
