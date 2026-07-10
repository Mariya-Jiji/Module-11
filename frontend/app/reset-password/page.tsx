'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [isReady, setIsReady] = useState(false);

  // Wait for hydration of query params
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!token || !email) {
    if (!isReady) {
      return (
        <Card title="Loading..." description="Please wait" className="w-full max-w-md text-center" />
      );
    }
    return (
      <Card title="Invalid Link" description="Missing token or email parameter." className="w-full max-w-md text-center">
        <Button onClick={() => router.push('/auth/signin')} className="w-full mt-4">Go to Sign In</Button>
      </Card>
    );
  }

  async function handleReset(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/auth/reset-password`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword: password }),
    });

    if (!response.ok) {
      setLoading(false);
      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Failed to reset password.');
      return;
    }

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <Card title="Password Reset Successful" description="Your password has been successfully updated." className="w-full max-w-md text-center">
        <Button onClick={() => router.push('/auth/signin')} className="w-full mt-4">Go to Sign In</Button>
      </Card>
    );
  }

  return (
    <Card 
      title="Reset Password" 
      description={`Enter a new password for ${email}`} 
      className="w-full max-w-md"
    >
      <form onSubmit={handleReset} className="space-y-4">
        <Input 
          label="New Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          minLength={6}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-4 py-16 text-white sm:px-6">
      <Suspense fallback={<Card title="Loading..." description="Please wait" className="w-full max-w-md" />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
