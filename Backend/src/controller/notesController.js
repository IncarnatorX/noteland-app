import db from "../DB/db.js";

const getAllUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. Unable to pull your notes.",
        success: false,
      });
    }

    const result = await db.query(
      `
      SELECT notes.id, 
        notes.title, 
        notes.content, 
        notes.user_id, 
        COALESCE(json_agg(tasks) FILTER (WHERE tasks.id IS NOT NULL), '[]') AS tasks
      FROM notes 
      LEFT JOIN tasks ON notes.id = tasks.note_id
      WHERE notes.user_id = $1
      GROUP BY notes.id 
      `,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(200).json({ message: "No notes found." });
    }

    return res
      .status(200)
      .json({ message: "All notes fetched successfully", notes: result.rows });
  } catch (error) {
    console.error("Error in getAllUserNotes controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Something wen't wrong at our end. Please try again." });
  }
};

const createNote = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to create a note.",
        success: false,
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(404)
        .json({ message: "Title and content are required to create a note." });
    }

    const result = await db.query(
      "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, userId]
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

    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to create a task.",
        success: false,
      });
    }

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
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to update the note.",
        success: false,
      });
    }

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
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to delete the note.",
        success: false,
      });
    }

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

export {
  createNote,
  getAllNotes,
  getAllUserNotes,
  createTask,
  updateTask,
  deleteNote,
};
