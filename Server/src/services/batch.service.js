// src/services/batch.service.js
const geminiService = require("./gemini.service");
const youtubeService = require("./youtube.service");

async function createBatch({
  source,
  mood,
  message,
  language_preference,
  batchSize = 5,
}) {
  // ask Gemini for more results since many may be unavailable or fail
  const aiSongs = await geminiService.generateSongSuggestions({
    mood,
    message,
    language: language_preference,
    count: batchSize * 3, // extra attempts
  });

  const results = [];

  for (const suggestion of aiSongs) {
    if (results.length >= batchSize) break;

    const query = `${suggestion.title} ${suggestion.artist}`;
    const videoId = await youtubeService.searchYoutubeTrack(query);
    if (!videoId) continue;

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      const audio = await youtubeService.getYoutubeAudio(videoUrl);
      if (!audio || !audio.url) continue;

      results.push({
        ...suggestion,
        playable: true,
        youtube_video_id: videoId,
        youtube_audio_url: audio.url,
        youtube_title: audio.title,
        youtube_thumbnail: audio.thumbnail,
        duration: audio.duration,
      });
    } catch (err) {
      // failed to extract audio — skip and continue
      console.warn(
        "[batch.service] failed to resolve",
        videoUrl,
        err?.message || err
      );
      continue;
    }
  }

  return results;
}

module.exports = { createBatch };
