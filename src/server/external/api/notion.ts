import { Client } from "@notionhq/client";
import { env } from "../../../env/server.mjs";

const getDatabaseEntries: any = async (
  notion: Client,
  databaseId: string,
  cursor: string
) => {
  const data = [];
  const result = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
    ],
    page_size: 100,
    start_cursor: cursor,
  });
  data.push(...result.results);
  if (result.has_more && result.next_cursor) {
    const temp = await getDatabaseEntries(
      notion,
      databaseId,
      result.next_cursor
    );
    if (temp.length > 0) {
      data.push(...temp);
    }
  }
  return data;
};
const changeDayName: any = async (
  notion: Client,
  pageId: string,
  name: string
) => {
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
              link: null,
            },
          },
        ],
      },
    },
  });
  return response;
};

const getGameEntries: any = async (
  notion: Client,
  databaseId: string,
  cursor: string
) => {
  const data = [];
  const result = await notion.databases.query({
    database_id: databaseId,
    page_size: 100,
    filter: {
      property: "Genre",
      relation: {
        is_empty: true,
      },
    },
    start_cursor: cursor,
  });
  data.push(...result.results);
  if (result.has_more && result.next_cursor) {
    const temp = await getGameEntries(notion, databaseId, result.next_cursor);
    if (temp.length > 0) {
      data.push(...temp);
    }
  }
  return data;
};

const updateCover: any = async (notion: Client, id: any, gameData: any) => {
  return await notion.pages.update({
    page_id: id,
    cover: {
      type: "external",
      external: {
        url: gameData.cover_obj.url,
      },
    },
  });
};
const updateReleaseDate: any = async (
  notion: Client,
  id: any,
  gameData: any
) => {
  return await notion.pages.update({
    page_id: id,
    properties: {
      "Release Date": {
        date: {
          start: new Date(gameData.first_release_date * 1000).toISOString(),
        },
      },
    },
  });
};
const updateGenre: any = async (notion: Client, pageId: any, gameData: any) => {
  let genres: any[] = [];
  for (let i = 0; i < gameData.genre.length; i++) {
    const notionGenres = await notion.databases.query({
      database_id: env.NOTION_GENRE_DB_ID,
      filter: {
        property: "Name",
        title: {
          equals: gameData.genre[i].name,
        },
      },
    });
    if (notionGenres.results.length > 0) {
      genres = genres.concat(notionGenres.results);
    } else {
      const genre = await notion.pages.create({
        parent: {
          database_id: env.NOTION_GENRE_DB_ID,
          type: "database_id",
        },
        icon: {
          type: "external",
          external: {
            url: "https://www.notion.so/icons/layers_blue.svg",
          },
        },
        properties: {
          Name: {
            title: [
              {
                type: "text",
                text: {
                  content: gameData.genre[i].name,
                },
              },
            ],
          },
        },
      });
      genres.push(genre);
    }
  }

  const genreIds: { id: any }[] = [];
  genres.forEach((genre) => {
    genreIds.push({
      id: genre.id,
    });
  });
  return await notion.pages.update({
    page_id: pageId,
    properties: {
      Genre: {
        relation: genreIds,
      },
    },
  });
};
const updateFranchise: any = async (
  notion: Client,
  pageId: any,
  gameData: any
) => {
  let franchises: any[] = [];
  for (let i = 0; i < gameData.franchise.length; i++) {
    const notionFranchises = await notion.databases.query({
      database_id: env.NOTION_FRANCHISE_DB_ID,
      filter: {
        property: "Name",
        title: {
          equals: gameData.franchise[i].name,
        },
      },
    });
    if (notionFranchises.results.length > 0) {
      franchises = franchises.concat(notionFranchises.results);
    } else {
      const franchise = await notion.pages.create({
        parent: {
          database_id: env.NOTION_FRANCHISE_DB_ID,
          type: "database_id",
        },
        icon: {
          type: "external",
          external: {
            url: "https://www.notion.so/icons/layers_blue.svg",
          },
        },
        properties: {
          Name: {
            title: [
              {
                type: "text",
                text: {
                  content: gameData.franchise[i].name,
                },
              },
            ],
          },
        },
      });
      franchises.push(franchise);
    }
  }

  const franchiseIds: { id: any }[] = [];
  franchises.forEach((genre) => {
    franchiseIds.push({
      id: genre.id,
    });
  });
  return await notion.pages.update({
    page_id: pageId,
    properties: {
      Franchises: {
        relation: franchiseIds,
      },
    },
  });
};

const getDatabasesByName = async (notion: Client, databaseName: string) => {
  const response = await notion.search({
    query: databaseName,
    filter: {
      value: "database",
      property: "object",
    },
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time",
    },
  });
  return response.results;
};

export {
  getDatabaseEntries,
  changeDayName,
  getGameEntries,
  updateCover,
  updateReleaseDate,
  updateGenre,
  updateFranchise,
  getDatabasesByName,
};
