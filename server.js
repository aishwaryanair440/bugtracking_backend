// server.js
// Entry point of the application.
// Loads environment variables, then starts the Express server.

const dotenv = require("dotenv");

// Load .env BEFORE anything else, so all process.env values are available
dotenv.config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("--------------------------------------------------");
  console.log("  Bug Tracking & Project Management System");
  console.log(`  Server running on port ${PORT}`);
  console.log(`  Health:    http://localhost:${PORT}/api/health`);
  console.log(`  DB Check:  http://localhost:${PORT}/api/health/db`);
  console.log("--------------------------------------------------");
});
