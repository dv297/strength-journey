import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { workoutRouter } from "./workout";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  workout: workoutRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
