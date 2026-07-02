import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { badRequest, internalError, notFound, unauthorized } from '@/lib/api-utils';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const bookmark = await prisma.bookmark.findUnique({ where: { id: params.id } });
    if (!bookmark) return notFound('Bookmark not found');

    if (bookmark.userId !== (await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } }))?.id) {
      return unauthorized('You do not own this bookmark');
    }

    await prisma.bookmark.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}
