import { useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import MusicList from "../music/MusicList";
import EmptyState from "./EmptyState";

const ChatContainer = ({ messages, isLoading }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
    >
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        messages.map((message) => (
          <div key={message.id} className="space-y-4">
            <ChatBubble message={message} isUser={message.isUser} />
            {message.songs && <MusicList songs={message.songs} mood={message.mood} />}
          </div>
        ))
      )}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-bubble-bot text-bubble-bot-foreground rounded-2xl px-4 py-3 border border-border">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
