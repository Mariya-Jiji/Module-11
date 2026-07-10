import { cookies } from 'next/headers';

export async function auth() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/auth/me`, {
      headers: { Cookie: `auth_token=${token}` }
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return { user: data.user };
  } catch {
    return null;
  }
}
