import pg from "pg";
// import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

// const { Pool } = pkg;

// LOCAL DATABASE CONFIG
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.AIVEN_CERTIFICATE,
  },
});

// NEON DB CONFIG
// const db = new pg.Client({
//   connectionString: process.env.NOEN_PG_DATABASE_URL,
//   ssl: { rejectUnauthorized: false }, // This is required for neon
// });

// const db = new Pool({
//   connectionString: process.env.NOEN_PG_DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// db.on("error", (err) => console.error("DB Connection error:", err));

// setInterval(() => {
//   db.query("SELECT 1").catch((err) => console.error("Keep-alive failed", err));
// }, 300000);

export default db;
