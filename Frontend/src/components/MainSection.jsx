import { useContext } from "react";
import Placeholder from "./Placeholder";
import NewNote from "./NewNote";
import { NotesContext } from "../context/NotesContext";
import NoteView from "./NoteView";
import { useIsMobile } from "../hooks/use-mobile";
import NotesContainer from "./NotesContainer";

const MainSection = () => {
  const { newNote, placeholder, noteView, notesContainer } =
    useContext(NotesContext);

  const isMobile = useIsMobile();

  // console.log("isMobile", isMobile);

  return (
    <section className="main">
      {placeholder && !isMobile && <Placeholder />}
      {newNote && <NewNote />}
      {isMobile && notesContainer && <NotesContainer />}
      {/* NOTE VIEW */}
      {noteView && <NoteView />}
    </section>
  );
};

export default MainSection;
