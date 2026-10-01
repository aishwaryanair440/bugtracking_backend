// src/middleware/errorMiddleware.js
// Global error-handling middleware for Express.
//
// Catches all errors passed via next(err) and maps them to clean JSON responses.
// Prevents internal stack traces, DB credentials, or raw SQL queries from leaking.

const errorMiddleware = (err, req, res, next) => {
  // Log the full error to server console for debugging
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  if (process.env.NODE_ENV === "development" && err.stack) {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || undefined;

  // ── 1. Handle MySQL Specific Errors ───────────────────────────────────────
  if (err.code) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        statusCode = 409;
        message = "Duplicate entry: A record with this email or unique identifier already exists.";
        break;
      case "ER_NO_REFERENCED_ROW":
      case "ER_NO_REFERENCED_ROW_2":
        statusCode = 400;
        message = "Invalid reference: The referenced parent record (foreign key) does not exist.";
        break;
      case "ER_ROW_IS_REFERENCED":
      case "ER_ROW_IS_REFERENCED_2":
        statusCode = 400;
        message = "Cannot delete or update record: It is referenced by other existing data.";
        break;
      case "ER_BAD_FIELD_ERROR":
      case "ER_PARSE_ERROR":
        statusCode = 400;
        message = "Database query error: Invalid column or query parameters.";
        break;
      default:
        if (err.code.startsWith("ER_")) {
          statusCode = 400;
          message = "Database constraint or syntax error.";
        }
        break;
    }
  }

  // ── 2. Handle Express / JSON Body Parsing Errors ─────────────────────────
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Malformed JSON payload provided in request body.";
  }

  // ── 3. Build Standard Response Body ─────────────────────────────────────
  const responseBody = {
    success: false,
    message: message,
  };

  if (errors && Array.isArray(errors) && errors.length > 0) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};

module.exports = errorMiddleware;
