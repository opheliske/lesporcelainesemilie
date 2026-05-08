import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import AdminApp from '@/components/AdminApp';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session')?.value;
  const loggedIn = session ? await isValidSession(session) : false;
  return <AdminApp initiallyLoggedIn={loggedIn} />;
}
