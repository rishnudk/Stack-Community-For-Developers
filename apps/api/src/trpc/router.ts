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

// Admin procedure helper - requires admin role
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
  });

  if (!user || (user as any).role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }

  return next({ ctx });
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

  getPosts: protectedProcedure
    .input(z.object({
      authorId: z.string().optional(),
      search: z.string().optional(),
      tagId: z.string().optional(),
      skip: z.number().min(0).default(0),
      take: z.number().min(1).max(50).default(10),
    }).optional())
    .query(async ({ ctx, input = {} }) => {
      const where: any = {};
      
      // If no authorId specified, show all posts (for feed view)
      // Otherwise filter by authorId
      if (input.authorId) {
        where.authorId = input.authorId;
      }

      // Search by title
      if (input.search) {
        where.title = {
          contains: input.search,
          mode: 'insensitive',
        };
      }

      // Filter by tag
      if (input.tagId) {
        where.tags = {
          some: {
            tagId: input.tagId,
          },
        };
      }

      return await ctx.prisma.post.findMany({
        where,
        skip: input.skip,
        take: input.take,
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
          postLikes: {
            select: {
              userId: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
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
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
          ...(input.email !== undefined && { email: input.email }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
    }),

  // Comments CRUD
  createComment: protectedProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string().min(1, 'Comment cannot be empty'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify post exists
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
        include: { author: true },
      });

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          authorId: ctx.session.user.id,
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

      // Create notification for post author (if not commenting on own post)
      if (post.authorId !== ctx.session.user.id) {
        await ctx.prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'comment',
            message: `${ctx.session.user.name || 'Someone'} commented on your post`,
            postId: input.postId,
          },
        });
      }

      return comment;
    }),

  getComments: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.comment.findMany({
        where: { postId: input.postId },
        orderBy: { createdAt: 'asc' },
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

  editComment: protectedProcedure
    .input(z.object({
      id: z.string(),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
      }

      return await ctx.prisma.comment.update({
        where: { id: input.id },
        data: { content: input.content },
      });
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
      }

      return await ctx.prisma.comment.delete({
        where: { id: input.id },
      });
    }),

  // Post Likes
  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (existingLike) {
        // Unlike
        await ctx.prisma.postLike.delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      } else {
        // Like
        const post = await ctx.prisma.post.findUnique({
          where: { id: input.postId },
          include: { author: true },
        });

        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
        }

        await ctx.prisma.postLike.create({
          data: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        });

        // Create notification for post author (if not liking own post)
        if (post.authorId !== ctx.session.user.id) {
          await ctx.prisma.notification.create({
            data: {
              userId: post.authorId,
              type: 'like',
              message: `${ctx.session.user.name || 'Someone'} liked your post`,
              postId: input.postId,
            },
          });
        }

        return { liked: true };
      }
    }),

  // Tags
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  }),

  createTag: adminProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.tag.create({
        data: { name: input.name },
      });
    }),

  addTagsToPost: protectedProcedure
    .input(z.object({
      postId: z.string(),
      tagIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify user owns the post
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.postId,
          authorId: ctx.session.user.id,
        },
      });

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
      }

      // Remove existing tags
      await ctx.prisma.postTag.deleteMany({
        where: { postId: input.postId },
      });

      // Add new tags
      await ctx.prisma.postTag.createMany({
        data: input.tagIds.map(tagId => ({
          postId: input.postId,
          tagId,
        })),
        skipDuplicates: true,
      });

      return { success: true };
    }),

  // Notifications
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.notification.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }),

  markNotificationRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.update({
        where: { id: input.id },
        data: { read: true },
      });
    }),

  markAllNotificationsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
        read: false,
      },
      data: { read: true },
    });
    return { success: true };
  }),

  // Admin procedures
  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
  }),

  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(['user', 'admin']),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role } as any,
      });
    }),

  adminDeletePost: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.delete({
        where: { id: input.id },
      });
    }),

  adminDeleteComment: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.delete({
        where: { id: input.id },
      });
    }),
});

export type AppRouter = typeof appRouter;
