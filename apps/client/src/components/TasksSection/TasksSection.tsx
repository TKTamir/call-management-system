import React from "react";
import Button from "../Button/Button";
import TaskItem from "../TaskItem/TaskItem";
import { type CallTask } from "../../types";

interface TasksSectionProps {
  callId: number;
  tasks: CallTask[];
  setShowTaskModal: (show: boolean) => void;
  setShowSuggestedTasksModal: (show: boolean) => void;
  suggestedTasksCount: number;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  setShowTaskModal,
  setShowSuggestedTasksModal,
  suggestedTasksCount,
}) => {
  return (
    <div className="border rounded-lg p-4 flex-grow">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Tasks</h4>
        <div className="flex gap-2">
          <Button
            buttonText="Custom"
            onClick={() => setShowTaskModal(true)}
            className="px-3 py-1 text-xs"
          />
          <Button
            buttonText={`Suggested (${suggestedTasksCount})`}
            onClick={() => setShowSuggestedTasksModal(true)}
            className="px-3 py-1 text-xs bg-blue-50 hover:bg-blue-100"
          />
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No tasks assigned to this call.
        </p>
      ) : (
        tasks.map((callTask) => (
          <TaskItem
            key={`${callTask.callId}-${callTask.taskId}`}
            id={callTask.taskId}
            callId={callTask.callId}
            taskId={callTask.taskId}
            name={callTask.Task?.name || "Unknown Task"}
            taskStatus={callTask.taskStatus}
          />
        ))
      )}
    </div>
  );
};

export default TasksSection;
