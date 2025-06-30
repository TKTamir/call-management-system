import { Router } from "express";
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagController";
import {
  getTagSuggestedTasks,
  addSuggestedTaskToTag,
} from "../controllers/tagTaskController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";
import { deleteSuggestedTask } from "../controllers/taskController";

const router = Router();

// Tag-Task relationships
router.get("/:tagId/suggested-tasks", authenticate, getTagSuggestedTasks);
router.post("/:tagId/suggested-tasks", requireAdmin, addSuggestedTaskToTag);

// Public tag viewing (both users and admins need these)
router.get("/", authenticate, getAllTags);
router.get("/:id", authenticate, getTagById);

// Admin-only tag management
router.post("/", requireAdmin, createTag);
router.put("/:id", requireAdmin, updateTag);
router.delete("/:id", requireAdmin, deleteTag);

export default router;
