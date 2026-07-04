import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken, hashToken } from '@/lib/tokens';
import { sendVerificationLinkEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already in use.' }, { status: 409 });
    }

    // 2. Hash password and create user with emailVerified = null
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email,
        password: hashedPassword,
        emailVerified: null, // explicit null
      },
    });

    // 3. Generate raw token, hash it, and store it
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

    // 4. Send email with raw token
    await sendVerificationLinkEmail(email, rawToken);

    return NextResponse.json(
      { success: true, message: 'Verification email sent.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
  }
}
