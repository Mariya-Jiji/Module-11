import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, entity, entityId, metadata } = body;

    if (!action || !entity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const history = await prisma.history.create({
      data: {
        userId: session.user.id,
        action,
        entity,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json(history, { status: 201 });
  } catch (error) {
    console.error('[HISTORY_POST]', error);
    return NextResponse.json({ error: 'Failed to record history' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = await prisma.history.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('[HISTORY_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
