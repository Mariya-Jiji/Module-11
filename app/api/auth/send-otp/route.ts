import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOTPVerificationEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    // 2. Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Upsert into VerificationToken (replacing any existing unused OTPs for this email)
    // We use a transaction to safely clear old tokens for this email first
    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier: email } }),
      prisma.verificationToken.create({
        data: {
          identifier: email,
          token: otp,
          expires,
        },
      }),
    ]);

    // 4. Send the OTP via email
    // We do not await this to avoid blocking the response, but we could if we wanted strict error handling
    sendOTPVerificationEmail(email, otp).catch(console.error);

    return NextResponse.json({ success: true, message: 'OTP sent to email.' }, { status: 200 });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}
