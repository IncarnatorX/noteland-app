import { useContext, useEffect, useRef } from "react";
import { NotesContext } from "../context/NotesContext";
import { VITE_BACKEND_URL } from "../utils/constants.js";
import notify from "../toasts/WarningToast.js";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const TaskCreator = ({ openTaskDialog, setOpenTaskDialog }) => {
  const taskRef = useRef(null);
  const dialogRef = useRef(null);

  // CONTEXT
  const { refreshNotes, setRefreshNotes, currentSelectedNote } =
    useContext(NotesContext);

  useEffect(() => {
    const ab = new AbortController();
    const signal = ab.signal;

    function handleEscDialogClose(event) {
      if (event.key === "Escape") {
        setOpenTaskDialog(false);
      }
    }

    if (openTaskDialog) {
      dialogRef.current?.showModal();
      document.addEventListener("keydown", handleEscDialogClose, { signal });
    } else {
      dialogRef.current?.close();
    }

    return () => ab.abort();
  }, [openTaskDialog, setOpenTaskDialog]);

  // FUNCTION HANDLE TASK SUBMISSION
  const handleCreateTaskSubmission = async (event) => {
    event.preventDefault();

    const { current } = taskRef;

    current.focus();

    if (current.value === "") {
      notify("Task field cannot be empty");
      return;
    }

    const taskData = Object.fromEntries(new FormData(event.target));

    event.target.reset();

    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/notes/create-task/${currentSelectedNote.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
          credentials: "include",
        }
      );

      const data = await response.json();

      toast.success(data.message);

      setOpenTaskDialog(false);
      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error("Error while creating task: ", error.message);
      toast.error("Error while creating task");
    }
  };

  return (
    <dialog ref={dialogRef} className="task-creator-dialog">
      <form
        method="dialog"
        className="task-creator"
        onSubmit={handleCreateTaskSubmission}
      >
        <h3>Enter new Task:</h3>
        <input
          type="text"
          placeholder="Task Name"
          id="task-input"
          name="task_name"
          ref={taskRef}
        />
        <button className="create-task-btn" type="submit">
          Create Task
        </button>
      </form>
    </dialog>
  );
};

TaskCreator.propTypes = {
  openTaskDialog: PropTypes.bool,
  setOpenTaskDialog: PropTypes.func,
};

export default TaskCreator;
