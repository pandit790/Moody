import MusicCard from "./MusicCard";

const gradients = {
  Happy: "from-yellow-500/20 to-orange-500/20",
  Sad: "from-blue-500/20 to-purple-500/20",
  Energetic: "from-red-500/20 to-pink-500/20",
  Relaxed: "from-green-500/20 to-teal-500/20",
  Focused: "from-blue-400/20 to-blue-600/20",
  Romantic: "from-pink-500/20 to-purple-500/20",
  Angry: "from-red-600/20 to-amber-500/20",
};

const MusicList = ({ songs, mood, onPlayTrack, currentTrackId }) => {
  if (!songs?.length) return null;

  const moodGradient = gradients[mood ?? ""] || "from-primary/20 to-accent/20";

  return (
    <div className={`animate-fade-in rounded-3xl border border-border/40 bg-gradient-to-br ${moodGradient} p-4`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Fresh picks</p>
          <h3 className="text-lg font-semibold">Mood-tailored vibes</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <MusicCard key={song.id} song={song} onPlayTrack={onPlayTrack} isActive={song.id === currentTrackId} />
        ))}
      </div>
    </div>
  );
};

export default MusicList;
