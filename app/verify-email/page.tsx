'use client';

import { useEffect, useState, useRef } from 'react';
import { verifyEmailAction } from './actions';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string; email?: string };
}) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    if (!searchParams.token || !searchParams.email) {
      setStatus('error');
      setMessage('Missing or invalid verification link.');
      return;
    }

    verifyEmailAction(searchParams.token, searchParams.email)
      .then((res) => {
         if (res?.error) {
            setStatus('error');
            setMessage(res.error);
         }
      })
      .catch(() => {
         setStatus('error');
         setMessage('An unexpected error occurred.');
      });
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16 text-white sm:px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card 
          title={status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email Verified' : 'Verification Failed'}
          description={message}
          className="w-full max-w-md text-center"
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            {status === 'loading' && <Loader2 className="h-16 w-16 text-white animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-16 w-16 text-green-500" />}
            {status === 'error' && <XCircle className="h-16 w-16 text-red-500" />}
            
            {status === 'error' && (
              <Link href="/auth/signin" className="w-full mt-4 block">
                <Button className="w-full">Return to Sign In</Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
