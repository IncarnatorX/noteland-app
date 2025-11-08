import { Delete, Edit } from "lucide-react";
import PropTypes from "prop-types";

export default function NoteViewButtons({
  setOpenEditModal,
  setOpenTaskDialog,
  handleDeleteNote,
}) {
  return (
    <div className="note-view-btns">
      <button className="new-task" onClick={() => setOpenTaskDialog(true)}>
        <Edit className="note-view-btn-icon" /> <span>New Task</span>
      </button>
      <button className="edit-note" onClick={() => setOpenEditModal(true)}>
        <Edit className="note-view-btn-icon" /> <span>Edit Note</span>
      </button>
      <button className="delete-note" onClick={handleDeleteNote}>
        <Delete className="note-view-btn-icon" /> <span>Delete Note</span>
      </button>
    </div>
  );
}

NoteViewButtons.propTypes = {
  setOpenTaskDialog: PropTypes.func,
  setOpenEditModal: PropTypes.func,
  handleDeleteNote: PropTypes.func,
};
