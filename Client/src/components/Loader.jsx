const Loader = () => (
  <div className="flex items-center gap-2 rounded-2xl border border-border bg-bubble-bot px-4 py-3 text-bubble-bot-foreground">
    {[0, 1, 2].map((dot) => (
      <span
        key={dot}
        className="h-2 w-2 animate-pulse rounded-full bg-primary"
        style={{ animationDelay: `${dot * 120}ms` }}
      />
    ))}
  </div>
);

export default Loader;

