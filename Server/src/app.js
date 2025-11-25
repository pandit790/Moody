const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const musicRoutes = require("./routes/music.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api/music", musicRoutes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// error handler (last)
app.use(errorHandler);

module.exports = app;
