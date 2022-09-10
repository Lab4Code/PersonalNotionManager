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
                console.log(instapaper.token)
                const userId = ctx.session?.user?.id;
                const tokenKey = instapaper.token?.key
                const tokenSecret = instapaper.token?.secret
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
                    })
                }
                const bookmarks = await instapaper.listArchivedBookmarks();
                return bookmarks
            } catch (e) {
                throw new trpc.TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Login Failed.',
                    cause: e,
                })
            }
        },
    });
