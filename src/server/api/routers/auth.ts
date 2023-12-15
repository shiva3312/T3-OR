import { z } from "zod";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type User } from "@prisma/client";

export const authRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // check if user exist with username
        const existingUser = await ctx.db.user.findFirst({
          where: { username: input.username },
        });

        if (existingUser !== null) {
          console.log("User Exist");
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "User already exists. Try with a different username.",
            cause: "User already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const newUser: User = await ctx.db.user.create({
          data: {
            username: input.username,
            password: hashedPassword,
          },
        });

        if (newUser) {
          return {
            data: {
              userId: newUser.id,
              username: newUser.username,
              userRole: newUser.role,
            },
          };
        }
      } catch (error: any) {
        if (error instanceof TRPCError)
          return {
            error: {
              code: error.code ?? "INTERNAL_SERVER_ERROR",
              message: error.message ?? "Internal Server Error",
              cause: error.cause ?? "Unknown Cause",
            },
          };
      }
    }),
});
