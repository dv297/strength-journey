import { router, idTokenProtectedProcedure } from "../trpc";
import { z } from "zod";

export const workoutRouter = router({
  all: idTokenProtectedProcedure.query(({ ctx }) => {
    console.log(ctx.idToken);
    return ctx.prisma.post.findMany();
  }),
});
