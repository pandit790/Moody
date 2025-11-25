const { GoogleGenAI } = require("@google/genai");
const { GEMINI_API_KEY, GEMINI_MODEL } = require("../config/env");

const client = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const modelName = GEMINI_MODEL || "gemini-2.5-flash";

async function generateSongSuggestions({
  userMessage,
  mood,
  language_preference,
  maxSongs = 5,
}) {
  const prompt = buildPrompt({
    userMessage,
    mood,
    language_preference,
    maxSongs,
  });

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500,
      },
    });

    // Extract raw text from Gemini response
    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const json = safeExtractJSON(text);
    console.log("Gemini response JSON:", json);
    if (!json || !Array.isArray(json.songs)) {
      throw new Error("Gemini returned invalid JSON");
    }

    return json.songs;
  } catch (err) {
    throw new Error("Gemini API failed: " + err.message);
  }
}

function buildPrompt({ userMessage, mood, language_preference, maxSongs }) {
  const userContext = userMessage
    ? `User says: "${userMessage}"`
    : `User mood: "${mood}"`;

  const langPref = language_preference
    ? `Preferred languages: ${language_preference}`
    : "";

  return `
SYSTEM:
You are a conservative, reality-based music expert.  
Return JSON ONLY.

JSON Format:
{
  "songs": [
    {
      "title": "string",
      "artist": "string|null",
      "language": "hi|en|mixed",
      "reason": "string",
      "confidence": "number(0-1)"
    }
  ]
}

RULES:
- Return exactly ${maxSongs} results or fewer.
- DO NOT invent songs.
- Prefer Indian songs when user preference or message suggests.
- Artist can be null if uncertain.
- Keep responses strictly JSON.

USER:
${userContext}
${langPref}
`;
}

function safeExtractJSON(text) {
  if (!text) return null;
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
  } catch (_) {
    return null;
  }
  return null;
}

module.exports = { generateSongSuggestions };
