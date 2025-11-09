import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicCard = ({ song }) => {
  return (
    <div className="bg-card rounded-xl p-3 border border-border hover:border-primary/50 transition-all transform hover:scale-105 group">
      <div className="relative mb-3">
        <img
          src={song.albumArt}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
          <Button
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-all bg-primary hover:bg-primary/90 rounded-full"
          >
            <Play className="h-5 w-5 fill-current" />
          </Button>
        </div>
      </div>
      <h4 className="font-semibold text-sm truncate mb-1">{song.title}</h4>
      <p className="text-xs text-muted-foreground truncate mb-2">{song.artist}</p>
      {song.previewUrl && (
        <a
          href={song.previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          Listen on Spotify
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};

export default MusicCard;
