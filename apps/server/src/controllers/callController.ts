import { NextFunction, Request, Response } from "express";
import Call from "@models/call";
import { createHandler } from "@utils/routeHandler";

// Get all calls
// Used to get all calls to be displayed in the User view
const getAllCallsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const calls = await Call.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: calls,
  });
  return;
};

// Get call by ID
// Used in the User view when needing to assign tags, manage tasks
const getCallByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  const call = await Call.findByPk(id);

  if (!call) {
    res.status(404).json({
      success: false,
      message: "Call not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: call,
  });
  return;
};

// Create new call
// Used in the User view by the User to create calls
const createCallHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({
      success: false,
      message: "Call name is required",
    });
    return;
  }

  const call = await Call.create({ name });

  // Socket.io emit for live updates
  // io.emit('callCreated', call);

  res.status(201).json({
    success: true,
    data: call,
  });
  return;
};

export const getAllCalls = createHandler(getAllCallsHandler);
export const getCallById = createHandler(getCallByIdHandler);
export const createCall = createHandler(createCallHandler);
