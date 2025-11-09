import MusicCard from "./MusicCard";

const MusicList = ({ songs, mood }) => {
  if (!songs || songs.length === 0) return null;

  const moodGradient = {
    Happy: "from-yellow-500/20 to-orange-500/20",
    Sad: "from-blue-500/20 to-purple-500/20",
    Energetic: "from-red-500/20 to-pink-500/20",
    Relaxed: "from-green-500/20 to-teal-500/20",
    Focused: "from-blue-400/20 to-blue-600/20",
    Romantic: "from-pink-500/20 to-purple-500/20",
  }[mood] || "from-primary/20 to-accent/20";

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${moodGradient} p-4 border border-border/50 animate-fade-in`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        🎵 Recommended for you
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {songs.map((song) => (
          <MusicCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default MusicList;
