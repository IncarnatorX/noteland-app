import { Router } from "express";
import {
  createNote,
  createTask,
  deleteNote,
  getAllNotes,
  getAllUserNotes,
  updateNote,
  updateTask,
} from "../controller/notesController.js";
import verifyJWT from "../middleware/authMiddleware.js";

const notesRouter = Router();

notesRouter.get("/all-notes", getAllNotes);

notesRouter.get("/get-user-notes", verifyJWT, getAllUserNotes);
notesRouter.post("/create-note", verifyJWT, createNote);
notesRouter.post("/create-task/:note_id", verifyJWT, createTask);
notesRouter.patch("/update-task/:id", verifyJWT, updateTask);
notesRouter.put("/update-note", verifyJWT, updateNote);
notesRouter.delete("/delete-note/:id", verifyJWT, deleteNote);

export default notesRouter;
