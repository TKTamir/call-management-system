import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "@config/database";
import { syncDatabase } from "@models/index";
import { errorMiddleware } from "@middleware/errorMiddleware";
import authRoutes from "@routes/authRoutes";
import callRoutes from "@routes/callRoutes";
import tagRoutes from "@routes/tagRoutes";
import taskRoutes from "@routes/taskRoutes";
import adminRoutes from "@routes/adminRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Call Management API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  try {
    await testConnection();

    await syncDatabase(false);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
