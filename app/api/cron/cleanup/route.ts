import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // In a real production environment, you should protect this route
    // by checking an authorization header (e.g. comparing it to a CRON_SECRET in your .env)
    // For example:
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const deleted = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(), // Less than now = expired
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${deleted.count} expired verification tokens.` 
    });
  } catch (error) {
    console.error('Cleanup cron error:', error);
    return NextResponse.json({ error: 'Failed to run cleanup.' }, { status: 500 });
  }
}
