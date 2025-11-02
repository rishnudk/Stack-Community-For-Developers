import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@api/trpc/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/server/db/client';
import type { Context } from '@api/context';

const handler = async (req: Request) => {
  // Get session from NextAuth
  const session = await getServerSession(authOptions);

  // Create context with NextAuth session
  const createContext = async (): Promise<Context> => {
    return {
      prisma,
      session: session
        ? {
            user: {
              id: session.user.id,
              email: session.user.email || null,
              name: session.user.name || null,
              image: session.user.image || null,
            },
          }
        : null,
    };
  };

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });
};

export { handler as GET, handler as POST };
