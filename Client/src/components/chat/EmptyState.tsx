import { Sparkles } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="rounded-full bg-gradient-to-r from-primary to-accent p-4 mb-4">
        <Sparkles className="h-12 w-12 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to Moody!</h2>
      <p className="text-muted-foreground max-w-md">
        Tell me how you're feeling, or pick a mood below. I'll recommend the perfect music for your vibe! 🎵
      </p>
    </div>
  );
};

export default EmptyState;
