import api from "@/services/api";

export const getRecommendations = async (mood) => {
  const { data } = await api.get("/api/music/mood", {
    params: { mood },
  });

  const songs = data?.songs || [];

  return songs.map((song) => ({
    id: song.youtube_video_id,
    title: song.title,
    artist: song.artist,
    thumbnail: song.youtube_thumbnail,
    previewUrl: song.youtube_audio_url, // 🎧 Direct playable URL
    duration: song.duration,
    reason: song.reason,
  }));
};
