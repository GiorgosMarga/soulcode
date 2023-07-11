import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const codeRouter = createTRPCRouter({
  createCode: protectedProcedure
    .input(
      z.object({
        content: z.string().max(5000),
        language: z.string(),
      })
    )
    .mutation(async ({ input: { content, language }, ctx }) => {
      try {
        const code = await prisma.code.create({
          data: {
            content,
            language,
            userId: ctx.user.id,
          },
        });
        return {
          code,
        };
      } catch (error) {
        throw new TRPCError({
          message: "DB ERROR",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getCodes: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
      })
    )
    .query(async ({ input: { skip, take }, ctx }) => {
      try {
        const codes = await prisma.code.findMany({
          skip,
          take,
          where: {
            NOT: {
              user: {
                id: ctx.user.id,
              },
            },
          },
          include: {
            user: true,
          },
        });

        return {
          codes,
        };
      } catch (error) {
        throw new TRPCError({
          message: "DB ERROR",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getUserCodes: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.user.id;
    try {
      const codes = await prisma.code.findMany({
        where: {
          userId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return codes;
    } catch (err) {
      throw new TRPCError({
        message: "DB ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  deleteCode: protectedProcedure
    .input(z.object({ codeId: z.string().cuid() }))
    .mutation(async ({ input: { codeId }, ctx }) => {
      try {
        const post = await prisma.code.deleteMany({
          where: {
            id: codeId,
            userId: ctx.user.id,
          },
        });
        return { post };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB ERROR",
        });
      }
    }),
});
