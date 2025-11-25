// src/services/spotify.service.js
const axios = require("axios");
const qs = require("qs");

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;

  return cachedToken;
}

async function searchTrack(query) {
  const token = await getAccessToken();

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=track&limit=1`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const items = response.data?.tracks?.items;
    if (!items || items.length === 0) return null;

    const track = items[0]; // best match

    return {
      id: track.id,
      name: track.name,
      preview_url: track.preview_url,
      artists: track.artists.map((a) => a.name),
      album: track.album.name,
      albumArt: track.album.images?.[0]?.url || null,
      spotify_url: track.external_urls.spotify,
    };
  } catch (err) {
    console.error("[spotify.service] searchTrack error:", err.response?.data);
    return null;
  }
}

module.exports = {
  searchTrack,
};
