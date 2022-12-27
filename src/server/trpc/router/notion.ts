import {z} from "zod";

import {router, publicProcedure, protectedProcedure} from "../trpc";
import {TRPCError} from "@trpc/server";
import {env} from "../../../env/server.mjs";
import {Client} from "@notionhq/client";

export const notionRouter = router({
    login: publicProcedure
        .query(async ({ctx, input}) => {
            console.log("query starting");
            const notion = new Client({
                auth: env.NOTION_SECURITY_KEY,
            })
            const databaseId = env.NOTION_DIARY_DB_ID;
            const cursor = undefined;
            const response = await getDatabaseEntries(notion, databaseId, cursor);
            let counter = 1;
            let yC = 0;
            for (let i = 0; i < response.length; i++) {
                const item = response[i];
                const date = new Date(item.properties.Date.date.start);
                const month = date.getUTCMonth() + 1; //months from 1-12
                const day = date.getUTCDate();
                let dayString = "Day ";
                if (yC > 0) {
                    dayString += yC + ".";
                }
                dayString += counter;
                if (item.properties.Name.title[0].plain_text != dayString) {
                    console.log(item.properties.Name.title[0].plain_text, dayString);
                    await changeDayName(notion, item.id, dayString);
                }
                if (day == 31 && month == 12) {
                    counter = 1;
                    yC++;
                } else {
                    counter++;
                }
            }
            return response;
        }),
});

const getDatabaseEntries: any = async (notion: Client, databaseId: string, cursor: string) => {
    const data = [];
    const result = await notion.databases.query({
        database_id: databaseId,
        sorts: [
            {
                property: 'Date',
                direction: 'ascending',
            },
        ],
        page_size: 100,
        start_cursor: cursor,
    });
    data.push(...result.results);
    if (result.has_more && result.next_cursor) {
        const temp = await getDatabaseEntries(notion, databaseId, result.next_cursor);
        if (temp.length > 0) {
            data.push(...temp);
        }
    }
    return data
}
const changeDayName: any = async (notion: Client, pageId: string, name: string) => {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            'Name': {
                title: [
                    {
                        "text": {
                            "content": name,
                            "link": null
                        },
                    }
                ],
            },
        },
    });
    return response;
}