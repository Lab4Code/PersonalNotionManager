import { z } from "zod";

import { publicProcedure, protectedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import Instapaper from "../../api_external/instapaper";

export const instapaperRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        remember: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instapaper = new Instapaper(input.username, input.password);
      try {
        await instapaper.authorize();
        console.log(instapaper.token);
        const userId = ctx.session?.user?.id;
        const tokenKey = instapaper.token?.key;
        const tokenSecret = instapaper.token?.secret;
        if (userId && tokenKey && tokenSecret) {
          ctx.prisma.instapaperAccount.upsert({
            where: {
              user_id: userId,
            },
            update: {
              key: tokenKey,
              secret: tokenSecret,
            },
            create: {
              key: tokenKey,
              secret: tokenSecret,
              user_id: userId,
            },
          });
        }
        const bookmarks = await instapaper.listArchivedBookmarks();
        return bookmarks;
      } catch (e) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Login Failed.",
          cause: e,
        });
      }
    }),
});
