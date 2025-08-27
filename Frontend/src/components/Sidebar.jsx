import { useContext, useRef } from "react";
import { NotesContext } from "../context/NotesContext.js";
import { toast } from "react-toastify";

const Sidebar = () => {
  const {
    user,
    setUser,
    setUserLoggedIn,
    setOpenAuthComponent,
    setNewNote,
    setPlaceholder,
    allNotes,
    setAllNotes,
    setNoteView,
    setCurrentSelectedNote,
    setCurrentSelectedNoteID,
  } = useContext(NotesContext);

  const notesContainerRef = useRef(null);

  // const handleNewNoteButton = () => {
  //   setNewNote(true);
  //   setPlaceholder(false);
  //   setNoteView(false);
  // };

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

  async function handleUserLogOut() {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/logout`;

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error in fetch request");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        setUserLoggedIn(false);
        setAllNotes([]);
        setNoteView(false);
        setPlaceholder(true);
        localStorage.removeItem("noteland_user");
      }
    } catch (error) {
      console.error("Error occurred in handleUserLogOut:", error);
      toast.error("Error while logging out...");
    }
  }

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
      {user ? (
        <button className="auth-btn" onClick={handleUserLogOut}>
          Logout
        </button>
      ) : (
        <button className="auth-btn" onClick={() => setOpenAuthComponent(true)}>
          Login
        </button>
      )}
    </section>
  );
};

export default Sidebar;
