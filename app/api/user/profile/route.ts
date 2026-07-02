import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { badRequest, internalError, notFound, unauthorized } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return unauthorized();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return notFound('User not found');
    return NextResponse.json({ user });
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
    const { name, image } = body ?? {};

    if (typeof name !== 'string' || typeof image !== 'string') {
      return badRequest('Name and image must be strings.');
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, image },
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return internalError();
  }
}
