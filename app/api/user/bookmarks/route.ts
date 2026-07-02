import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { badRequest, internalError, unauthorized } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const bookmarks = await prisma.bookmark.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookmarks });
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
    const { title, url, note } = body ?? {};

    if (!title || !url) return badRequest('Title and url are required.');

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        url,
        note,
        user: { connect: { email: session.user.email } },
      },
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}
