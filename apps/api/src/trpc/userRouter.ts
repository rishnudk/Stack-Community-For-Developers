import { z } from "zod";
import { initTRPC } from "@trpc/server";
import type { Context } from "../context.ts";

const t = initTRPC.context<Context>().create();

export const userRouter = t.router({
  getSidebarInfo: t.procedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const id = input.userId ?? ctx.session?.user?.id;
      if (!id) return null;

      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
            email: true,
            image: true,
            
        },
      });

      const profileViews = await ctx.prisma.view.count({ where: { userId: id } });
      const postImpressions = await ctx.prisma.impression.count({ where: { userId: id } });

      return { user, profileViews, postImpressions };
    }),
});
