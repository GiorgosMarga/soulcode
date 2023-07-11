/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { inferAsyncReturnType } from "@trpc/server";

export const createContext = (opts: CreateNextContextOptions) => {
  return {
    test: "test",
    res: opts.res,
    req: opts.req,
  };
};
type Context = inferAsyncReturnType<typeof createContext>;

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { env } from "~/env.mjs";
import { prisma } from "../db";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
interface UserJWT {
  email: string;
  id: string;
  username: string;
  role: "ADMIN" | "USER";
}

export const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx?.req?.cookies?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  const token = ctx.req.cookies.user;
  let user: UserJWT;
  try {
    user = jwt.verify(token, env.JWT_SECRET) as UserJWT;
  } catch (err) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  const realUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!realUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      user: {
        email: realUser.email,
        id: realUser.id,
        role: realUser.role,
        username: realUser.username,
        avatar: realUser.avatar,
      },
    },
  });
});
export const protectedProcedure = t.procedure.use(isAuthed);
