import { mergeRouters, router } from "./trpc.ts";
import { userRouter } from "./routers/userRouter.ts";
import { likeRouter } from "./routers/likeRouter.ts";
import { postRouter } from "./routers/postRouter.ts";
import { commentRouter } from "./routers/commentRouter.ts";
import { uploadRouter } from "./routers/uploadRouter.ts";

export const appRouter = mergeRouters(
  router({
    post: postRouter,
    comment: commentRouter,
    like: likeRouter,
    user: userRouter,
    upload: uploadRouter,
  })
);


export type AppRouter = typeof appRouter;
