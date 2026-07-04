'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      setLoading(false);
      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Failed to send reset email.');
      return;
    }

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-4 py-16 text-white sm:px-6">
        <Card title="Check your email" description="If an account exists, a reset link was sent." className="w-full max-w-md text-center">
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <MailCheck className="h-16 w-16 text-violet-500" />
            <Button asChild className="w-full mt-4">
              <Link href="/auth/signin">Return to Sign In</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-4 py-16 text-white sm:px-6">
      <Card title="Forgot Password" description="Enter your email to receive a password reset link." className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </Button>
          
          <div className="mt-4 text-center">
            <Link href="/auth/signin" className="text-sm text-[#A1A1AA] hover:text-white transition-colors">
              Back to Sign In
            </Link>
          </div>
        </form>
      </Card>
    </main>
  );
}
