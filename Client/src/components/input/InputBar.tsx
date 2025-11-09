import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const InputBar = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How are you feeling today?"
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-2xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InputBar;
