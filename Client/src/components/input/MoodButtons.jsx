import MoodButton from "./MoodButton";
import { MOOD_OPTIONS } from "@/utils/mood";

const MoodButtons = ({ onMoodSelect, isLoading }) => {
  return (
    <div className="border-t border-border/60 bg-card/80 px-4 py-3 backdrop-blur">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <p>Quick mood select</p>
          <p>Mood → Music in one tap</p>
        </div>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          {MOOD_OPTIONS.map((mood) => (
            <MoodButton
              key={mood.label}
              mood={mood}
              onClick={() => onMoodSelect(mood.label)}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodButtons;
