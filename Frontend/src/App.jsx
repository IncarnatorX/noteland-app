import { useEffect, useState, useRef } from "react";
import { NotesContext } from "./context/NotesContext";
import { VITE_BACKEND_URL } from "./utils/constants";
import MainSection from "./components/MainSection";
import Sidebar from "./components/Sidebar";
import AuthComponent from "./components/AuthComponent";
import NewNoteIcon from "./components/NewNoteIcon";
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

  const [authenticating, setAuthenticating] = useState(false);

  const authComponentRef = useRef(null);

  useEffect(() => {
    async function initMe() {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/auth/me`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUserLoggedIn(data.isLoggedIn);
        }
      } catch (error) {
        console.error("Error in initMe function", error);
      }
    }

    initMe();
  }, []);

  async function safeFetch(url, signal) {
    const res = await fetch(url, { credentials: "include", signal });
    if (!res.ok) {
      throw new Error(`Failed request: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  useEffect(() => {
    if (!userLoggedIn) return;

    const controller = new AbortController();

    (async function () {
      try {
        const [userResponse, userNotesResponse] = await Promise.all([
          safeFetch(`${VITE_BACKEND_URL}/auth/get-user`, controller.signal),
          safeFetch(
            `${VITE_BACKEND_URL}/notes/get-user-notes`,
            controller.signal
          ),
        ]);

        if (userResponse.success) {
          setUser(userResponse.user);
          setUserLoggedIn(true);
        }

        if (userNotesResponse.success) {
          setAllNotes(userNotesResponse.notes);
        }
      } catch (error) {
        console.error("Error fetching data for the user", error);
        setUser(null);
        setUserLoggedIn(false);
        setAllNotes([]);
      }
    })();

    () => {
      controller.abort();
    };
  }, [refreshNotes, userLoggedIn]);

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
        authenticating,
        setAuthenticating,
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
