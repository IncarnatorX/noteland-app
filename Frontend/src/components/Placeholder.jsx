import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

const Placeholder = () => {
  const { allNotes } = useContext(NotesContext);

  return (
    <div className="placeholder">
      <img src="./folder.png" alt="Folder Image" />
      {allNotes.length > 0 ? (
        <h3>PICK A NOTE TO VIEW</h3>
      ) : (
        <>
          <h3>NO NOTES FOUND</h3>
          <p>ADD SOME NOTES BY CLICKING New Note FROM THE LEFT.</p>
        </>
      )}
    </div>
  );
};

export default Placeholder;
