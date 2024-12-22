const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.on("error", (err) => {
  console.error("Error in database connection", err);
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

module.exports = pool;
