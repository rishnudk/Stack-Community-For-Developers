import { initTRPC } from "@trpc/server";
import type { Context } from "../context.ts";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) throw new Error("Unauthorized");
  return next({ ctx: { ...ctx, session: ctx.session } });
});

export const mergeRouters = t.mergeRouters;
