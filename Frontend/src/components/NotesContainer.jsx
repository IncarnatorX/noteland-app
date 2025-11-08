import { useContext, useRef } from "react";
import { NotesContext } from "../context/NotesContext";
import { useIsMobile } from "../hooks/use-mobile";

export default function NotesContainer() {
  const {
    user,
    allNotes,
    setCurrentSelectedNote,
    setCurrentSelectedNoteID,
    setNewNote,
    setPlaceholder,
    setNoteView,
    setNotesContainer,
  } = useContext(NotesContext);

  const notesContainerRef = useRef();

  const isMobile = useIsMobile();

  const renderNoteView = (note) => {
    setCurrentSelectedNote(note);
    setCurrentSelectedNoteID(note.id);
    setNewNote(false);
    setPlaceholder(false);
    setNoteView(true);
    isMobile && setNotesContainer(false);
    // handleNotesContainer();
  };

  return (
    <div className="notes-container" ref={notesContainerRef}>
      {allNotes &&
        user &&
        allNotes.map((note) => {
          return (
            <div
              key={crypto.randomUUID()}
              className="note"
              onClick={() => renderNoteView(note)}
            >
              <h4 className="note-title">{note.title}</h4>
              <div className="separator"></div>
              <p className="note-content">{note.content}</p>
            </div>
          );
        })}
    </div>
  );
}
