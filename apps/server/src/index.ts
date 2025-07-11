import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as http from "node:http";
import { testConnection } from "./config/database";
import { syncDatabase } from "./models";
import { errorMiddleware } from "./middleware/errorMiddleware";
import {
  apiLimiter,
  authLimiter,
  globalLimiter,
} from "./middleware/rateLimiterMiddleware";
import { socketService } from "./sockets/socket";
import authRoutes from "./routes/authRoutes";
import callRoutes from "./routes/callRoutes";
import tagRoutes from "./routes/tagRoutes";
import taskRoutes from "./routes/taskRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

// Initialize Socket.io
socketService.initialize(server);

app.use(
  cors({
    origin: "https://call-management-system.netlify.app",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Rate Limiters
app.use(globalLimiter);
app.use("/api", apiLimiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Call Management API is running");
});

// Get Socket.io status
app.get("/api/status", (req: Request, res: Response) => {
  const stats = socketService.getConnectionStats();
  res.json({
    success: true,
    server: "running",
    connections: stats,
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  try {
    await testConnection();

    await syncDatabase(false);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
