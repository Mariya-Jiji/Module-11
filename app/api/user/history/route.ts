import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { internalError, unauthorized } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const history = await prisma.history.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const body = await request.json();
    const { action, entity, entityId, metadata } = body ?? {};

    if (!action || !entity) return NextResponse.json({ error: 'Action and entity are required.' }, { status: 400 });

    const record = await prisma.history.create({
      data: {
        action,
        entity,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        user: { connect: { email: session.user.email } },
      },
    });

    return NextResponse.json({ history: record }, { status: 201 });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}
