import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string; email?: string };
}) {
  const { token, email } = searchParams;

  if (!token || !email) {
    return <VerificationResult success={false} message="Missing or invalid verification link." />;
  }

  try {
    const identifier = `verify:${email}`;
    
    // Hash incoming token to match with DB storage
    const hashedToken = hashToken(token);

    // Look up the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token: hashedToken,
        },
      },
    });

    if (!verificationToken) {
      return <VerificationResult success={false} message="Invalid verification link. It may have already been used." />;
    }

    if (new Date() > verificationToken.expires) {
      // Token is expired, delete it
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      });
      return <VerificationResult success={false} message="This verification link has expired. Please request a new one." />;
    }

    // Token is valid and not expired! Update the user.
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      }),
    ]);

    return <VerificationResult success={true} message="Your email has been verified! You can now sign in." />;
  } catch (error) {
    console.error('Verification error:', error);
    return <VerificationResult success={false} message="An unexpected error occurred during verification." />;
  }
}

function VerificationResult({ success, message }: { success: boolean; message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-4 py-16 text-white sm:px-6">
      <Card 
        title={success ? "Email Verified" : "Verification Failed"}
        description={message}
        className="w-full max-w-md text-center"
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {success ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
          
          <Link href="/auth/signin" className="w-full mt-4 block">
            <Button className="w-full">Return to Sign In</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
