import { rateLimit } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,
  message: "Too many requests, try again later",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: "Too many login attempts, try again later",
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: "API rate limit exceeded",
});
