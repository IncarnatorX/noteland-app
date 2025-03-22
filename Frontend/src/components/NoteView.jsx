import { useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext";
import TaskCreator from "./TaskCreator";
import TaskManager from "./TaskManager";
import { toast } from "react-toastify";

const NoteView = () => {
  const {
    currentSelectedNote,
    setNoteView,
    setPlaceholder,
    refreshNotes,
    setRefreshNotes,
  } = useContext(NotesContext);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  async function handleDeleteNote() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/delete-note/${currentSelectedNote.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Server didn't respond with a success state.");
      }

      const data = await response.json();
      toast.success(data.message);
      setNoteView(false);
      setPlaceholder(true);
      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error("Error deleting the note: ", error.message);
      console.error("Cause of the error: ", error?.cause);
    }
  }

  return (
    <div className="note-view">
      {/* HEADING DIV */}
      <div className="note-view-heading">
        <h2>{currentSelectedNote.title}</h2>
        <div className="note-view-btns">
          <button className="new-task" onClick={() => setOpenTaskDialog(true)}>
            New Task
          </button>

          {/* <button className="save-note">Save Note</button> */}
          <button className="delete-note" onClick={handleDeleteNote}>
            Delete Note
          </button>
        </div>
      </div>
      {/* CONTENT DIV */}
      <div className="note-view-content">
        <span className="note-content-span">NOTE CONTENT: </span>
        <p>{currentSelectedNote.content}</p>
        {currentSelectedNote?.tasks.length > 0 && (
          <TaskManager tasks={currentSelectedNote.tasks} />
        )}
      </div>

      <TaskCreator
        openTaskDialog={openTaskDialog}
        setOpenTaskDialog={setOpenTaskDialog}
      />
    </div>
  );
};

export default NoteView;
