import { Router } from "express";
import {
  createNote,
  createTask,
  deleteNote,
  getAllNotes,
  updateTask,
} from "../controller/notesController.js";

const notesRouter = Router();

notesRouter.post("/create-note", createNote);
notesRouter.get("/all-notes", getAllNotes);
notesRouter.post("/create-task/:note_id", createTask);
notesRouter.patch("/update-task/:id", updateTask);
notesRouter.delete("/delete-note/:id", deleteNote);

export default notesRouter;
