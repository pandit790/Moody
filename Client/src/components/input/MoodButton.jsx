const MoodButton = ({ mood, onClick, disabled }) => {
  if (!mood) return null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50",
        mood.gradient,
      ].join(" ")}
    >
      <span className="text-xl">{mood.emoji}</span>
      <span>{mood.label}</span>
    </button>
  );
};

export default MoodButton;

