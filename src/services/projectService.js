// src/services/projectService.js
// Business logic for projects using MySQL database.

const db = require("../config/database");

const projectService = {
  // Retrieve all projects (with associated Faculty name via JOIN)
  getAllProjects: async () => {
    const [rows] = await db.query(
      `SELECT p.Project_ID, p.Faculty_ID, p.Title, p.Description, p.Start_Date, p.End_Date,
              f.Name AS Faculty_Name, f.Email AS Faculty_Email
       FROM PROJECT p
       LEFT JOIN FACULTY f ON p.Faculty_ID = f.Faculty_ID
       ORDER BY p.Project_ID DESC`
    );
    return rows;
  },

  // Retrieve a single project by Project_ID
  getProjectById: async (id) => {
    const [rows] = await db.query(
      `SELECT p.Project_ID, p.Faculty_ID, p.Title, p.Description, p.Start_Date, p.End_Date,
              f.Name AS Faculty_Name, f.Email AS Faculty_Email
       FROM PROJECT p
       LEFT JOIN FACULTY f ON p.Faculty_ID = f.Faculty_ID
       WHERE p.Project_ID = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Create a new project record
  createProject: async (projectData) => {
    const { Faculty_ID, Title, Description, Start_Date, End_Date } = projectData;

    const [result] = await db.query(
      `INSERT INTO PROJECT (Faculty_ID, Title, Description, Start_Date, End_Date)
       VALUES (?, ?, ?, ?, ?)`,
      [Faculty_ID, Title, Description || null, Start_Date || null, End_Date || null]
    );

    return projectService.getProjectById(result.insertId);
  },

  // Update an existing project
  updateProject: async (id, projectData) => {
    const existing = await projectService.getProjectById(id);
    if (!existing) return null;

    const Faculty_ID = projectData.Faculty_ID !== undefined ? projectData.Faculty_ID : existing.Faculty_ID;
    const Title = projectData.Title !== undefined ? projectData.Title : existing.Title;
    const Description = projectData.Description !== undefined ? projectData.Description : existing.Description;
    const Start_Date = projectData.Start_Date !== undefined ? projectData.Start_Date : existing.Start_Date;
    const End_Date = projectData.End_Date !== undefined ? projectData.End_Date : existing.End_Date;

    await db.query(
      `UPDATE PROJECT
       SET Faculty_ID = ?, Title = ?, Description = ?, Start_Date = ?, End_Date = ?
       WHERE Project_ID = ?`,
      [Faculty_ID, Title, Description, Start_Date, End_Date, id]
    );

    return projectService.getProjectById(id);
  },

  // Delete a project by Project_ID
  deleteProject: async (id) => {
    const existing = await projectService.getProjectById(id);
    if (!existing) return false;

    const [result] = await db.query("DELETE FROM PROJECT WHERE Project_ID = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = projectService;
