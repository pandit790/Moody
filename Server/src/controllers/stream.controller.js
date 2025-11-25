// src/controllers/stream.controller.js
const youtubeService = require("../services/youtube.service");
const { error } = require("../utils/apiResponse");

async function streamYoutubeAudio(req, res) {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return error(res, "videoId is required", 400);
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const audio = await youtubeService.getYoutubeAudio(videoUrl);

    if (!audio || !audio.url) {
      return error(res, "Audio not found", 404);
    }

    // Stream audio to client
    return youtubeService.proxyAudioStream(res, audio.url);
  } catch (err) {
    console.error("[stream.controller] error:", err);
    return error(res, "Failed to stream audio", 500, err.message);
  }
}

module.exports = { streamYoutubeAudio };
