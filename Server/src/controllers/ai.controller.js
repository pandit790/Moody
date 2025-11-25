// src/controllers/ai.controller.js
const { success, error } = require("../utils/apiResponse");
const batchService = require("../services/batch.service");
const logger = console;

async function postAIBatch(req, res) {
  const { message, language_preference = "mixed" } = req.body || {};
  if (!message || typeof message !== "string") {
    return error(res, "Field 'message' is required", 400);
  }

  try {
    const result = await batchService.createBatch({
      source: "ai-chat",
      mood: null,
      message,
      language_preference,
      batchSize: 5,
    });

    return success(res, { songs: result });
  } catch (err) {
    logger.error("[musicAI.controller] ", err);
    return error(res, "Failed to generate AI batch", 502, err.message);
  }
}

module.exports = { postAIBatch };
