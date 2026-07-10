export async function signOut({ callbackUrl = '/auth/signin' } = {}) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } finally {
    window.location.href = callbackUrl;
  }
}
