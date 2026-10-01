// src/app.js
// Sets up the Express application.
// Registers middleware, routes, 404 handler, and error handler.

const express = require("express");
const cors = require("cors");

// ── Route imports ──────────────────────────────────────────────────────────────
const healthRoutes  = require("./routes/healthRoutes");
const authRoutes    = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes    = require("./routes/teamRoutes");
const studentRoutes = require("./routes/studentRoutes");
const taskRoutes    = require("./routes/taskRoutes");
const bugRoutes     = require("./routes/bugRoutes");
const commentRoutes = require("./routes/commentRoutes");

// ── Middleware import ──────────────────────────────────────────────────────────
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────

// Allow the frontend (on a different port) to communicate with this backend
app.use(cors());

// Parse incoming JSON request bodies so we can read req.body
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────────────────────────

app.use("/api", healthRoutes);          // GET /api/health, GET /api/health/db
app.use("/api/auth", authRoutes);       // /api/auth
app.use("/api/projects", projectRoutes);// /api/projects
app.use("/api/teams", teamRoutes);      // /api/teams
app.use("/api/students", studentRoutes);// /api/students
app.use("/api/tasks", taskRoutes);      // /api/tasks
app.use("/api/bugs", bugRoutes);        // /api/bugs
app.use("/api/comments", commentRoutes);// /api/comments

// ── 404 Handler ────────────────────────────────────────────────────────────────
// Catches any request to a route that does not exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
// Must be registered LAST — Express detects error handlers by the 4 parameters
app.use(errorMiddleware);

module.exports = app;
