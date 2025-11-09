import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatContainer from "@/components/chat/ChatContainer";
import InputBar from "@/components/input/InputBar";
import MoodButtons from "@/components/input/MoodButtons";
import { detectMood, getMockSongs, getMoodEmoji } from "@/utils/mockData";
import { toast } from "sonner";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const detectedMood = detectMood(text);
      const songs = getMockSongs(detectedMood);
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: `I sense you're feeling ${detectedMood.toLowerCase()}! Here are some perfect tracks for your mood:`,
        isUser: false,
        mood: detectedMood,
        emoji: getMoodEmoji(detectedMood),
        songs,
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      toast.success(`Mood detected: ${detectedMood}`);
    }, 1000);
  };

  const handleMoodSelect = (mood) => {
    handleSendMessage(`I'm feeling ${mood.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Navbar />
      <ChatContainer messages={messages} isLoading={isLoading} />
      <MoodButtons onMoodSelect={handleMoodSelect} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Index;
