module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  GEMINI_API_URL: process.env.GEMINI_API_URL || "",
  PIPED_API_BASE: process.env.PIPED_API_BASE || "https://pipedapi.kavin.rocks",
  CACHE_TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS || 600),
};
