// Mock mood detection (simulates sentiment analysis)
export const detectMood = (text) => {
  const lowerText = text.toLowerCase();
  
  const moodKeywords = {
    Happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'wonderful', 'cheerful', 'delighted'],
    Sad: ['sad', 'down', 'depressed', 'crying', 'lonely', 'heartbroken', 'blue', 'melancholy'],
    Energetic: ['energetic', 'pumped', 'active', 'workout', 'running', 'gym', 'motivated', 'hyped'],
    Relaxed: ['relaxed', 'calm', 'peaceful', 'chill', 'zen', 'tranquil', 'serene', 'mellow'],
    Focused: ['focused', 'study', 'work', 'concentrate', 'productive', 'coding', 'reading'],
    Romantic: ['love', 'romantic', 'crush', 'date', 'heart', 'valentine', 'romance'],
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return mood;
    }
  }

  return 'Relaxed'; // Default mood
};

// Mock Spotify data
export const getMockSongs = (mood) => {
  const songDatabase = {
    Happy: [
      {
        id: 1,
        title: "Good Vibrations",
        artist: "The Beach Boys",
        albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 2,
        title: "Happy",
        artist: "Pharrell Williams",
        albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 3,
        title: "Walking on Sunshine",
        artist: "Katrina and the Waves",
        albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
    ],
    Sad: [
      {
        id: 4,
        title: "Someone Like You",
        artist: "Adele",
        albumArt: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 5,
        title: "The Night We Met",
        artist: "Lord Huron",
        albumArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 6,
        title: "Hurt",
        artist: "Johnny Cash",
        albumArt: "https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
    ],
    Energetic: [
      {
        id: 7,
        title: "Eye of the Tiger",
        artist: "Survivor",
        albumArt: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 8,
        title: "Lose Yourself",
        artist: "Eminem",
        albumArt: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 9,
        title: "Till I Collapse",
        artist: "Eminem",
        albumArt: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
    ],
    Relaxed: [
      {
        id: 10,
        title: "Weightless",
        artist: "Marconi Union",
        albumArt: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 11,
        title: "Sunset Lover",
        artist: "Petit Biscuit",
        albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 12,
        title: "River Flows in You",
        artist: "Yiruma",
        albumArt: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
    ],
    Focused: [
      {
        id: 13,
        title: "Focus",
        artist: "Ariana Grande",
        albumArt: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 14,
        title: "Study Music",
        artist: "Lo-Fi Beats",
        albumArt: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 15,
        title: "Comptine d'un autre été",
        artist: "Yann Tiersen",
        albumArt: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
    ],
    Romantic: [
      {
        id: 16,
        title: "Perfect",
        artist: "Ed Sheeran",
        albumArt: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 17,
        title: "All of Me",
        artist: "John Legend",
        albumArt: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
      {
        id: 18,
        title: "Thinking Out Loud",
        artist: "Ed Sheeran",
        albumArt: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&h=400&fit=crop",
        previewUrl: "https://open.spotify.com",
      },
    ],
  };

  return songDatabase[mood] || songDatabase.Relaxed;
};

export const getMoodEmoji = (mood) => {
  const emojiMap = {
    Happy: "😊",
    Sad: "😢",
    Energetic: "⚡",
    Relaxed: "😌",
    Focused: "🎯",
    Romantic: "💕",
  };
  return emojiMap[mood] || "🎵";
};
