import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();
    const { url, title } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    // 3. Store the bookmark in the database
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title: title || undefined, // Title is optional
        userId: session.user.id,
      },
    });

    // 4. Return the created bookmark
    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('[BOOKMARKS_POST]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the bookmark.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // 2. Fetch bookmarks for the specific user
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc', // Return newest bookmarks first
      },
    });

    // 3. Return the array of bookmarks
    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error('[BOOKMARKS_GET]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching bookmarks.' },
      { status: 500 }
    );
  }
}
