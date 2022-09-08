// src/server/router/index.ts
import {createRouter} from "./context";
import superjson from "superjson";

import {instapaperRouter} from "./instapaper";
import {protectedExampleRouter} from "./protected-example-router";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("instapaper.", instapaperRouter)
    .merge("auth.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
