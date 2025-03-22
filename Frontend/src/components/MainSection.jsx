import { useContext } from "react";
import Placeholder from "./Placeholder";
import NewNote from "./NewNote";
import { NotesContext } from "../context/NotesContext";
import NoteView from "./NoteView";

const MainSection = () => {
  const { newNote, placeholder, noteView } = useContext(NotesContext);

  return (
    <section className="main">
      {placeholder && <Placeholder />}
      {newNote && <NewNote />}

      {/* NOTE VIEW */}
      {noteView && <NoteView />}
    </section>
  );
};

export default MainSection;
