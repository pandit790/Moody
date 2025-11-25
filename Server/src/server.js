require("dotenv").config();
const app = require("./app");
const { initLogger } = require("./utils/logger");

const PORT = process.env.PORT || 5000;
const logger = initLogger();

app.listen(PORT, () => {
  logger.info(`Moody backend running on http://localhost:${PORT}`);
});
