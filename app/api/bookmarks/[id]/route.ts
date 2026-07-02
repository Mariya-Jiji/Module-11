import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Verify the bookmark belongs to the user before deleting
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: params.id },
    });

    if (!bookmark || bookmark.userId !== session.user.id) {
      return NextResponse.json({ error: 'Bookmark not found or unauthorized.' }, { status: 404 });
    }

    await prisma.bookmark.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[BOOKMARKS_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete bookmark.' }, { status: 500 });
  }
}
