import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

const NewNoteIcon = () => {
  const { setNewNote, setPlaceholder, setNoteView } = useContext(NotesContext);

  const handleNewNoteButton = () => {
    setNewNote(true);
    setPlaceholder(false);
    setNoteView(false);
  };

  return (
    <div className="new-note-icon">
      <img
        src="/plus.png"
        alt="Plus icon"
        loading="lazy"
        className="plus-icon"
        title="New Note"
        onClick={handleNewNoteButton}
      />
    </div>
  );
};

export default NewNoteIcon;
