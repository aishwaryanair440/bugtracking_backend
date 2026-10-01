// src/services/commentService.js
// Business logic for bug comments using MySQL database.

const db = require("../config/database");

const commentService = {
  // Retrieve all comments with Student Name and Bug Title
  getAllComments: async () => {
    const [rows] = await db.query(
      `SELECT c.Comment_ID, c.Student_ID, c.Bug_ID, c.Comment, c.Comment_Date,
              s.Name AS Student_Name, s.Email AS Student_Email,
              b.Title AS Bug_Title
       FROM COMMENTS c
       LEFT JOIN STUDENT s ON c.Student_ID = s.Student_ID
       LEFT JOIN BUG_REPORT b ON c.Bug_ID = b.Bug_ID
       ORDER BY c.Comment_ID DESC`
    );
    return rows;
  },

  // Retrieve a single comment by Comment_ID
  getCommentById: async (id) => {
    const [rows] = await db.query(
      `SELECT c.Comment_ID, c.Student_ID, c.Bug_ID, c.Comment, c.Comment_Date,
              s.Name AS Student_Name, s.Email AS Student_Email,
              b.Title AS Bug_Title
       FROM COMMENTS c
       LEFT JOIN STUDENT s ON c.Student_ID = s.Student_ID
       LEFT JOIN BUG_REPORT b ON c.Bug_ID = b.Bug_ID
       WHERE c.Comment_ID = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Create a new comment
  createComment: async (commentData) => {
    const { Student_ID, Bug_ID, Comment } = commentData;

    const [result] = await db.query(
      `INSERT INTO COMMENTS (Student_ID, Bug_ID, Comment, Comment_Date)
       VALUES (?, ?, ?, NOW())`,
      [Student_ID, Bug_ID, Comment]
    );

    return commentService.getCommentById(result.insertId);
  },

  // Update an existing comment
  updateComment: async (id, commentData) => {
    const existing = await commentService.getCommentById(id);
    if (!existing) return null;

    const Student_ID = commentData.Student_ID !== undefined ? commentData.Student_ID : existing.Student_ID;
    const Bug_ID = commentData.Bug_ID !== undefined ? commentData.Bug_ID : existing.Bug_ID;
    const Comment = commentData.Comment !== undefined ? commentData.Comment : existing.Comment;

    await db.query(
      `UPDATE COMMENTS
       SET Student_ID = ?, Bug_ID = ?, Comment = ?
       WHERE Comment_ID = ?`,
      [Student_ID, Bug_ID, Comment, id]
    );

    return commentService.getCommentById(id);
  },

  // Delete a comment by Comment_ID
  deleteComment: async (id) => {
    const existing = await commentService.getCommentById(id);
    if (!existing) return false;

    const [result] = await db.query("DELETE FROM COMMENTS WHERE Comment_ID = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = commentService;
