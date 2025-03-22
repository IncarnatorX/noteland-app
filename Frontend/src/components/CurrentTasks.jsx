import PropTypes from "prop-types";
import { useContext } from "react";
import { toast } from "react-toastify";
import { NotesContext } from "../context/NotesContext";

const CurrentTasks = ({ task }) => {
  const { refreshNotes, setRefreshNotes } = useContext(NotesContext);

  // TASK COMPLETION HANDLER FUNCTION
  async function handleTaskCompletion(id) {
    if (!id) {
      toast.error("Task ID not found..");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/update-task/${id}`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        toast.error("Something wen't wrong while updating the task status.");
        return;
      }
      const data = await response.json();

      const { message } = data;
      toast.success(message);

      setRefreshNotes(!refreshNotes);
    } catch (error) {
      console.error("Error while updating the task: ", error.message);
    }
  }

  return (
    <>
      <div className="curr-task">
        <input
          type="checkbox"
          name="current-task"
          id="current-task"
          className="checkbox"
          onClick={() => handleTaskCompletion(task.id)}
          value={task?.task_name}
        />
        <label>{task?.task_name}</label>
      </div>
    </>
  );
};

CurrentTasks.propTypes = {
  task: PropTypes.object,
};

export default CurrentTasks;
