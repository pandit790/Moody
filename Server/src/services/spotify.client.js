// src/services/spotify.client.js
const axios = require("axios");
const NodeCache = require("node-cache");
const qs = require("querystring");

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_TOKEN_URL,
  SPOTIFY_SEARCH_BASE,
  SPOTIFY_MARKET,
  SPOTIFY_CACHE_TTL,
} = require("../config/env");

const tokenCache = new NodeCache({ stdTTL: Number(SPOTIFY_CACHE_TTL || 3600) });

function basicAuthHeader() {
  const id = SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID;
  const secret = SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Spotify credentials missing in env");
  const b64 = Buffer.from(`${id}:${secret}`).toString("base64");
  return `Basic ${b64}`;
}

async function requestToken() {
  const cached = tokenCache.get("spotify_access_token");
  if (cached) return cached;

  const headers = {
    Authorization: basicAuthHeader(),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = qs.stringify({ grant_type: "client_credentials" });

  const res = await axios.post(
    SPOTIFY_TOKEN_URL || "https://accounts.spotify.com/api/token",
    data,
    { headers, timeout: 10000 }
  );
  const payload = res.data;
  if (!payload || !payload.access_token)
    throw new Error("Failed getting Spotify token");
  tokenCache.set(
    "spotify_access_token",
    payload.access_token,
    (payload.expires_in || 3600) - 30
  );
  return payload.access_token;
}

/**
 * Search spotify for a track by title and optional artist.
 * Returns the top result track object or null.
 */
async function searchTrack({
  title,
  artist,
  limit = 1,
  market = SPOTIFY_MARKET || "IN",
}) {
  const token = await requestToken();
  const q = artist ? `${title} ${artist}` : title;
  const url = `${SPOTIFY_SEARCH_BASE || "https://api.spotify.com/v1"}/search`;
  const params = new URLSearchParams({
    q,
    type: "track",
    limit: String(limit),
    market,
  });

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const res = await axios.get(`${url}?${params.toString()}`, {
      headers,
      timeout: 8000,
    });
    const items = res.data?.tracks?.items || [];
    if (!items.length) return null;
    // prefer results that have preview_url
    const withPreview = items.filter((it) => it.preview_url);
    const pick = withPreview.length ? withPreview[0] : items[0];
    // Normalize minimal metadata
    return {
      id: pick.id,
      title: pick.name,
      artists: (pick.artists || []).map((a) => a.name).join(", "),
      album: pick.album?.name || null,
      album_art: pick.album?.images?.[0]?.url || null,
      preview_url: pick.preview_url || null,
      spotify_url: pick.external_urls?.spotify || null,
      duration_ms: pick.duration_ms || null,
      raw: pick,
    };
  } catch (err) {
    // bubble up helpful error
    const msg = err?.response
      ? `Spotify ${err.response.status} ${err.response.statusText}`
      : err.message;
    const e = new Error(`Spotify search failed: ${msg}`);
    e.cause = err;
    throw e;
  }
}

module.exports = { searchTrack, requestToken };
