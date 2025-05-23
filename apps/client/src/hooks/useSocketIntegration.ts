import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "./useSocket";
import { api } from "../store/api";
import type { Tag, Task, Call, CallTask } from "../types";

//TODO: Remove Console.logs

// Hook that integrates Socket.IO events with RTK Query cache updates
// This ensures real-time updates are reflected in the UI automatically
export const useSocketIntegration = () => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("🔄 Setting up Socket.IO + RTK Query integration...");

    // TAG EVENTS
    const handleTagCreated = (tag: Tag) => {
      console.log("🏷️ Tag created via socket:", tag);

      dispatch(api.util.invalidateTags([{ type: "Tag", id: "LIST" }]));
    };

    const handleTagUpdated = (tag: Tag) => {
      console.log("🏷️ Tag updated via socket:", tag);

      dispatch(api.util.invalidateTags(["Tag", "CallTag", "Call"]));
    };

    // TASK EVENTS
    const handleTaskCreated = (task: Task) => {
      console.log("📋 Task created via socket:", task);

      dispatch(
        api.util.invalidateTags([
          { type: "Task", id: "LIST" },
          { type: "SuggestedTask", id: "LIST" },
        ]),
      );
    };

    const handleTaskUpdated = (task: Task) => {
      console.log("📋 Task updated via socket:", task);

      dispatch(
        api.util.invalidateTags([
          { type: "Task", id: "LIST" },
          { type: "Task", id: task.id },
          { type: "SuggestedTask", id: "LIST" },
          { type: "CallTask", id: "LIST" }, // Task names might be shown
        ]),
      );
    };

    // CALL EVENTS
    const handleCallCreated = (call: Call) => {
      console.log("📞 Call created via socket:", call);

      dispatch(api.util.invalidateTags([{ type: "Call", id: "LIST" }]));
    };

    const handleCallTagsAdded = (data: {
      callId: number;
      tagIds: number[];
    }) => {
      console.log("📞🏷️ Call tags added via socket:", data);

      // Invalidate the specific call's tags cache
      dispatch(api.util.invalidateTags([{ type: "CallTag", id: data.callId }]));

      // Update the call's cache if it exists
      dispatch(api.util.invalidateTags([{ type: "Call", id: data.callId }]));
    };

    const handleCallTaskAdded = (data: { callId: number; task: Task }) => {
      console.log("📞📋 Call task added via socket:", data);

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
      console.log("📞📋 Call task status updated via socket:", data);

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
      console.log("🏷️📋 Tag suggested task added via socket:", data);

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

    console.log("✅ Socket.IO + RTK Query integration active");

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up Socket.IO + RTK Query integration...");
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
