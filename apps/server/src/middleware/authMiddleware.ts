import { Response, NextFunction, Request } from "express";
import { verifyAccessToken } from "../utils/auth";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(401).json({ message: "Invalid token." });
    return;
  }

  req.user = decoded;
  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  authenticate(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin role required." });
    }
  });
};
