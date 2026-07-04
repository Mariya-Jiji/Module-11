import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken, hashToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({ success: true, message: 'If an account exists, a reset email has been sent.' });
    }

    const rawToken = generateVerificationToken();
    const hashedToken = hashToken(rawToken);
    const identifier = `reset:${email}`;
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier } }),
      prisma.verificationToken.create({
        data: {
          identifier,
          token: hashedToken,
          expires,
        },
      }),
    ]);

    await sendPasswordResetEmail(email, rawToken);

    return NextResponse.json({ success: true, message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to send password reset email.' }, { status: 500 });
  }
}
