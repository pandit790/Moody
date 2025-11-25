import { useState } from "react";
import { Send } from "lucide-react";

const InputBar = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border/60 bg-card/80 p-4 backdrop-blur">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tell Moody how you're feeling..."
              disabled={isLoading}
              className="h-12 w-full rounded-2xl border border-border bg-secondary/60 px-4 pr-16 font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 hidden items-center text-[10px] uppercase tracking-widest text-muted-foreground sm:flex">
              Enter ↵
            </span>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary via-emerald-500 to-accent px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default InputBar;

