import { Request, Response, NextFunction, RequestHandler } from "express";

export const createHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error("Route error:", error);
      next(error);
    }
  };
};
