import { useContext, useRef } from "react";
import { NotesContext } from "../context/NotesContext.js";

const Sidebar = () => {
  const {
    setNewNote,
    setPlaceholder,
    allNotes,
    setNoteView,
    setCurrentSelectedNote,
    setCurrentSelectedNoteID,
  } = useContext(NotesContext);
  const notesContainerRef = useRef(null);

  const handleNewNoteButton = () => {
    setNewNote(true);
    setPlaceholder(false);
    setNoteView(false);
    const { current } = notesContainerRef;
    if (current.style.display === "flex") {
      current.style.display = "none";
    }
  };

  function goHome() {
    setNewNote(false);
    setPlaceholder(true);
    setNoteView(false);
  }

  function handleNotesContainer() {
    const { current } = notesContainerRef;
    current.classList.toggle("active"); // Toggle the active class
  }

  const renderNoteView = (note) => {
    setCurrentSelectedNote(note);
    setCurrentSelectedNoteID(note.id);
    setNewNote(false);
    setPlaceholder(false);
    setNoteView(true);
    handleNotesContainer();
  };

  return (
    <section className="sidebar">
      <div className="logo">
        <img src="./logo-main.png" alt="Logo" className="app-logo" />
        <img
          src="./list.png"
          alt="Menu Icon"
          className="menu-icon"
          onClick={handleNotesContainer}
        />
        <h1 onClick={goHome}>NOTE LAND</h1>
      </div>

      <div className="notes-container" ref={notesContainerRef}>
        {allNotes &&
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

      <button className="new-note-btn" onClick={handleNewNoteButton}>
        New Note
      </button>
    </section>
  );
};

export default Sidebar;
