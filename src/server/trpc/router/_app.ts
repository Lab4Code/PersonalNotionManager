import {router} from "../trpc";
import {authRouter} from "./auth";
import {instapaperRouter} from "./instapaper";
import {notionRouter} from "./notion";

export const appRouter = router({
    instapaper: instapaperRouter,
    notion: notionRouter,
    auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
