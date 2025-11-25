// src/controllers/mood.controller.js
const { success, error } = require("../utils/apiResponse");
const batchService = require("../services/batch.service");
const logger = console;

async function getMoodBatch(req, res) {
  const mood = (req.query.mood || "").trim();
  const language_preference = req.query.lang || "mixed";

  if (!mood) return error(res, "Query param 'mood' is required", 400);

  try {
    const result = await batchService.createBatch({
      source: "mood-button",
      mood,
      message: mood,
      language_preference,
      batchSize: 5,
    });

    return success(res, { songs: result });
  } catch (err) {
    logger.error("[musicMood.controller] ", err);
    return error(res, "Failed to produce mood batch", 502, err.message);
  }
}

module.exports = { getMoodBatch };
