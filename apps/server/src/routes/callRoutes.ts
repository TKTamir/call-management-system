import { Router } from "express";
import {
  getAllCalls,
  getCallById,
  createCall,
} from "@controllers/callController";
import { addTagsToCall, getCallTags } from "@controllers/callTagController";
import {
  getCallTasks,
  addTaskToCall,
  updateCallTaskStatus,
} from "@controllers/callTaskController";
import { authenticate } from "@middleware/authMiddleware";

const router = Router();

// All call routes require authentication
router.use(authenticate);

// Call-Task management
router.get("/:callId/tasks", getCallTasks);
router.post("/:callId/tasks", addTaskToCall);
router.put("/:callId/tasks/:taskId", updateCallTaskStatus);

// Call-Tag management
router.post("/:callId/tags", addTagsToCall);
router.get("/:callId/tags", getCallTags);

// Call management
router.get("/", getAllCalls);
router.get("/:id", getCallById);
router.post("/", createCall);

export default router;
