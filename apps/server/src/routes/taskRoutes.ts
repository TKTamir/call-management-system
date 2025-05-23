import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  getSuggestedTasks,
  createSuggestedTask,
  updateSuggestedTask,
} from "../controllers/taskController";
import { getSuggestedTasksForTags } from "../controllers/tagTaskController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Suggested tasks (users need to view these for call management)
router.get("/suggested", authenticate, getSuggestedTasks);
router.post("/suggested", requireAdmin, createSuggestedTask);
router.put("/suggested/:id", requireAdmin, updateSuggestedTask);

// Get suggested tasks for multiple tags (used by users in call management)
router.post("/suggested/by-tags", authenticate, getSuggestedTasksForTags);

// Development/debugging routes (admin only)
router.get("/", requireAdmin, getAllTasks);
router.get("/:id", requireAdmin, getTaskById);

export default router;
