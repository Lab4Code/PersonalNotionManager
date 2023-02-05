import { env } from "../../../env/server.mjs";

const loginTwitch = async () => {
  const url = `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
  const res = await fetch(url, { method: "POST" });
  return await res.json();
};
const queryGame = async (
  item: any,
  req: { access_token: string; client_id: string }
) => {
  const url = `https://api.igdb.com/v4/games`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": req.client_id,
      Authorization: `Bearer ${req.access_token}`,
    },
    body: `fields cover, name, first_release_date, franchises, genres; where name = "${item.properties.Title.title[0].plain_text}";`,
  });
  let body = await res.json();
  if (body.length > 0) {
    body = body[0];
    if (body.cover && body.id) {
      body.cover_obj = await queryCover(body.id, req);
    }
    if (body.franchises && body.franchises.length > 0) {
      body.franchise = [];
      for (let i = 0; i < body.franchises.length; i++) {
        body.franchise.push(await queryFranchise(body.franchises[i], req));
      }
    }
    if (body.genres && body.genres.length > 0) {
      body.genre = [];
      for (let i = 0; i < body.genres.length; i++) {
        body.genre.push(await queryGenre(body.genres[i], req));
      }
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(body);
    }, 300);
  });
};

const queryCover = async (
  gameId: string,
  req: { access_token: string; client_id: string }
) => {
  const url = `https://api.igdb.com/v4/covers`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": req.client_id,
      Authorization: `Bearer ${req.access_token}`,
    },
    body: `fields url; where game = ${gameId};`,
  });
  let body = await res.json();
  if (body.length > 0) {
    body = body[0];
    body.url = body.url
      .replace("t_thumb", "t_cover_big")
      .replace("//", "https://");
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(body);
    }, 300);
  });
};
const queryFranchise = async (
  franchiseId: string,
  req: { access_token: string; client_id: string }
) => {
  const url = "https://api.igdb.com/v4/franchises";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": req.client_id,
      Authorization: `Bearer ${req.access_token}`,
    },
    body: `fields name; where id = ${franchiseId};`,
  });
  let body = await res.json();
  body = body[0];
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(body);
    }, 300);
  });
};

const queryGenre = async (
  genreId: string,
  req: { access_token: string; client_id: string }
) => {
  const url = "https://api.igdb.com/v4/genres";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": req.client_id,
      Authorization: `Bearer ${req.access_token}`,
    },
    body: `fields name; where id = ${genreId};`,
  });
  let body = await res.json();
  body = body[0];
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(body);
    }, 300);
  });
};

export { queryGame, loginTwitch };
