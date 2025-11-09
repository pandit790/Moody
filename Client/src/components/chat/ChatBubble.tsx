import { cn } from "@/lib/utils";

const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 animate-fade-in",
          isUser
            ? "bg-bubble-user text-bubble-user-foreground ml-auto"
            : "bg-bubble-bot text-bubble-bot-foreground mr-auto border border-border"
        )}
      >
        {message.emoji && (
          <div className="text-2xl mb-2">{message.emoji}</div>
        )}
        <p className="text-sm leading-relaxed">{message.text}</p>
        {message.mood && (
          <div className="mt-2 inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
            Mood: {message.mood}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
