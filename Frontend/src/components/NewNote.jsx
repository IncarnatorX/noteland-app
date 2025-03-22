import { useContext } from "react";
import { NotesContext } from "../context/NotesContext.js";
import notify from "../toasts/WarningToast.js";
import { toast } from "react-toastify";

const NewNote = () => {
  const { refreshNotes, setRefreshNotes, setNewNote, setPlaceholder } =
    useContext(NotesContext);

  const handleCreateNewNote = async (event) => {
    event.preventDefault();
    const { title, content } = event.target.elements;

    if (title.value?.trim() === "" || content.value?.trim() === "") {
      notify("Title and content are required to create a note.");
      return;
    }

    const noteData = Object.fromEntries(new FormData(event.target));

    try {
      const response = await fetch(
        "http://localhost:8080/api/notes/create-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        }
      );

      if (!response.ok) {
        throw new Error("Something wen't wrong.");
      }

      const data = await response.json();
      const { message } = data;
      toast.success(message);
      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error("Error while creating a new note: ", error.message);
      toast.error("Unable to create a new note: ", error.message);
    }

    event.target.reset();
  };

  function handleCancelNoteButton() {
    setNewNote(false);
    setPlaceholder(true);
  }
  return (
    <>
      <form className="new-note" onSubmit={handleCreateNewNote}>
        <input
          type="text"
          id="input-title"
          placeholder="Note Title"
          name="title"
        />
        <textarea
          id="input-content"
          rows="10"
          cols="30"
          placeholder="Note description"
          name="content"
        ></textarea>
        <div className="btns">
          <button type="submit" className="create-note">
            Create Note
          </button>
          <button
            type="button"
            className="cancel-note"
            onClick={handleCancelNoteButton}
          >
            Cancel Note
          </button>
        </div>
      </form>
    </>
  );
};

export default NewNote;
