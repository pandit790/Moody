// src/services/youtube.service.js
const yts = require("yt-search");
const NodeCache = require("node-cache");
const pLimit = require("p-limit").default;
const ytdlp = require("yt-dlp-exec"); // ✔ pure Node version (no Python)
const axios = require("axios");

const cache = new NodeCache({ stdTTL: 60 * 5 });
const CONCURRENCY = 3;
const limiter = pLimit(CONCURRENCY);

/**
 * Search Youtube for a query and return first videoId
 */
async function searchYoutubeTrack(query) {
  const key = `search:${query.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const r = await yts(query);
    const first = r?.videos?.[0] ?? null;
    if (!first) return null;

    cache.set(key, first.videoId);
    return first.videoId;
  } catch (err) {
    console.error("[youtube.service] search error:", err.message);
    return null;
  }
}

/**
 * Safely extract audio using yt-dlp-exec
 */
async function getYoutubeAudio(videoUrl) {
  return limiter(async () => {
    try {
      const key = `audio:${videoUrl}`;
      const cached = cache.get(key);
      if (cached) return cached;

      // fetch direct stream metadata, no conversion
      const json = await ytdlp(videoUrl, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        format: "bestaudio"
      });

      // Find the best direct audio URL
      const format =
        json?.requested_formats?.find((f) => f.acodec !== "none") ||
        json?.formats?.find((f) => f.acodec !== "none");

      const url = format?.url;

      const result = {
        url,
        title: json.title,
        duration: json.duration,
        thumbnail: json.thumbnail,
        ext: format?.ext,
        abr: format?.abr,
      };

      cache.set(key, result, 60 * 5);
      return result;
    } catch (error) {
      console.error("[youtube.service] yt-dlp-exec error:", error);
      return null;
    }
  });
}

/**
 * Proxy streaming through server
 */
async function proxyAudioStream(res, audioUrl) {
  try {
    const response = await axios.get(audioUrl, {
      responseType: "stream",
      timeout: 30000,
    });

    if (response.headers["content-type"])
      res.setHeader("Content-Type", response.headers["content-type"]);
    if (response.headers["content-length"])
      res.setHeader("Content-Length", response.headers["content-length"]);

    response.data.pipe(res);
  } catch (err) {
    console.error("[youtube.service] proxy stream failed:", err.message);
    res.status(500).json({ error: "Proxy stream failed" });
  }
}

module.exports = {
  searchYoutubeTrack,
  getYoutubeAudio,
  proxyAudioStream,
};
