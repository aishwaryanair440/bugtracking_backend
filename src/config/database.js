// src/config/database.js
// This file creates and exports a MySQL connection pool.
//
// A "connection pool" keeps a set of reusable database connections open,
// so we don't have to open and close a new connection for every request.
//
// Usage in other files:
//   const db = require('../config/database');
//   const [rows] = await db.query('SELECT * FROM some_table');

const mysql = require("mysql2/promise"); // promise version lets us use async/await

// Create the pool using values from .env
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true, // wait for a free connection instead of throwing an error
  connectionLimit: 10,      // maximum number of connections in the pool
  queueLimit: 0,            // unlimited waiting requests
});

module.exports = pool;
