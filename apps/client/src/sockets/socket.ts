import { io, Socket } from "socket.io-client";
import type { Call, CallTask, Tag, Task } from "../types";

// Define the events interface for type safety
interface ServerToClientEvents {
  // Tag events
  tagCreated: (tag: Tag) => void;
  tagUpdated: (tag: Tag) => void;

  // Task events
  taskCreated: (task: Task) => void;
  taskUpdated: (task: Task) => void;

  // Call events
  callCreated: (call: Call) => void;
  callTagsAdded: (data: { callId: number; tagIds: number[] }) => void;
  callTaskAdded: (data: { callId: number; task: Task }) => void;
  callTaskStatusUpdated: (data: {
    callId: number;
    taskId: number;
    taskStatus: "Open" | "In Progress" | "Completed";
    callTask: CallTask;
  }) => void;

  // Tag-Task association events
  tagSuggestedTaskAdded: (data: { tagId: number; taskId: number }) => void;
}

interface ClientToServerEvents {
  // Currently no client-to-server events needed
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  console.warn("SERVER_URL is not defined! Falling back to localhost.");
}

export const socket: SocketType = io(SERVER_URL || "http://localhost:3000", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection event handlers
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});
