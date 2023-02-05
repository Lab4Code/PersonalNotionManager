import NextAuth, {type NextAuthOptions} from "next-auth";

import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {prisma} from "../../../server/db/client";
import {env} from "../../../env/server.mjs";
import GitHubProvider from "next-auth/providers/github";
import Notion from "./providers/notion";
import Twitch from "next-auth/providers/twitch";

export const authOptions: NextAuthOptions = {
    callbacks: {
        session({session, user}) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        Twitch({
            clientId: env.TWITCH_CLIENT_ID,
            clientSecret: env.TWITCH_CLIENT_SECRET,
        }),
        Notion({
            clientId: env.NOTION_CLIENT_ID,
            clientSecret: env.NOTION_CLIENT_SECRET,
            redirectUri: "http://localhost:3000/api/auth/callback/notion"
        })
    ],
};

export default NextAuth(authOptions);
