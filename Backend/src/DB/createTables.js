import db from "./db.js";

const createTables = async () => {
  try {
    await db.connect();

    await db.query(`CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL
            );
        `);

    await db.query(`CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        note_id INT REFERENCES notes(id) ON DELETE CASCADE,
        task_name TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
        );
      `);

    console.log("Table NOTES and TASKS is ready.");
  } catch (error) {
    console.error("Error creating tables: ", error.message);
  }
};

export default createTables;
