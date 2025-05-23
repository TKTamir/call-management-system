import React, { useState } from "react";
import { useUpdateCallTaskStatusMutation } from "../../store/api";
import { useErrorHandler } from "../../hooks/useErrorHandler";

interface TaskItemProps {
  id: number;
  callId: number;
  taskId: number;
  name: string;
  taskStatus?: "Open" | "In Progress" | "Completed";
}

const TaskItem: React.FC<TaskItemProps> = ({
  callId,
  taskId,
  name,
  taskStatus = "Open",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updateTaskStatus, { isLoading, error }] =
    useUpdateCallTaskStatusMutation();

  useErrorHandler(error);

  const statusOptions: ("Open" | "In Progress" | "Completed")[] = [
    "Open",
    "In Progress",
    "Completed",
  ];

  const handleStatusChange = async (
    newStatus: "Open" | "In Progress" | "Completed",
  ) => {
    if (newStatus === taskStatus) return;

    try {
      await updateTaskStatus({
        callId,
        taskId,
        data: { taskStatus: newStatus },
      }).unwrap();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-700 border-red-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="border rounded-md p-3 mb-2">
      <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-2">
        <p>{name}</p>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoading}
            className={`border rounded-md px-2 py-1 text-xs cursor-pointer hover:opacity-80 disabled:cursor-not-allowed ${getStatusColor(taskStatus)}`}
          >
            {isLoading ? "Updating..." : taskStatus}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 min-w-24">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                    status === taskStatus ? "bg-gray-50 font-medium" : ""
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;
