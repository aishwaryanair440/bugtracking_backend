// src/services/bugService.js
// Business logic for bug reports using MySQL database.

const db = require("../config/database");

const bugService = {
  // Retrieve all bug reports with Task Description
  getAllBugs: async () => {
    const [rows] = await db.query(
      `SELECT b.Bug_ID, b.Task_ID, b.Title, b.Description, b.Status,
              t.Task_Description, t.Project_ID
       FROM BUG_REPORT b
       LEFT JOIN TASK t ON b.Task_ID = t.Task_ID
       ORDER BY b.Bug_ID DESC`
    );
    return rows;
  },

  // Retrieve a single bug report by Bug_ID
  getBugById: async (id) => {
    const [rows] = await db.query(
      `SELECT b.Bug_ID, b.Task_ID, b.Title, b.Description, b.Status,
              t.Task_Description, t.Project_ID
       FROM BUG_REPORT b
       LEFT JOIN TASK t ON b.Task_ID = t.Task_ID
       WHERE b.Bug_ID = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Create a new bug report
  createBug: async (bugData) => {
    const { Task_ID, Title, Description, Status } = bugData;

    const [result] = await db.query(
      `INSERT INTO BUG_REPORT (Task_ID, Title, Description, Status)
       VALUES (?, ?, ?, ?)`,
      [Task_ID, Title, Description, Status || "Open"]
    );

    return bugService.getBugById(result.insertId);
  },

  // Update an existing bug report
  updateBug: async (id, bugData) => {
    const existing = await bugService.getBugById(id);
    if (!existing) return null;

    const Task_ID = bugData.Task_ID !== undefined ? bugData.Task_ID : existing.Task_ID;
    const Title = bugData.Title !== undefined ? bugData.Title : existing.Title;
    const Description = bugData.Description !== undefined ? bugData.Description : existing.Description;
    const Status = bugData.Status !== undefined ? bugData.Status : existing.Status;

    await db.query(
      `UPDATE BUG_REPORT
       SET Task_ID = ?, Title = ?, Description = ?, Status = ?
       WHERE Bug_ID = ?`,
      [Task_ID, Title, Description, Status, id]
    );

    return bugService.getBugById(id);
  },

  // Delete a bug report by Bug_ID
  deleteBug: async (id) => {
    const existing = await bugService.getBugById(id);
    if (!existing) return false;

    const [result] = await db.query("DELETE FROM BUG_REPORT WHERE Bug_ID = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = bugService;
