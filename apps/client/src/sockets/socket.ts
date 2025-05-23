import { io, Socket } from "socket.io-client";

//TODO: Move the Interfaces to a different dir

export interface TagAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskAttributes {
  id: number;
  name: string;
  isSuggested?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CallTaskAttributes {
  callId: number;
  taskId: number;
  taskStatus: "Open" | "In Progress" | "Completed";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CallAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the events interface for type safety
export interface ServerToClientEvents {
  // Tag events
  tagCreated: (tag: TagAttributes) => void;
  tagUpdated: (tag: TagAttributes) => void;

  // Task events
  taskCreated: (task: TaskAttributes) => void;
  taskUpdated: (task: TaskAttributes) => void;

  // Call events
  callCreated: (call: CallAttributes) => void;
  callTagsAdded: (data: { callId: number; tagIds: number[] }) => void;
  callTaskAdded: (data: { callId: number; task: TaskAttributes }) => void;
  callTaskStatusUpdated: (data: {
    callId: number;
    taskId: number;
    taskStatus: string;
    callTask: CallTaskAttributes;
  }) => void;

  // Tag-Task association events
  tagSuggestedTaskAdded: (data: { tagId: number; taskId: number }) => void;
}

export interface ClientToServerEvents {
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
