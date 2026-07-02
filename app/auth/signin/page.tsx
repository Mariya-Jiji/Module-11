'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSignIn(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password.');
    } else {
      window.location.href = '/dashboard';
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-4 py-16 text-white sm:px-6">
      <Card title="Welcome back" description="Log in to manage your workspace and saved tools." className="w-full max-w-md">
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Continue with email'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1C1C1F]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#111113] px-2 text-xs text-[#A1A1AA]">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="secondary" className="w-full" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            Google
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => signIn('github', { callbackUrl: '/dashboard' })}>
            GitHub
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-[#A1A1AA]">
          Don’t have an account?{' '}
          <a className="font-medium text-white underline" href="/auth/signup">
            Create one
          </a>
        </p>
      </Card>
    </main>
  );
}
