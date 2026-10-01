// src/middleware/errorMiddleware.js
// Global error-handling middleware for Express.
//
// How it works:
//   Any route or middleware can call next(error) to pass an error here.
//   Express recognizes this as an error handler because it has FOUR parameters.
//
// This keeps all error formatting in ONE place so every error response
// looks consistent across the entire application.

const errorMiddleware = (err, req, res, next) => {
  // Log the error to the server console (useful for debugging)
  // We never send stack traces to the client in production
  console.error(`[ERROR] ${err.message}`);

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Use a status code attached to the error, or default to 500
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    // Use the error's message, or a safe generic message
    message: err.message || "Something went wrong",
  });
};

module.exports = errorMiddleware;
