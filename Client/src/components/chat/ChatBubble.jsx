import { cn } from "@/lib/utils";

const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] animate-fade-in rounded-2xl border px-4 py-3 shadow-lg shadow-black/20",
          isUser
            ? "ml-auto border-primary/40 bg-bubble-user text-bubble-user-foreground"
            : "mr-auto border-border bg-bubble-bot text-bubble-bot-foreground"
        )}
      >
        {message.emoji && <div className="mb-2 text-2xl">{message.emoji}</div>}
        <p className="text-sm leading-relaxed">{message.text}</p>
        {message.mood && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/20 px-3 py-1 font-semibold text-primary">
              {message.mood}
            </span>
            {typeof message.confidence === "number" && (
              <span className="text-[10px] uppercase tracking-widest">
                {(message.confidence * 100).toFixed(0)}% match
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
