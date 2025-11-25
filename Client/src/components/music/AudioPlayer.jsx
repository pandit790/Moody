import { useEffect, useRef, useState } from "react";
import { Pause, Play, X, SkipForward } from "lucide-react";

const AudioPlayer = ({ track, onClear, onNext }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!track?.previewUrl) {
      cleanup();
      return;
    }

    const audio = new Audio(track.previewUrl);
    audioRef.current = audio;
    setError(false);

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const end = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onNext) onNext();
    };

    const fail = () => {
      setError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", end);
    audio.addEventListener("error", fail);

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setError(true));

    return () => {
      cleanup();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", end);
      audio.removeEventListener("error", fail);
    };
  }, [track]);

  const cleanup = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const clearPlayer = () => {
    cleanup();
    onClear();
  };

  if (!track) return null;

  return (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-50 w-[92%] max-w-2xl -translate-x-1/2 rounded-3xl border border-border/60 bg-card/85 p-4 backdrop-blur-2xl shadow-2xl">
      <div className="flex items-center gap-4">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="h-16 w-16 rounded-2xl object-cover shadow-lg"
        />

        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{track.title}</p>
          <p className="text-xs text-muted-foreground">{track.artist}</p>

          {error ? (
            <p className="text-xs text-red-500 mt-1">Failed to load audio.</p>
          ) : (
            <div className="mt-2 h-1.5 w-full rounded-full bg-border/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlayback}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/70"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={clearPlayer}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
