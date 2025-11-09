import MoodButton from "./MoodButton";

const MOODS = [
  { label: "Happy", emoji: "😊", gradient: "bg-gradient-happy" },
  { label: "Sad", emoji: "😢", gradient: "bg-gradient-sad" },
  { label: "Energetic", emoji: "⚡", gradient: "bg-gradient-energetic" },
  { label: "Relaxed", emoji: "😌", gradient: "bg-gradient-relaxed" },
  { label: "Focused", emoji: "🎯", gradient: "bg-gradient-focused" },
  { label: "Romantic", emoji: "💕", gradient: "bg-gradient-romantic" },
];

const MoodButtons = ({ onMoodSelect, isLoading }) => {
  return (
    <div className="border-t border-border bg-card px-4 py-3">
      <div className="container mx-auto max-w-4xl">
        <p className="text-xs text-muted-foreground mb-3">Quick mood select:</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {MOODS.map((mood) => (
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
