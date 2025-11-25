export const MOOD_OPTIONS = [
  { label: "Happy", emoji: "😊", gradient: "bg-gradient-happy" },
  { label: "Sad", emoji: "😢", gradient: "bg-gradient-sad" },
  { label: "Energetic", emoji: "⚡", gradient: "bg-gradient-energetic" },
  { label: "Relaxed", emoji: "😌", gradient: "bg-gradient-relaxed" },
  { label: "Focused", emoji: "🎯", gradient: "bg-gradient-focused" },
  { label: "Romantic", emoji: "💕", gradient: "bg-gradient-romantic" },
  { label: "Angry", emoji: "😡", gradient: "bg-gradient-angry" },
];

const EMOJI_MAP = MOOD_OPTIONS.reduce((acc, mood) => {
  acc[mood.label] = mood.emoji;
  return acc;
}, {});

export const getMoodEmoji = (mood) => {
  if (!mood) return "🎵";
  return EMOJI_MAP[mood] ?? "🎵";
};

