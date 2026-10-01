// src/services/taskService.js
// Business logic for tasks using MySQL database.

const db = require("../config/database");

const taskService = {
  // Retrieve all tasks with Project Title and assigned Student Name
  getAllTasks: async () => {
    const [rows] = await db.query(
      `SELECT t.Task_ID, t.Project_ID, t.Student_ID, t.Task_Description,
              t.Priority, t.Status, t.Start_Date, t.End_Date,
              p.Title AS Project_Title,
              s.Name AS Student_Name, s.Email AS Student_Email
       FROM TASK t
       LEFT JOIN PROJECT p ON t.Project_ID = p.Project_ID
       LEFT JOIN STUDENT s ON t.Student_ID = s.Student_ID
       ORDER BY t.Task_ID DESC`
    );
    return rows;
  },

  // Retrieve a single task by Task_ID
  getTaskById: async (id) => {
    const [rows] = await db.query(
      `SELECT t.Task_ID, t.Project_ID, t.Student_ID, t.Task_Description,
              t.Priority, t.Status, t.Start_Date, t.End_Date,
              p.Title AS Project_Title,
              s.Name AS Student_Name, s.Email AS Student_Email
       FROM TASK t
       LEFT JOIN PROJECT p ON t.Project_ID = p.Project_ID
       LEFT JOIN STUDENT s ON t.Student_ID = s.Student_ID
       WHERE t.Task_ID = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Create a new task
  createTask: async (taskData) => {
    const { Project_ID, Student_ID, Task_Description, Priority, Status, Start_Date, End_Date } = taskData;

    const [result] = await db.query(
      `INSERT INTO TASK (Project_ID, Student_ID, Task_Description, Priority, Status, Start_Date, End_Date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Project_ID,
        Student_ID || null,
        Task_Description,
        Priority || "Medium",
        Status || "Open",
        Start_Date || null,
        End_Date || null,
      ]
    );

    return taskService.getTaskById(result.insertId);
  },

  // Update an existing task
  updateTask: async (id, taskData) => {
    const existing = await taskService.getTaskById(id);
    if (!existing) return null;

    const Project_ID = taskData.Project_ID !== undefined ? taskData.Project_ID : existing.Project_ID;
    const Student_ID = taskData.Student_ID !== undefined ? taskData.Student_ID : existing.Student_ID;
    const Task_Description = taskData.Task_Description !== undefined ? taskData.Task_Description : existing.Task_Description;
    const Priority = taskData.Priority !== undefined ? taskData.Priority : existing.Priority;
    const Status = taskData.Status !== undefined ? taskData.Status : existing.Status;
    const Start_Date = taskData.Start_Date !== undefined ? taskData.Start_Date : existing.Start_Date;
    const End_Date = taskData.End_Date !== undefined ? taskData.End_Date : existing.End_Date;

    await db.query(
      `UPDATE TASK
       SET Project_ID = ?, Student_ID = ?, Task_Description = ?, Priority = ?, Status = ?, Start_Date = ?, End_Date = ?
       WHERE Task_ID = ?`,
      [Project_ID, Student_ID, Task_Description, Priority, Status, Start_Date, End_Date, id]
    );

    return taskService.getTaskById(id);
  },

  // Delete a task by Task_ID
  deleteTask: async (id) => {
    const existing = await taskService.getTaskById(id);
    if (!existing) return false;

    const [result] = await db.query("DELETE FROM TASK WHERE Task_ID = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = taskService;
