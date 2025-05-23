import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { TagAttributes } from "../types/models/tag";
import { TaskAttributes } from "../types/models/task";
import { CallAttributes } from "../types/models/call";
import { CallTaskAttributes } from "../types/models/call-task";

interface ServerToClientEvents {
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

// Empty interfaces are needed for Socket.IO's type system
interface ClientToServerEvents {
  // Currently no client-to-server events needed
}

export interface InterServerEvents {
  // No inter-server events needed
}

export interface SocketData {
  // Currently no per-socket data needed
}

class SocketService {
  private io: SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > | null = null;

  public initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5174",
        methods: ["GET", "POST"],
        credentials: true,
      },

      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true,
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
      });

      // Handle connection errors
      socket.on("error", (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  public getIO(): SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > {
    if (!this.io) {
      throw new Error("Socket.io not initialized. Call initialize() first.");
    }
    return this.io;
  }

  // Tag-related events
  public emitTagCreated(tag: TagAttributes): void {
    this.getIO().emit("tagCreated", tag);
  }

  public emitTagUpdated(tag: TagAttributes): void {
    this.getIO().emit("tagUpdated", tag);
  }

  // Task-related events
  public emitTaskCreated(task: TaskAttributes): void {
    this.getIO().emit("taskCreated", task);
  }

  public emitTaskUpdated(task: TaskAttributes): void {
    this.getIO().emit("taskUpdated", task);
  }

  // Call-related events
  public emitCallCreated(call: CallAttributes): void {
    this.getIO().emit("callCreated", call);
  }

  public emitCallTagsAdded(data: { callId: number; tagIds: number[] }): void {
    this.getIO().emit("callTagsAdded", data);
  }

  public emitCallTaskAdded(data: {
    callId: number;
    task: TaskAttributes;
  }): void {
    this.getIO().emit("callTaskAdded", data);
  }

  public emitCallTaskStatusUpdated(data: {
    callId: number;
    taskId: number;
    taskStatus: string;
    callTask: CallTaskAttributes;
  }): void {
    this.getIO().emit("callTaskStatusUpdated", data);
  }

  // Tag-Task association events
  public emitTagSuggestedTaskAdded(data: {
    tagId: number;
    taskId: number;
  }): void {
    this.getIO().emit("tagSuggestedTaskAdded", data);
  }

  public getConnectionStats(): { total: number } {
    const io = this.getIO();
    return {
      total: io.sockets.sockets.size,
    };
  }
}

export const socketService = new SocketService();
