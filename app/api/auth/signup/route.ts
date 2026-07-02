import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, name, otp } = await request.json();

    if (!email || !password || !otp) {
      return NextResponse.json({ error: 'Email, password, and OTP are required.' }, { status: 400 });
    }

    // 1. Validate OTP
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token: otp } },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or incorrect OTP.' }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({ where: { token: otp } });
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // 2. Ensure user doesn't already exist
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    // 3. Create User with verified email
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email,
        password: hashedPassword,
        emailVerified: new Date(), // Pre-verified!
      },
    });

    // 4. Clean up token
    await prisma.verificationToken.delete({ where: { token: otp } });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
  }
}
