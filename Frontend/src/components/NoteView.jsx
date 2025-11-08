import { useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext";
import TaskCreator from "./TaskCreator";
import TaskManager from "./TaskManager";
import { toast } from "react-toastify";
import { VITE_BACKEND_URL } from "../utils/constants";
import EditNoteModal from "./EditNoteModal";
// import { Delete, Edit } from "lucide-react";
import NoteViewButtons from "./NoteViewButtons";
import { useIsMobile } from "../hooks/use-mobile";

const NoteView = () => {
  const {
    currentSelectedNote,
    setNoteView,
    setPlaceholder,
    refreshNotes,
    setRefreshNotes,
  } = useContext(NotesContext);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);

  const isMobile = useIsMobile();

  async function handleDeleteNote() {
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/notes/delete-note/${currentSelectedNote.id}`,
        {
          method: "DELETE",
          credentials: "include",
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
        {/* <div className="note-view-btns">
          <button className="new-task" onClick={() => setOpenTaskDialog(true)}>
            <Edit className="note-view-btn-icon" /> <span>New Task</span>
          </button>
          <button className="edit-note" onClick={() => setOpenEditModal(true)}>
            <Edit className="note-view-btn-icon" /> <span>Edit Note</span>
          </button>
          <button className="delete-note" onClick={handleDeleteNote}>
            <Delete className="note-view-btn-icon" /> <span>Delete Note</span>
          </button>
        </div> */}
        {!isMobile && (
          <NoteViewButtons
            setOpenEditModal={setOpenEditModal}
            setOpenTaskDialog={setOpenTaskDialog}
            handleDeleteNote={handleDeleteNote}
          />
        )}
      </div>
      {/* CONTENT DIV */}
      <div className="note-view-div">
        <p className="note-view-title">NOTE CONTENT: </p>
        <p className="note-view-content">{currentSelectedNote.content}</p>
        {currentSelectedNote?.tasks?.length > 0 && (
          <TaskManager tasks={currentSelectedNote.tasks} />
        )}
        {isMobile && (
          <div
            style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}
          >
            <div className="separator"></div>
            <NoteViewButtons
              setOpenEditModal={setOpenEditModal}
              setOpenTaskDialog={setOpenTaskDialog}
              handleDeleteNote={handleDeleteNote}
            />
          </div>
        )}
      </div>

      <TaskCreator
        openTaskDialog={openTaskDialog}
        setOpenTaskDialog={setOpenTaskDialog}
      />

      <EditNoteModal
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        currentSelectedNote={currentSelectedNote}
      />
    </div>
  );
};

export default NoteView;
