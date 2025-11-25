import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ChatContainer from "@/components/chat/ChatContainer";
import InputBar from "@/components/input/InputBar";
import MoodButtons from "@/components/input/MoodButtons";
import AudioPlayer from "@/components/music/AudioPlayer";
import { detectMood } from "@/services/moodService";
import { getRecommendations } from "@/services/musicService";
import { getMoodEmoji } from "@/utils/mood";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const moodMutation = useMutation({ mutationFn: detectMood });
  const musicMutation = useMutation({
    mutationFn: (mood) => getRecommendations(mood),
  });

  const queuePreviewCandidate = (tracks) => {
    setCurrentTrack((prev) => {
      if (prev) return prev;
      const next = tracks.find((song) => Boolean(song.previewUrl));
      return next ?? prev;
    });
  };

  const handleNextTrack = () => {
    if (!currentTrack) return;
    const lastMsg = messages[messages.length - 1];
    const tracks = lastMsg?.songs || [];
    const index = tracks.findIndex((s) => s.id === currentTrack.id);
    const next = tracks[index + 1];
    if (next?.previewUrl) setCurrentTrack(next);
  };

  const appendErrorMessage = () => {
    const botMessage = {
      id: crypto.randomUUID(),
      text: "I couldn't fetch recommendations just now, but I'm ready when you are!",
      isUser: false,
      emoji: "🤖",
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const respondWithMood = async (mood, confidence, introText) => {
    const tracks = await musicMutation.mutateAsync(mood);

    const botMessage = {
      id: crypto.randomUUID(),
      text:
        introText ??
        `I sense you're feeling ${mood.toLowerCase()} — here are some sounds to match your vibe.`,
      isUser: false,
      mood,
      emoji: getMoodEmoji(mood),
      confidence,
      songs: tracks,
    };

    queuePreviewCandidate(tracks);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: trimmed,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const tracks = await moodMutation.mutateAsync(trimmed);
      console.log("suggested audio:", tracks);
      // await respondWithMood(moodResult.mood, moodResult.confidence);
      // toast.success(`Mood detected: ${moodResult.mood}`);
      const botMessage = {
        id: crypto.randomUUID(),
        songs: tracks,
      };

      setMessages((prev) => [...prev, botMessage]);
      queuePreviewCandidate(tracks);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach Moody right now. Try again in a moment.");
      appendErrorMessage();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = async (mood) => {
    if (isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: `Let's explore ${mood.toLowerCase()} tunes.`,
      isUser: true,
      mood,
      emoji: getMoodEmoji(mood),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await respondWithMood(
        mood,
        1,
        `You chose a ${mood.toLowerCase()} vibe — spinning a curated set just for you.`
      );
      toast.success(`Serving ${mood} vibes`);
    } catch (error) {
      console.error(error);
      toast.error("I couldn't fetch music for that mood yet.");
      appendErrorMessage();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background/90 to-background text-foreground">
      <Navbar />
      <div className="flex-1">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onPlayTrack={(song) => song.previewUrl && setCurrentTrack(song)}
          currentTrack={currentTrack}
        />
      </div>
      <MoodButtons onMoodSelect={handleMoodSelect} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
      <AudioPlayer
        track={currentTrack}
        onClear={() => setCurrentTrack(null)}
        onNext={handleNextTrack}
      />
    </div>
  );
};

export default Index;
