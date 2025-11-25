// src/routes/music.routes.js
const express = require("express");
const router = express.Router();
const catchAsync = require("../middleware/catchAsync");

const musicMoodCtrl = require("../controllers/mood.controller");
const musicAICtrl = require("../controllers/ai.controller");
const musicStreamCtrl = require("../controllers/stream.controller");

// GET /api/music/mood?mood=Sad&lang=hi
router.get("/mood", catchAsync(musicMoodCtrl.getMoodBatch));

// POST /api/music/ai  { message }
router.post("/ai", catchAsync(musicAICtrl.postAIBatch));

// NEW: Stream YouTube audio
// GET /api/music/stream/:videoId
router.get("/stream/:videoId", catchAsync(musicStreamCtrl.streamYoutubeAudio));

module.exports = router;
