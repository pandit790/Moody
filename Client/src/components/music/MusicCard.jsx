import { Play } from "lucide-react";

const MusicCard = ({ song, onPlayTrack, isActive }) => {
  return (
    <div
      className={`group rounded-2xl border p-3 transition-all ${
        isActive
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-border hover:border-primary/60"
      } bg-card/80 backdrop-blur`}
    >
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="h-40 w-full rounded-xl object-cover"
        />

        {song.previewUrl && (
          <button
            type="button"
            onClick={() => onPlayTrack(song)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40"
          >
            <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold shadow-lg text-white">
              <Play className="h-4 w-4" />
              Preview
            </span>
          </button>
        )}
      </div>

      <h4 className="text-sm font-semibold text-foreground">{song.title}</h4>
      <p className="text-xs text-muted-foreground">{song.artist}</p>
    </div>
  );
};

export default MusicCard;
