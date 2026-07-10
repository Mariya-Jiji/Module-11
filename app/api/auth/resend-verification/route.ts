import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken, hashToken } from '@/lib/tokens';
import { sendVerificationLinkEmail } from '@/lib/mailer';
import { rateLimit, getIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getIp(request);
    const { success, retryAfter } = rateLimit(`resend-verification:${ip}`, 3, 60000); 

    if (!success) {
      return NextResponse.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, { status: 429 });
    }

    let { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    email = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { 
        email: { equals: email, mode: 'insensitive' }
      }
    });
    
    if (!user) {
      // For security reasons, don't reveal if user exists or not
      return NextResponse.json({ success: true, message: 'If an account exists, a verification email has been sent.' });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified.' }, { status: 400 });
    }

    const rawToken = generateVerificationToken();
    const hashedToken = hashToken(rawToken);
    const identifier = `verify:${email}`;
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

    await sendVerificationLinkEmail(email, rawToken);

    return NextResponse.json({ success: true, message: 'Verification email resent.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Failed to resend verification email.' }, { status: 500 });
  }
}
