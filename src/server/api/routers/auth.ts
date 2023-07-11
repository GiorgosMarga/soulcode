import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { comparePassword, hash } from "~/utils/hashPassword";
import jwt from "jsonwebtoken";
import { env } from "~/env.mjs";

const DAYS = 7;
export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        username: z.string().min(3).max(20),
      })
    )
    .mutation(async ({ input: { email, password, username }, ctx }) => {
      const userExists = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (userExists) {
        throw new TRPCError({
          message: "Email already in use",
          code: "BAD_REQUEST",
        });
      }
      const hashedPassword = hash(password);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });
      if (!newUser) {
        throw new TRPCError({
          message: "DB ERROR",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      const token = jwt.sign(
        {
          id: newUser.id,
          user: newUser.username,
          email: newUser.email,
        },
        env.JWT_SECRET
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + DAYS);
      ctx.res.setHeader(
        "Set-Cookie",
        `user=${token}; expires=${expiresAt.toUTCString()} GMT; path=/;`
      );
      return newUser;
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input: { email, password }, ctx }) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user || !comparePassword(password, user.password)) {
        throw new TRPCError({
          message: "Invalid credentials. Try again",
          code: "NOT_FOUND",
        });
      }
      const token = jwt.sign(
        {
          id: user.id,
          user: user.username,
          email: user.email,
        },
        env.JWT_SECRET
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + DAYS);
      console.log("res:", ctx);
      ctx.res.setHeader(
        "Set-Cookie",
        `user=${token}; expires=${expiresAt.toUTCString()}; path=/;`
      );
      return {
        user,
      };
    }),
  logout: protectedProcedure.mutation(({ ctx }) => {
    ctx.res.setHeader(
      "Set-Cookie",
      `user=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`
    );
    return;
  }),
  sendOTP: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;
    const otp = Math.floor(Math.random() * 10000);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getHours() + 2);
    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          otp: otp.toString(),
          otpDuration: expiresAt,
        },
      });
    } catch (error) {
      throw new TRPCError({
        message: "DB ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return {
      message: "Success",
    };
  }),
  verifyAccount: protectedProcedure
    .input(z.object({ otp: z.string().min(4).max(4) }))
    .mutation(async ({ ctx, input: { otp } }) => {
      const id = ctx.user.id;
      const user = await prisma.user.findFirst({
        where: {
          id,
        },
      });
      if (!user) {
        throw new TRPCError({ message: "Not found", code: "NOT_FOUND" });
      }
      if (
        user.isVerified ||
        otp !== user?.otp ||
        user.otpDuration < new Date(Date.now())
      ) {
        throw new TRPCError({
          message: "Error try again.",
          code: "BAD_REQUEST",
        });
      }
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          otp: "",
          isVerified: true,
          otpDuration: "",
        },
      });
      return {
        message: "Success",
      };
    }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      const user = await prisma.user.findFirst({
        where: {
          id,
        },
        select: {
          // add more here
          username: true,
          email: true,
        },
      });
      if (!user) {
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
      }
      return {
        user,
      };
    }),
  deleteUser: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      if (id === ctx.user.id || ctx.user.role === "ADMIN") {
        const user = await prisma.user.delete({
          where: {
            id,
          },
        });
        if (!user) {
          throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
        }
        return {
          user,
        };
      }
      throw new TRPCError({ message: "Unauthorized", code: "UNAUTHORIZED" });
    }),
  whoIs: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
