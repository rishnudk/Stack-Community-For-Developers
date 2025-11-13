import z from "zod";
import { protectedProcedure, router } from "../trpc.ts";

export const commentRouter = router({
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
