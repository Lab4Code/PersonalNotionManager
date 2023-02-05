import { createTRPCRouter } from "./trpc";
import { instapaperRouter } from "./routers/instapaper";
import { notionRouter } from "./routers/notion";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  instapaper: instapaperRouter,
  notion: notionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
