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
  // Sort tasks by status
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { Open: 0, "In Progress": 1, Completed: 2 };
    const aOrder = statusOrder[a.taskStatus || "Open"];
    const bOrder = statusOrder[b.taskStatus || "Open"];
    return aOrder - bOrder;
  });

  return (
    <div className="flex-grow rounded-lg bg-gray-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Tasks</h4>
        <div className="flex gap-2">
          <Button
            buttonText="Custom"
            onClick={() => setShowTaskModal(true)}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md"
          />
          <Button
            children={
              <span className="flex items-center">
                Suggested
                <span className="ml-1.5 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {suggestedTasksCount}
                </span>
              </span>
            }
            onClick={() => setShowSuggestedTasksModal(true)}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
          />
        </div>
      </div>

      <div className="min-h-[30dvh] max-h-96 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-gray-500">No tasks assigned to this call.</p>
          </div>
        ) : (
          sortedTasks.map((callTask) => (
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
    </div>
  );
};

export default TasksSection;
