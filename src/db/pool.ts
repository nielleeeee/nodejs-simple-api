import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const port = Number(process.env.DB_PORT) || 5432;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port,
});

pool.on("error", (err) => {
  console.error("Error in database connection", err);
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

export default pool;
