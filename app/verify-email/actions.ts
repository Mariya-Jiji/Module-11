'use server';

import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';
import { signIn } from '@/lib/auth';

export async function verifyEmailAction(token: string, email: string) {
  try {
    const identifier = `verify:${email}`;
    const hashedToken = hashToken(token);

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier, token: hashedToken } },
    });

    if (!verificationToken) {
      return { error: 'Invalid verification link. It may have already been used.' };
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      });
      return { error: 'This verification link has expired. Please request a new one.' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      }),
    ]);
  } catch (error) {
    console.error('Verification error:', error);
    return { error: 'An unexpected error occurred during verification.' };
  }

  // Sign in and redirect (this throws a redirect error which Next.js handles)
  await signIn('credentials', {
    email,
    bypassSecret: process.env.AUTH_SECRET,
    redirectTo: '/',
  });
}
