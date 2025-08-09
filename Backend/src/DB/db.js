import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// LOCAL DATABASE CONFIG
// const db = new pg.Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// NEON DB CONFIG
const db = new pg.Client({
  connectionString: process.env.NOEN_PG_DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // This is required for neon
});

export default db;
