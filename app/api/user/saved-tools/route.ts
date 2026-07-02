import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { badRequest, internalError, unauthorized } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const savedTools = await prisma.savedTools.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ savedTools });
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
    const { toolId, name, category } = body ?? {};

    if (!toolId || !name) return badRequest('toolId and name are required.');

    const savedTool = await prisma.savedTools.create({
      data: {
        toolId,
        name,
        category,
        user: { connect: { email: session.user.email } },
      },
    });

    return NextResponse.json({ savedTool }, { status: 201 });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}
