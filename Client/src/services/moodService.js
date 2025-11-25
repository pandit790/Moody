import api from "@/services/api";

export const detectMood = async (message) => {
  const { data } = await api.post("/api/music/ai", { message });
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
