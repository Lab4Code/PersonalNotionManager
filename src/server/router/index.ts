// src/server/router/index.ts
import {createRouter} from "./context";
import superjson from "superjson";

import {exampleRouter} from "./example";
import {instapaperRouter} from "./instapaper";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("example.", exampleRouter)
    .merge("instapaper.", instapaperRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
