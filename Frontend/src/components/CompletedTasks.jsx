import PropTypes from "prop-types";

const CompletedTasks = ({ task }) => {
  return (
    <>
      <div className="finish-task">
        <span className="span-check">{task?.task_name}</span>
      </div>
    </>
  );
};

CompletedTasks.propTypes = {
  task: PropTypes.object,
};

export default CompletedTasks;
