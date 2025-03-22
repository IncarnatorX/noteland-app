import db from "../DB/db.js";

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(404)
        .json({ message: "Title and content are required to create a note." });
    }

    const result = await db.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Unable to save the note in our database. Please try again.",
      });
    }

    return res.status(200).json({
      message: "A new note created successfully.",
      payload: result.rows[0],
    });
  } catch (error) {
    console.error("Error in createNote controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Something wen't wrong at our end. Please try again." });
  }
};

const createTask = async (req, res) => {
  try {
    const { task_name } = req.body;
    const { note_id } = req.params;

    if (!note_id) {
      return res
        .status(404)
        .json({ message: "Corresponding Note ID not found in the request." });
    }

    if (!task_name) {
      return res.status(404).json({
        message: "Unable to create a task. No task found in your request.",
      });
    }

    const result = await db.query(
      "INSERT INTO tasks (note_id, task_name) VALUES ($1, $2) RETURNING *",
      [note_id, task_name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Unable to save the task in our database. Please try again.",
      });
    }

    return res.status(201).json({ message: "Task successfully created.." });
  } catch (error) {
    console.error("Error in createTask controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Something wen't wrong at our end. Please try again." });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json({ message: "Corresponding task id not found in your request." });
    }

    const result = await db.query(
      `
        UPDATE tasks 
        SET completed = true
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Unable to update the task at this time." });
    }

    return res.status(200).json({ message: "Task successfully updated." });
  } catch (error) {
    console.error("Error in updateTask controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Something wen't wrong at our end. Please try again." });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const allNotes = await db.query(`
      SELECT notes.id, notes.title, notes.content, COALESCE(json_agg(tasks) FILTER (WHERE tasks.id IS NOT NULL), '[]') AS tasks 
      FROM notes 
      LEFT JOIN tasks ON notes.id = tasks.note_id  
      GROUP BY NOTES.id
      `);

    if (allNotes.rows.length === 0) {
      return res.status(204).json({ message: "No Notes available." });
    }

    return res.status(200).json({
      message: "All notes fetched successfully.",
      payload: allNotes.rows,
    });
  } catch (error) {
    console.error("Error in createNote controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Something wen't wrong at our end. Please try again." });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json({ message: "Note id not found in your request." });
    }

    const result = await db.query(
      `
        DELETE FROM notes 
        WHERE id = $1
      `,
      [id]
    );

    if (!result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Unable to delete the note at this time." });
    }

    return res.status(200).json({ message: "Note Deleted successfully." });
  } catch (error) {
    console.error("Error in deleteNote controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Something wen't wrong at our end. Please try again." });
  }
};

export { createNote, getAllNotes, createTask, updateTask, deleteNote };
