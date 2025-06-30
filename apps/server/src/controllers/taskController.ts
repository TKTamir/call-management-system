import { NextFunction, Request, Response } from "express";
import Task from "../models/task";
import { createHandler } from "../utils/routeHandler";
import { socketService } from "../sockets/socket";

// Get all tasks
// Used for development purposes
const getAllTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const tasks = await Task.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: tasks,
  });
  return;
};

// Get task by ID
// Used for development purposes
const getTaskByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  const task = await Task.findByPk(id);

  if (!task) {
    res.status(404).json({ success: false, message: "Task not found" });
    return;
  }

  res.status(200).json({
    success: true,
    data: task,
  });
  return;
};

// Get suggested tasks
// Used to get the list of all suggested tasks for the Admin view
const getSuggestedTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const suggestedTasks = await Task.findAll({
    where: {
      isSuggested: true,
    },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: suggestedTasks,
  });
  return;
};

// Create new task
// Used by the Admin to create new suggested tasks in the Admin view
const createSuggestedTaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Task name is required",
    });
    return;
  }

  const task = await Task.create({
    name,
    isSuggested: true,
  });

  // Socket.io emit for live updates
  socketService.emitTaskCreated(task);

  res.status(201).json({
    success: true,
    data: task,
  });
  return;
};

// Update suggested task
// Used by the Admin to update a suggested task in the Admin view
const updateSuggestedTaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Task name is required",
    });
    return;
  }

  const task = await Task.findByPk(id);

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  if (!task.isSuggested) {
    res.status(400).json({
      success: false,
      message: "Only suggested tasks can be updated",
    });
    return;
  }

  await task.update({ name });

  // Socket.io emit for live updates
  socketService.emitTaskUpdated(task);

  res.status(200).json({
    success: true,
    data: task,
  });
  return;
};

// Delete suggested task
// Used by the Admin to delete suggested tasks in the Admin view
const deleteSuggestedTaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  const task = await Task.findByPk(id);

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  if (!task.isSuggested) {
    res.status(400).json({
      success: false,
      message: "Only suggested tasks can be deleted",
    });
    return;
  }

  await task.destroy();

  res.status(200).json({
    success: true,
    message: "Suggested task deleted successfully",
  });
  return;
};

export const getAllTasks = createHandler(getAllTasksHandler);
export const getTaskById = createHandler(getTaskByIdHandler);
export const getSuggestedTasks = createHandler(getSuggestedTasksHandler);
export const createSuggestedTask = createHandler(createSuggestedTaskHandler);
export const updateSuggestedTask = createHandler(updateSuggestedTaskHandler);
export const deleteSuggestedTask = createHandler(deleteSuggestedTaskHandler);
