import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const t = initTRPC.create();

export const appRouter = t.router({
  getUsers: t.procedure.query(async () => {
    return await prisma.user.findMany();
  }),

  createUser: t.procedure
  .input(z.object({ name: z.string(), email: z.string().email() }))
  .mutation(async ({ input }) => {
    try {
      return await prisma.user.create({ data: input });
    } catch (err) {
      console.error('Prisma Error:', err);
      throw err;
    }
  }),
});

export type AppRouter = typeof appRouter;
