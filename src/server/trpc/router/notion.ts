import { protectedProcedure, publicProcedure, router } from "../trpc";
import { env } from "../../../env/server.mjs";
import { Client } from "@notionhq/client";
import { loginTwitch, queryGame } from "../../common/igdb";
import {
  changeDayName,
  getDatabasesByName,
  getDiaryEntries,
  getGameEntries,
  updateCover,
  updateFranchise,
  updateGenre,
  updateReleaseDate,
} from "../../common/notion";
import { z } from "zod";

export const notionRouter = router({
  login: publicProcedure.query(async ({ ctx, input }) => {
    console.log("query starting");
    const notion = new Client({
      auth: env.NOTION_SECURITY_KEY,
    });
    const databaseId = env.NOTION_DIARY_DB_ID;
    const cursor = undefined;
    const response = await getDiaryEntries(notion, databaseId, cursor);
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
  handleGames: publicProcedure.query(async ({ ctx, input }) => {
    const notion = new Client({
      auth: env.NOTION_SECURITY_KEY,
    });
    const databaseId = env.NOTION_GAMES_DB_ID;
    const { access_token } = await loginTwitch();
    const data = await getGameEntries(notion, databaseId, undefined);
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const gameData = await queryGame(item, {
        access_token: access_token,
        client_id: env.TWITCH_CLIENT_ID,
      });
      console.log(
        i,
        "of",
        data.length - 1,
        gameData.name,
        gameData.name === undefined
          ? item.properties.Title.title[0].plain_text
          : ""
      );
      if (!gameData.name) {
        continue;
      }
      if (!item.cover?.external?.url) {
        await updateCover(notion, item.id, gameData);
      }
      if (!item.properties.Release_Date?.date && gameData?.first_release_date) {
        await updateReleaseDate(notion, item.id, gameData);
      }
      if (gameData?.genre) {
        await updateGenre(notion, item.id, gameData);
      }
      if (gameData?.franchise) {
        await updateFranchise(notion, item.id, gameData);
      }
    }
  }),
  searchDatabases: publicProcedure
    .input(z.object({ databaseName: z.string() }))
    .query(({ ctx, input }) => {
      const notion = new Client({
        auth: env.NOTION_SECURITY_KEY,
      });
      return getDatabasesByName(notion, input.databaseName);
    }),
});
