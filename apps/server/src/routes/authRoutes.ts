import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  getCurrentUser,
} from "../controllers/authController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.post("/register", authenticate, requireAdmin, register);
router.get("/me", authenticate, getCurrentUser);

export default router;
