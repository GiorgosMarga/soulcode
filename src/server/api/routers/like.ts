import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const likeRouter = createTRPCRouter({
  likeCode: protectedProcedure.input(z.object({codeId: z.string().cuid()})).mutation(async ({input: {codeId},ctx}) => {
    try {
      const like = await prisma.like.create({
        data: {
          userId: ctx.user.id,
          codeId,
        },
      });
      return { like };
    } catch (error) {
      throw new TRPCError({
        message: "DB ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  })
  
});
