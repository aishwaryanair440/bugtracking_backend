// src/services/teamService.js
// Business logic for teams using MySQL database.

const db = require("../config/database");

const teamService = {
  // Retrieve all teams with associated Project Title
  getAllTeams: async () => {
    const [rows] = await db.query(
      `SELECT t.Team_ID, t.Project_ID, t.Team_Name, p.Title AS Project_Title
       FROM TEAM t
       LEFT JOIN PROJECT p ON t.Project_ID = p.Project_ID
       ORDER BY t.Team_ID DESC`
    );
    return rows;
  },

  // Retrieve a single team by Team_ID
  getTeamById: async (id) => {
    const [rows] = await db.query(
      `SELECT t.Team_ID, t.Project_ID, t.Team_Name, p.Title AS Project_Title
       FROM TEAM t
       LEFT JOIN PROJECT p ON t.Project_ID = p.Project_ID
       WHERE t.Team_ID = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Create a new team
  createTeam: async (teamData) => {
    const { Project_ID, Team_Name } = teamData;

    const [result] = await db.query(
      `INSERT INTO TEAM (Project_ID, Team_Name) VALUES (?, ?)`,
      [Project_ID, Team_Name]
    );

    return teamService.getTeamById(result.insertId);
  },

  // Update an existing team
  updateTeam: async (id, teamData) => {
    const existing = await teamService.getTeamById(id);
    if (!existing) return null;

    const Project_ID = teamData.Project_ID !== undefined ? teamData.Project_ID : existing.Project_ID;
    const Team_Name = teamData.Team_Name !== undefined ? teamData.Team_Name : existing.Team_Name;

    await db.query(
      `UPDATE TEAM SET Project_ID = ?, Team_Name = ? WHERE Team_ID = ?`,
      [Project_ID, Team_Name, id]
    );

    return teamService.getTeamById(id);
  },

  // Delete a team by Team_ID
  deleteTeam: async (id) => {
    const existing = await teamService.getTeamById(id);
    if (!existing) return false;

    const [result] = await db.query("DELETE FROM TEAM WHERE Team_ID = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = teamService;
