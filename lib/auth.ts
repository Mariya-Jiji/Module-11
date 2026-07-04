import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || 'development-secret-change-me',
  providers: [
    ...authConfig.providers,
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        bypassSecret: { type: 'hidden' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // Secret bypass for automatic login after email verification
        if (credentials.bypassSecret && credentials.bypassSecret === process.env.AUTH_SECRET) {
          if (!user.emailVerified) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }

        if (!credentials.password || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;
        
        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
});
