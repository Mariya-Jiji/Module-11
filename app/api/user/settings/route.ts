import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { internalError, unauthorized } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const settings = await prisma.settings.findUnique({
      where: { userId: (await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } }))?.id || '' },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const body = await request.json();
    const { theme, language, notifications, compactMode } = body ?? {};

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) return unauthorized();

    const settings = await prisma.settings.upsert({
      where: { userId: user.id },
      update: {
        theme: typeof theme === 'string' ? theme : undefined,
        language: typeof language === 'string' ? language : undefined,
        notifications: typeof notifications === 'boolean' ? notifications : undefined,
        compactMode: typeof compactMode === 'boolean' ? compactMode : undefined,
      },
      create: {
        userId: user.id,
        theme: typeof theme === 'string' ? theme : 'dark',
        language: typeof language === 'string' ? language : 'en',
        notifications: typeof notifications === 'boolean' ? notifications : true,
        compactMode: typeof compactMode === 'boolean' ? compactMode : false,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}
