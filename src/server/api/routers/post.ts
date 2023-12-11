import { type Post } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 10000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedAdminProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the post exists
      const existingPost: Post | null = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      // Check if the user has permission to delete the post (adjust this based on your authorization logic)
      if (existingPost.createdById !== ctx.session.user.id) {
        throw new Error("Permission denied");
      }

      // Perform the delete operation
      const deletedPost = await ctx.db.post.delete({
        where: { id: input.postId },
      });

      return deletedPost;
    }),
  
  
  updatePost : protectedProcedure
  .input(
    z.object({
      postId: z.string().cuid(),
      name: z.string().min(1),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Check if the post exists
    const existingPost: Post | null= await ctx.db.post.findUnique({
      where: { id: input.postId },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Check if the user has permission to update the post (adjust this based on your authorization logic)
    if (existingPost.createdById !== ctx.session.user.id) {
      throw new Error('Permission denied');
    }

    // Perform the update operation
    const updatedPost = await ctx.db.post.update({
      where: { id: input.postId },
      data: {
        name: input.name,
      },
    });

    return updatedPost;
  }),
});
