import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const identifier = `reset:${email}`;
    const hashedToken = hashToken(token);

    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token: hashedToken,
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid reset token.' }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      });
      return NextResponse.json({ error: 'Reset token has expired.' }, { status: 400 });
    }

    // Token is valid! Update the password
    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { 
          password: newHashedPassword,
          emailVerified: new Date() // Resetting password proves email ownership
        },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      }),
    ]);

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
