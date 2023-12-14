import { z } from "zod";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
          return { success: false, messgae: "User already exist." };
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const newUser = await ctx.db.user.create({
          data: {
            username: input.username,
            password: hashedPassword,
          },
        });

        if (newUser) {
          return {
            success: true,
            userId: newUser.id,
            username: newUser.username,
            userRole: newUser.role,
          };
        }
      } catch (error) {
        return { success: false, message: "Server Error while creating user." };
      }
    }),
});
