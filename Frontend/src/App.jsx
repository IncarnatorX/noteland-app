import { useEffect, useState, useRef } from "react";
import { NotesContext } from "./context/NotesContext";
import MainSection from "./components/MainSection";
import Sidebar from "./components/Sidebar";
import AuthComponent from "./components/AuthComponent";
import NewNoteIcon from "./components/NewNoteIcon";
// import "./App.css";
import "./styles/mobile.css";
import "./styles/tab.css";
import "./styles/desktop.css";

function App() {
  const [user, setUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [allNotes, setAllNotes] = useState([]);
  const [refreshNotes, setRefreshNotes] = useState(false);

  const [placeholder, setPlaceholder] = useState(true);
  const [newNote, setNewNote] = useState(false);
  const [currentSelectedNote, setCurrentSelectedNote] = useState({});
  const [currentSelectedNoteID, setCurrentSelectedNoteID] = useState(0);
  const [noteView, setNoteView] = useState(false);

  const [openAuthComponent, setOpenAuthComponent] = useState(false);

  const authComponentRef = useRef(null);

  useEffect(() => {
    async function fetchAllNotes() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/notes/get-user-notes`,
        {
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        const { notes } = data;
        setAllNotes(notes);
      } else {
        setAllNotes([]);
      }
    }

    fetchAllNotes();
  }, [refreshNotes]);

  useEffect(() => {
    if (!userLoggedIn) return;

    (async function () {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/get-user`,
          { method: "GET", credentials: "include" }
        );
        const data = await response.json();

        if (!data.success) {
          setUser(null);
        }

        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    })();
  }, [userLoggedIn]);

  useEffect(() => {
    if (currentSelectedNoteID) {
      setCurrentSelectedNote(() =>
        allNotes?.find((note) => note.id === currentSelectedNoteID)
      );
    }
  }, [allNotes, currentSelectedNoteID]);

  return (
    <NotesContext.Provider
      value={{
        user,
        setUser,
        userLoggedIn,
        setUserLoggedIn,
        openAuthComponent,
        setOpenAuthComponent,
        authComponentRef,
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
        <AuthComponent />
        {user && !noteView && !newNote && <NewNoteIcon />}
      </div>
    </NotesContext.Provider>
  );
}

export default App;
