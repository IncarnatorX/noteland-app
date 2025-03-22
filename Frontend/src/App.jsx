import { useEffect, useState } from "react";
import MainSection from "./components/MainSection";
import Sidebar from "./components/Sidebar";
import { NotesContext } from "./context/NotesContext";
import "./App.css";

function App() {
  const [allNotes, setAllNotes] = useState([]);
  const [refreshNotes, setRefreshNotes] = useState(false);

  const [placeholder, setPlaceholder] = useState(true);
  const [newNote, setNewNote] = useState(false);
  const [currentSelectedNote, setCurrentSelectedNote] = useState({});
  const [currentSelectedNoteID, setCurrentSelectedNoteID] = useState(0);
  const [noteView, setNoteView] = useState(false);

  useEffect(() => {
    async function fetchAllNotes() {
      const response = await fetch("http://localhost:8080/api/notes/all-notes");

      if (response.status === 200) {
        const data = await response.json();
        const { payload } = data;
        setAllNotes(payload);
      } else {
        setAllNotes([]);
      }
    }

    fetchAllNotes();
  }, [refreshNotes]);

  useEffect(() => {
    if (currentSelectedNoteID) {
      setCurrentSelectedNote(() =>
        allNotes.find((note) => note.id === currentSelectedNoteID)
      );
    }
  }, [allNotes, currentSelectedNoteID]);

  return (
    <NotesContext.Provider
      value={{
        allNotes,
        setAllNotes,
        placeholder,
        setPlaceholder,
        newNote,
        setNewNote,
        currentSelectedNote,
        setCurrentSelectedNote,
        noteView,
        setNoteView,
        refreshNotes,
        setRefreshNotes,
        currentSelectedNoteID,
        setCurrentSelectedNoteID,
      }}
    >
      <div className="app">
        <Sidebar />
        <MainSection newNote={newNote} placeholder={placeholder} />
      </div>
    </NotesContext.Provider>
  );
}

export default App;
