import { Request, Response, NextFunction } from "express";
import { AppError } from "@internal-types/error";

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error("Unhandled error:", err);
  const status = err.statusCode ?? 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
