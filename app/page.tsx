import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { auth } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth();
  
  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0C] text-white selection:bg-violet-500/30">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1C1C1F] bg-[#0B0B0C]/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo Placeholder */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 font-bold shadow-lg shadow-violet-900/20">
              S
            </div>
            <span className="text-lg font-semibold tracking-tight">The AI Signal</span>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard" className="text-sm font-medium text-[#A1A1AA] transition-colors hover:text-white">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="text-sm font-medium text-[#A1A1AA] transition-colors hover:text-white">
                  Login
                </Link>
                <Link href="/auth/signup" className="text-sm font-medium text-[#A1A1AA] transition-colors hover:text-white">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area / Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Badge */}
          <div className="mx-auto inline-flex items-center rounded-full border border-[#1C1C1F] bg-[#111113] px-3 py-1 text-sm text-[#A1A1AA]">
            <span className="flex h-2 w-2 rounded-full bg-violet-500 mr-2 animate-pulse"></span>
            Version 1.0 is now live
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Amplify your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">
              artificial intelligence
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-xl text-lg text-[#A1A1AA] sm:text-xl">
            The minimal, high-performance workspace to save, bookmark, and manage all of your critical AI prompts and tools.
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="h-14 rounded-full px-8 text-base font-semibold shadow-none transition-colors">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="h-14 rounded-full px-8 text-base font-semibold shadow-none transition-colors">
                View dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Soft UI Glow Effect Behind Text */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
           <div className="h-[40rem] w-[40rem] rounded-full bg-violet-600/10 blur-[128px]"></div>
        </div>
      </main>
    </div>
  );
}
