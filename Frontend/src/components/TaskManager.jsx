import CompletedTasks from "./CompletedTasks";
import CurrentTasks from "./CurrentTasks";
import PropTypes from "prop-types";

const TaskManager = ({ tasks }) => {
  return (
    <div className="task-manager">
      <p className="task-list-title">TASKS LISTS</p>

      {/* ONGOING TASKS */}
      <p style={{ opacity: "0.5" }}>Your Pending Tasks</p>
      {tasks.length > 0 &&
        tasks.map(
          (task) =>
            !task?.completed && (
              <div className="ongoing-tasks" key={task?.id}>
                <CurrentTasks task={task} />
              </div>
            )
        )}

      <hr />

      {/* COMPLETED TASKS */}
      <p style={{ opacity: "0.5" }}>Completed Tasks</p>
      {tasks.length > 0 &&
        tasks.map(
          (task) =>
            task?.completed && (
              <div className="completed-tasks" key={task?.id}>
                <CompletedTasks task={task} />
              </div>
            )
        )}
    </div>
  );
};

TaskManager.propTypes = {
  tasks: PropTypes.array,
};
export default TaskManager;
