import { cn } from "@/lib/utils";

const MoodButton = ({ mood, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        mood.gradient,
        "text-white font-medium shadow-lg hover:shadow-xl"
      )}
    >
      <span className="text-xl">{mood.emoji}</span>
      <span className="text-sm">{mood.label}</span>
    </button>
  );
};

export default MoodButton;
