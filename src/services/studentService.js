// src/services/studentService.js
// Business logic for students using MySQL database.
// Password security rules:
// - Always hash passwords using bcrypt before saving.
// - Explicitly exclude Password field from all query outputs to frontend.

const bcrypt = require("bcryptjs");
const db = require("../config/database");

const studentService = {
  // Retrieve all students (safe columns only, plus Team Name via JOIN)
  getAllStudents: async () => {
    const [rows] = await db.query(
      `SELECT s.Student_ID, s.Team_ID, s.Name, s.Email, s.Phone, t.Team_Name
       FROM STUDENT s
       LEFT JOIN TEAM t ON s.Team_ID = t.Team_ID
       ORDER BY s.Student_ID DESC`
    );
    return rows;
  },

  // Retrieve a single student by Student_ID (without Password)
  getStudentById: async (id) => {
    const [rows] = await db.query(
      `SELECT s.Student_ID, s.Team_ID, s.Name, s.Email, s.Phone, t.Team_Name
       FROM STUDENT s
       LEFT JOIN TEAM t ON s.Team_ID = t.Team_ID
       WHERE s.Student_ID = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Create a new student with hashed password
  createStudent: async (studentData) => {
    const { Team_ID, Name, Email, Phone, Password } = studentData;

    // Hash the plain-text password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const [result] = await db.query(
      `INSERT INTO STUDENT (Team_ID, Name, Email, Phone, Password)
       VALUES (?, ?, ?, ?, ?)`,
      [Team_ID, Name, Email, Phone || null, hashedPassword]
    );

    return studentService.getStudentById(result.insertId);
  },

  // Update a student (hash password if updated)
  updateStudent: async (id, studentData) => {
    // Check if student exists first
    const [currentRows] = await db.query(
      "SELECT Student_ID, Team_ID, Name, Email, Phone, Password FROM STUDENT WHERE Student_ID = ?",
      [id]
    );

    if (currentRows.length === 0) return null;
    const existing = currentRows[0];

    const Team_ID = studentData.Team_ID !== undefined ? studentData.Team_ID : existing.Team_ID;
    const Name = studentData.Name !== undefined ? studentData.Name : existing.Name;
    const Email = studentData.Email !== undefined ? studentData.Email : existing.Email;
    const Phone = studentData.Phone !== undefined ? studentData.Phone : existing.Phone;

    let hashedPassword = existing.Password;
    if (studentData.Password) {
      hashedPassword = await bcrypt.hash(studentData.Password, 10);
    }

    await db.query(
      `UPDATE STUDENT
       SET Team_ID = ?, Name = ?, Email = ?, Phone = ?, Password = ?
       WHERE Student_ID = ?`,
      [Team_ID, Name, Email, Phone, hashedPassword, id]
    );

    return studentService.getStudentById(id);
  },

  // Delete a student by Student_ID
  deleteStudent: async (id) => {
    const existing = await studentService.getStudentById(id);
    if (!existing) return false;

    const [result] = await db.query("DELETE FROM STUDENT WHERE Student_ID = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = studentService;
