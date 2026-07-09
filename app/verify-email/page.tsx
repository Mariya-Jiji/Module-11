'use client';

import { useEffect, useState, useRef } from 'react';
import { verifyEmailAction } from './actions';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const initialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!token || !email) {
      if (isReady) {
        setStatus('error');
        setMessage('Missing or invalid verification link.');
      }
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    verifyEmailAction(token, email)
      .then((res) => {
         if (res?.error) {
            setStatus('error');
            setMessage(res.error);
         } else if (res?.success) {
            window.location.href = '/';
         }
      })
      .catch((error) => {
         if (error?.message?.includes('NEXT_REDIRECT') || error?.digest?.startsWith('NEXT_REDIRECT')) {
           throw error;
         }
         setStatus('error');
         setMessage('An unexpected error occurred.');
      });
  }, [token, email, isReady]);

  return (
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
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16 text-white sm:px-6">
      <Suspense fallback={<Card title="Loading..." description="Please wait" className="w-full max-w-md text-center" />}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
