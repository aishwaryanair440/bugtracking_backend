// src/utils/jwt.js
// Helper functions for creating and verifying JSON Web Tokens (JWT).
//
// What is a JWT?
//   A JWT is a small, signed token the server gives a user after login.
//   The user sends this token with every future request.
//   The server verifies the token to know who the user is — without querying the DB every time.
//
// Usage:
//   const { generateToken, verifyToken } = require('../utils/jwt');

const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for the given payload.
 *
 * @param {object} payload - Data to encode in the token (e.g. { id, role })
 * @returns {string} - The signed JWT string
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,           // Secret key from .env — never hardcode this
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } // Token lifetime from .env
  );
};

/**
 * Verifies a JWT and returns the decoded payload if valid.
 * Throws an error if the token is invalid or expired.
 *
 * @param {string} token - The JWT string to verify
 * @returns {object} - The decoded payload (e.g. { id, role, iat, exp })
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
