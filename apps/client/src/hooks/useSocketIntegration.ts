import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "./useSocket";
import { api } from "../store/api";
import type { Task, CallTask } from "../types";

// Hook that integrates Socket.IO events with RTK Query cache updates
// This ensures real-time updates are reflected in the UI automatically
export const useSocketIntegration = () => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // TAG EVENTS
    const handleTagCreated = () => {
      dispatch(api.util.invalidateTags([{ type: "Tag", id: "LIST" }]));
    };

    const handleTagUpdated = () => {
      dispatch(api.util.invalidateTags(["Tag", "CallTag", "Call"]));
    };

    // TASK EVENTS
    const handleTaskCreated = () => {
      dispatch(
        api.util.invalidateTags([
          { type: "Task", id: "LIST" },
          { type: "SuggestedTask", id: "LIST" },
        ]),
      );
    };

    const handleTaskUpdated = (task: Task) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Task", id: "LIST" },
          { type: "Task", id: task.id },
          { type: "SuggestedTask", id: "LIST" },
          { type: "CallTask", id: "LIST" },
        ]),
      );
    };

    // CALL EVENTS
    const handleCallCreated = () => {
      dispatch(api.util.invalidateTags([{ type: "Call", id: "LIST" }]));
    };

    const handleCallTagsAdded = (data: {
      callId: number;
      tagIds: number[];
    }) => {
      // Invalidate the specific call's tags cache
      dispatch(api.util.invalidateTags([{ type: "CallTag", id: data.callId }]));

      // Update the call's cache if it exists
      dispatch(api.util.invalidateTags([{ type: "Call", id: data.callId }]));
    };

    const handleCallTaskAdded = (data: { callId: number; task: Task }) => {
      // Invalidate the specific call's tasks cache
      dispatch(
        api.util.invalidateTags([{ type: "CallTask", id: data.callId }]),
      );

      // Update the call's cache if it exists
      dispatch(api.util.invalidateTags([{ type: "Call", id: data.callId }]));
    };

    const handleCallTaskStatusUpdated = (data: {
      callId: number;
      taskId: number;
      taskStatus: "Open" | "In Progress" | "Completed";
      callTask: CallTask;
    }) => {
      dispatch(
        api.util.invalidateTags([
          { type: "CallTask", id: data.callId },
          { type: "Call", id: data.callId },
        ]),
      );
    };

    // TAG-TASK ASSOCIATION EVENTS
    const handleTagSuggestedTaskAdded = (data: {
      tagId: number;
      taskId: number;
    }) => {
      // Invalidate tag-task associations
      dispatch(
        api.util.invalidateTags([
          { type: "TagTaskAssociation", id: data.tagId },
        ]),
      );
      dispatch(
        api.util.invalidateTags([{ type: "TagTaskAssociation", id: "LIST" }]),
      );
    };

    // Register all socket event listeners
    socket.on("tagCreated", handleTagCreated);
    socket.on("tagUpdated", handleTagUpdated);
    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("callCreated", handleCallCreated);
    socket.on("callTagsAdded", handleCallTagsAdded);
    socket.on("callTaskAdded", handleCallTaskAdded);
    socket.on("callTaskStatusUpdated", handleCallTaskStatusUpdated);
    socket.on("tagSuggestedTaskAdded", handleTagSuggestedTaskAdded);

    // Cleanup function
    return () => {
      socket.off("tagCreated", handleTagCreated);
      socket.off("tagUpdated", handleTagUpdated);
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("callCreated", handleCallCreated);
      socket.off("callTagsAdded", handleCallTagsAdded);
      socket.off("callTaskAdded", handleCallTaskAdded);
      socket.off("callTaskStatusUpdated", handleCallTaskStatusUpdated);
      socket.off("tagSuggestedTaskAdded", handleTagSuggestedTaskAdded);
    };
  }, [socket, isConnected, dispatch]);

  return { isConnected };
};

// Hook to be used in the main App component
export const useRealTimeUpdates = () => {
  return useSocketIntegration();
};
