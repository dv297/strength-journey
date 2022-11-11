import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";
import superjson from "superjson";
import firebaseAdmin from "firebase-admin";

const serviceAccount = require("../../../strength-journey-firebase-admin-sdk.json");

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp(
    {
      credential: firebaseAdmin.credential.cert(serviceAccount),
    },
    "strength-journey-backend"
  );
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

const hasIdToken = t.middleware(async ({ ctx, next }) => {
  const idToken = ctx.idToken;
  if (!idToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated - Missing id-token header",
    });
  }

  try {
    await firebaseAdmin.auth().verifyIdToken(idToken);

    return next({
      ctx: {
        session: ctx.session,
      },
    });
  } catch (err) {
    console.error("Could not authenticate request");
    console.error(err);
    throw err;
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const idTokenProtectedProcedure = t.procedure.use(hasIdToken);
