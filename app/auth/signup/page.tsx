'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOTP(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setLoading(false);
      setError(data.error || 'Failed to send verification code.');
      return;
    }

    setLoading(false);
    setStep(2); // Move to OTP verification step
  }

  async function handleVerifyAndSignup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setLoading(false);
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || 'Invalid verification code.');
      return;
    }

    // Automatically log the user in and bounce to dashboard!
    await signIn('credentials', {
      email: form.email,
      password: form.password,
      callbackUrl: '/dashboard',
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-4 py-16 text-white sm:px-6">
      <Card 
        title={step === 1 ? "Create account" : "Verify your email"} 
        description={step === 1 ? "Join the workspace with a secure email-based account." : `We sent a 6-digit code to ${form.email}`} 
        className="w-full max-w-md"
      >
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending code...' : 'Continue'}
            </Button>
            
            <p className="mt-6 text-center text-sm text-[#A1A1AA]">
              Already have an account?{' '}
              <a className="font-medium text-white underline" href="/auth/signin">
                Sign in
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndSignup} className="space-y-4">
            <Input 
              label="6-Digit Code" 
              type="text" 
              value={form.otp} 
              onChange={(e) => setForm({ ...form, otp: e.target.value })} 
              placeholder="123456"
              maxLength={6}
              required 
            />
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </Button>
            
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 w-full text-center text-sm text-[#A1A1AA] hover:text-white"
            >
              Back to details
            </button>
          </form>
        )}
      </Card>
    </main>
  );
}
