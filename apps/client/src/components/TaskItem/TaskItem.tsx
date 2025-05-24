import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUpdateCallTaskStatusMutation } from "../../store/api";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import Button from "../Button/Button";

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
      toast.success(`Task status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "border-red-200 bg-red-50 text-red-700 hover:bg-red-100";
      case "In Progress":
        return "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
      case "Completed":
        return "border-green-200 bg-green-50 text-green-700 hover:bg-green-100";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return (
          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" />
          </svg>
        );
      case "In Progress":
        return (
          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
          </svg>
        );
      case "Completed":
        return (
          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-3 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-gray-900">{name}</p>
        <div className="relative">
          <Button
            children={
              <span className="flex items-center">
                {getStatusIcon(taskStatus)}
                {isLoading ? "Updating..." : taskStatus}
              </span>
            }
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoading}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${getStatusColor(taskStatus)}`}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 min-w-[140px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  children={
                    <span className="flex items-center">
                      {getStatusIcon(status)}
                      {status}
                    </span>
                  }
                  onClick={() => handleStatusChange(status)}
                  className={`w-full rounded-none px-3 py-2 text-left text-xs font-medium hover:bg-gray-50 ${
                    status === taskStatus ? "bg-gray-50 font-semibold" : ""
                  } ${status === statusOptions[0] ? "rounded-t-md" : ""} ${
                    status === statusOptions[statusOptions.length - 1]
                      ? "rounded-b-md"
                      : ""
                  }`}
                />
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
