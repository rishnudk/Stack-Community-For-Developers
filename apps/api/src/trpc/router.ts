import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import type { Context } from '../context.ts';

const prisma = new PrismaClient();
const t = initTRPC.context<Context>().create();

// Protected procedure helper - requires authentication
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session, // Now TypeScript knows session is not null
    },
  });
});

export const appRouter = t.router({
  getUsers: t.procedure.query(async ({ ctx}) => {
    return await ctx.prisma.user.findMany();
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

  getCurrentUser: protectedProcedure.query(async ({ ctx}) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }),

  // Posts CRUD
  createPost: protectedProcedure
    .input(z.object({ 
      title: z.string().min(1, 'Title is required'),
      content: z.string().min(1, 'Content is required'),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.session.user.id,
        },
      });
    }),

  getPosts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }),

  getPost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id, // Ensure user owns the post
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
      }

      return post;
    }),

  editPost: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1, 'Title is required'),
      content: z.string().min(1, 'Content is required'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify user owns the post
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
      }

      return await ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user owns the post
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
      }

      return await ctx.prisma.post.delete({
        where: { id: input.id },
      });
    }),

  // User profile update
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      image: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
