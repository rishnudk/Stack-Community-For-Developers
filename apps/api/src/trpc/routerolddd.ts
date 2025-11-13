import { initTRPC, TRPCError } from "@trpc/server";
import { router, publicProcedure, mergeRouters } from "./trpc.ts";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { Context } from "../context.ts";
import { userRouter } from "./routers/userRouter.ts";

const prisma = new PrismaClient();

// ✅ create one tRPC instance shared across routers
const t = initTRPC.context<Context>().create();


// ✅ Protected procedure (for authenticated routes)
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session, // Now session is guaranteed
    },
  });
});

// ✅ Main app router
export const baseRouter  = t.router({
  // ---------------- USERS ----------------
  getUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        return await prisma.user.create({ data: input });
      } catch (err) {
        console.error("Prisma Error:", err);
        throw err;
      }
    }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  // ---------------- POSTS ----------------
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
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
      where: { authorId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true, image: true } },
      },
    });
  }),

  getPost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: { id: input.id, authorId: ctx.session.user.id },
        include: {
          author: { select: { id: true, name: true, email: true, image: true } },
        },
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      return post;
    }),

  editPost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: { id: input.id, authorId: ctx.session.user.id },
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      return await ctx.prisma.post.update({
        where: { id: input.id },
        data: { title: input.title, content: input.content },
      });
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: { id: input.id, authorId: ctx.session.user.id },
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      return await ctx.prisma.post.delete({ where: { id: input.id } });
    }),

  // ---------------- PROFILE ----------------
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
        },
        select: { id: true, name: true, email: true, image: true },
      });
    }),
})
  // ✅ attach subrouters here (without semicolon!)
 export const appRouter = mergeRouters(baseRouter, t.router({ user: userRouter }));

export type AppRouter = typeof appRouter;
