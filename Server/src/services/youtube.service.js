// src/services/youtube.service.js
const { spawn } = require("child_process");
const yts = require("yt-search");
const axios = require("axios");
const NodeCache = require("node-cache");
const pLimit = require("p-limit").default;

const cache = new NodeCache({ stdTTL: 60 * 5 }); // 5 min cache
const CONCURRENCY = 3;
const limiter = pLimit(CONCURRENCY); // ✔ Works

/**
 * Search Youtube for a query and return the first videoId (or null)
 */
async function searchYoutubeTrack(query) {
  const key = `search:${query.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const r = await yts(query);
    const first = r?.videos && r.videos.length > 0 ? r.videos[0] : null;
    if (!first) return null;
    cache.set(key, first.videoId);
    return first.videoId;
  } catch (err) {
    console.error("[youtube.service] search error:", err?.message || err);
    return null;
  }
}

/**
 * Use yt-dlp to fetch JSON metadata including audio URL.
 * Returns object { url, title, duration, thumbnail, ext, abr } or null
 * Runs under concurrency limiter to avoid spamming the server.
 */
async function getYoutubeAudio(videoUrl) {
  // limiter avoids spawning too many yt-dlp at once
  return limiter(() => _getYoutubeAudio(videoUrl));
}

function _getYoutubeAudio(videoUrl) {
  return new Promise((resolve, reject) => {
    try {
      // cached by videoUrl
      const key = `audio:${videoUrl}`;
      const cached = cache.get(key);
      if (cached) return resolve(cached);

      // spawn yt-dlp --dump-json -f bestaudio
      const args = [
        "-f",
        "bestaudio",
        "--no-playlist",
        "--dump-json",
        videoUrl,
      ];
      const runner = spawn("yt-dlp", args, { windowsHide: true });

      let out = "";
      let errOut = "";

      runner.stdout.on("data", (c) => (out += c.toString()));
      runner.stderr.on("data", (c) => (errOut += c.toString()));

      runner.on("close", (code) => {
        if (code !== 0) {
          console.error("[youtube.service] yt-dlp stderr:", errOut);
          return reject(
            new Error("yt-dlp failed: " + (errOut || "exit " + code))
          );
        }
        try {
          const json = JSON.parse(out);
          // Try common fields to get a direct audio URL
          const url =
            json.url ||
            (json.requested_formats &&
              json.requested_formats[0] &&
              json.requested_formats[0].url) ||
            (json.formats &&
              json.formats.find((f) => f.height === null && f.abr)?.url) ||
            (json.formats && json.formats[0] && json.formats[0].url) ||
            null;

          const result = {
            url,
            title: json.title || null,
            duration: json.duration || null,
            thumbnail: json.thumbnail || null,
            ext: json.ext || null,
            abr:
              json.abr ||
              (json.requested_formats &&
                json.requested_formats[0] &&
                json.requested_formats[0].abr) ||
              null,
          };

          cache.set(key, result, 60 * 5); // cache 5 minutes
          return resolve(result);
        } catch (err) {
          console.error("[youtube.service] parse error:", err, "raw:", out);
          return reject(err);
        }
      });
    } catch (err) {
      return reject(err);
    }
  });
}

/**
 * Optionally, stream proxied audio to the client (via axios streaming).
 * We first fetch the direct audio URL with getYoutubeAudio() then stream it.
 */
async function proxyAudioStream(res, audioUrl) {
  // stream audio to response
  const resp = await axios.get(audioUrl, {
    responseType: "stream",
    timeout: 30000,
  });
  // set headers (some audio types)
  if (resp.headers["content-type"])
    res.setHeader("Content-Type", resp.headers["content-type"]);
  if (resp.headers["content-length"])
    res.setHeader("Content-Length", resp.headers["content-length"]);
  // forward caching headers? skip for now
  resp.data.pipe(res);
}

module.exports = {
  searchYoutubeTrack,
  getYoutubeAudio,
  proxyAudioStream,
};
