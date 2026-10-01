// src/services/authService.js
// Handles the business logic for authentication.
//
// This file talks to the MySQL database and contains all the "thinking" for auth.
// Controllers stay thin — they call a service function and return the result.
//
// ─── DATABASE SCHEMA ASSUMPTIONS ────────────────────────────────────────────────
//
// This service assumes the following MySQL table structures (provided by the DB team):
//
// FACULTY table:
//   Faculty_ID  INT  PRIMARY KEY
//   Name        VARCHAR
//   Email       VARCHAR  UNIQUE
//   Password    VARCHAR  (bcrypt hash)
//
// STUDENT table:
//   Student_ID  INT  PRIMARY KEY
//   Team_ID     INT
//   Name        VARCHAR
//   Email       VARCHAR  UNIQUE
//   Phone       VARCHAR
//   Password    VARCHAR  (bcrypt hash)
//
// Role is determined by which table the email is found in — NOT by a role column.
// If the DB team changes the schema, only this file needs updating.
//
// ─────────────────────────────────────────────────────────────────────────────────

const bcrypt = require("bcryptjs");
const db = require("../config/database");

/**
 * Finds a user by email in either FACULTY or STUDENT table.
 * Returns the user object and their role, or null if not found.
 *
 * @param {string} email
 * @returns {{ user: object, role: string } | null}
 */
const findUserByEmail = async (email) => {
  // 1. Search the FACULTY table first
  // Using parameterized query (?) to prevent SQL injection
  const [facultyRows] = await db.query(
    "SELECT Faculty_ID AS id, Name AS name, Email AS email, Password AS password FROM FACULTY WHERE Email = ?",
    [email]
  );

  if (facultyRows.length > 0) {
    return { user: facultyRows[0], role: "faculty" };
  }

  // 2. If not found in FACULTY, search the STUDENT table
  const [studentRows] = await db.query(
    "SELECT Student_ID AS id, Name AS name, Email AS email, Password AS password FROM STUDENT WHERE Email = ?",
    [email]
  );

  if (studentRows.length > 0) {
    return { user: studentRows[0], role: "student" };
  }

  // 3. Not found in either table
  return null;
};

/**
 * Verifies a plain-text password against the stored bcrypt hash.
 *
 * @param {string} plainPassword   - Password submitted by the user
 * @param {string} hashedPassword  - Hash stored in the database
 * @returns {boolean}
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Fetches the current user's basic info from the database (by ID and role).
 * Used by the GET /api/auth/me endpoint to return fresh data.
 *
 * @param {number} id
 * @param {string} role  - "faculty" or "student"
 * @returns {object | null}
 */
const getUserById = async (id, role) => {
  if (role === "faculty") {
    const [rows] = await db.query(
      "SELECT Faculty_ID AS id, Name AS name, Email AS email FROM FACULTY WHERE Faculty_ID = ?",
      [id]
    );
    return rows.length > 0 ? { ...rows[0], role: "faculty" } : null;
  }

  if (role === "student") {
    const [rows] = await db.query(
      "SELECT Student_ID AS id, Name AS name, Email AS email FROM STUDENT WHERE Student_ID = ?",
      [id]
    );
    return rows.length > 0 ? { ...rows[0], role: "student" } : null;
  }

  return null;
};

module.exports = { findUserByEmail, verifyPassword, getUserById };
