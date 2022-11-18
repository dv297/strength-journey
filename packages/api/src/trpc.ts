import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";
import superjson from "superjson";
import { initializeApp, getApps, cert, deleteApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { App } from "firebase-admin/app";

const serviceAccount = require("../../../strength-journey-firebase-admin-sdk.json");
let app: App | null;

const checkFirebaseInitialization = () => {
  console.log("Checking firebase");
  console.log(getApps());

  const tempApp = getApps().length === 1 ? getApps()[0] : undefined;
  if (tempApp) {
    deleteApp(tempApp);
  }

  if (getApps().length === 0) {
    console.log("Initializing");
    try {
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (err) {
      console.log("ERROR HIT");
      console.log(err);
    }
  }
};

checkFirebaseInitialization();

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
  checkFirebaseInitialization();
  const idToken = ctx.idToken;
  if (!idToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated - Missing id-token header",
    });
  }

  try {
    if (!app) {
      throw new Error("Firebase app has not been initialized by backend");
    }

    await getAuth(app).verifyIdToken(idToken);

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
