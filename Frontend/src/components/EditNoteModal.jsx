import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { VITE_BACKEND_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { NotesContext } from "../context/NotesContext";

export default function EditNoteModal({
  openEditModal,
  setOpenEditModal,
  currentSelectedNote: note,
}) {
  const { refreshNotes, setRefreshNotes, setCurrentSelectedNote } =
    useContext(NotesContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editTitleError, setEditTitleError] = useState("");
  const [editContentError, setEditContentError] = useState("");

  const editNoteDialogRef = useRef(null);

  function openEditNoteDialog() {
    if (editNoteDialogRef?.current) {
      editNoteDialogRef.current.showModal();
    }
  }

  function resetStates() {
    setTitle("");
    setContent("");
    setEditTitleError("");
    setEditContentError("");
    setOpenEditModal(false);
  }

  function handleClose() {
    if (editNoteDialogRef?.current) editNoteDialogRef.current?.close();
    resetStates();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) {
      setEditTitleError("Title is required");
    }
    if (!content) {
      setEditContentError("Content is required");
    }

    const formData = new FormData(e.target);
    formData.append("id", note.id);
    formData.append("user_id", note.user_id);
    const payload = Object.fromEntries(formData);

    // console.log("payload", payload);
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/notes/update-note`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Server didn't respond with a success state.");
      }

      const data = await response.json();
      toast.success(data.message);
      setCurrentSelectedNote(data.data);
      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  }

  useEffect(() => {
    if (!openEditModal) return;

    openEditNoteDialog();
    setTitle(note?.title);
    setContent(note?.content);
  }, [openEditModal, note]);

  //   useEffect(() => {

  //   }, [editContentError, editTitleError]);

  return (
    <dialog ref={editNoteDialogRef} className="edit-note-dialog">
      <form className="edit-note-form" onSubmit={handleSubmit}>
        <h1 className="edit-heading">Edit Note</h1>
        <div className="edit-input-div">
          <label htmlFor="note-title-edit" className="edit-label">
            Title
          </label>
          <input
            id="note-title-edit"
            name="title"
            className="edit-text edit-title"
            // required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (editTitleError) setEditTitleError("");
            }}
          />
          {editTitleError && <p className="edit-error">{editTitleError}</p>}
        </div>
        <div className="edit-input-div">
          <label htmlFor="note-content-edit" className="edit-label">
            Content
          </label>
          <textarea
            name="content"
            id="note-content-edit"
            // required
            className="edit-text edit-content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (editContentError) setEditContentError("");
            }}
          ></textarea>
          {editContentError && <p className="edit-error">{editContentError}</p>}
        </div>
        <div className="edit-btns-div">
          <button className="edit-btn edit-update" type="submit">
            Update
          </button>
          <button
            className="edit-btn edit-cancel"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}

EditNoteModal.propTypes = {
  openEditModal: PropTypes.bool,
  setOpenEditModal: PropTypes.func,
  currentSelectedNote: PropTypes.object,
};
