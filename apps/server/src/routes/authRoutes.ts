import { Router } from "express";
import {
  login,
  logout,
  register,
  refreshToken,
  getCurrentUser,
} from "../controllers/authController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/refresh-token", refreshToken);
// Protected routes
router.get("/me", authenticate, getCurrentUser);

export default router;
