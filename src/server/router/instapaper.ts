import {createRouter} from "./context";
import {z} from "zod";

import Instpaper from "../helpers/instapaper";
import * as trpc from '@trpc/server';


export const instapaperRouter = createRouter()
    .mutation("login", {
        input: z.object({
            username: z.string(),
            password: z.string(),
        }),
        async resolve({ctx, input}) {
            const instapaper = new Instpaper(input.username, input.password)
            try {
                await instapaper.authorize();
                return await instapaper.listArchivedBookmarks();
            } catch (e) {
                throw new trpc.TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Login Failed.',
                    cause: e,
                })
            }
        },
    });
