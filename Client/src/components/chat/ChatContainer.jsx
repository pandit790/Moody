import { useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import MusicList from "../music/MusicList";
import EmptyState from "./EmptyState";
import Loader from "../Loader";

const ChatContainer = ({ messages, isLoading, onPlayTrack, currentTrack }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="h-full w-full">
      <div
        ref={containerRef}
        className="mx-auto flex max-w-4xl flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <ChatBubble message={message} isUser={message.isUser} />
              {message.songs && (
                <MusicList
                  songs={message.songs}
                  mood={message.mood}
                  currentTrackId={currentTrack?.id}
                  onPlayTrack={onPlayTrack}
                />
              )}
            </div>
          ))
        )}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default ChatContainer;
