import { Router } from "express";
import { getAllTagTaskAssociations } from "../controllers/tagTaskController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// All admin routes require admin privileges
router.use(requireAdmin);

// Tag-Task association management
router.get("/tag-task-associations", getAllTagTaskAssociations);

export default router;
