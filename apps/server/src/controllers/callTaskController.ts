import { Request, Response, NextFunction } from "express";
import Call from "../models/call";
import Task from "../models/task";
import CallTask from "../models/CallTask";
import { sequelize } from "../config/database";
import { createHandler } from "../utils/routeHandler";
import { socketService } from "../sockets/socket";

// Get all tasks for a specific call
// Used in the User view for getting and rendering the existing tasks assigned to a call
const getCallTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { callId } = req.params;

  const call = await Call.findByPk(callId);

  if (!call) {
    res.status(404).json({
      success: false,
      message: "Call not found",
    });
    return;
  }

  const callTasks = await CallTask.findAll({
    where: {
      callId,
    },
    include: [
      {
        model: Task,
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: callTasks,
  });
  return;
};

// Add task to call
// Used in the User view by the User to add a task to a call
const addTaskToCallHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { callId } = req.params;
  const { taskId, taskName, taskStatus = "Open" } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const call = await Call.findByPk(callId, { transaction });

    if (!call) {
      await transaction.rollback();
      res.status(404).json({
        success: false,
        message: "Call not found",
      });
      return;
    }

    let task;

    // If taskId is provided, use existing task (suggested task)
    if (taskId) {
      task = await Task.findByPk(taskId, { transaction });

      if (!task) {
        await transaction.rollback();
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      // Check if task is already assigned to this call
      const existingCallTask = await CallTask.findOne({
        where: {
          callId,
          taskId,
        },
        transaction,
      });

      if (existingCallTask) {
        await transaction.rollback();
        res.status(400).json({
          success: false,
          message: "Task is already assigned to this call",
        });
        return;
      }
    } else {
      // Create new task for this specific call
      if (!taskName) {
        await transaction.rollback();
        res.status(400).json({
          success: false,
          message: "Task name is required when creating a new task",
        });
        return;
      }

      task = await Task.create(
        {
          name: taskName,
          isSuggested: false,
        },
        { transaction },
      );
    }

    await call.addTask(task, {
      through: {
        taskStatus,
      },
      transaction,
    });

    await transaction.commit();

    // Socket.io emit for live updates
    socketService.emitCallTaskAdded({
      callId: Number(callId),
      task,
    });

    res.status(201).json({
      success: true,
      message: "Task added to call successfully",
    });
    return;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateCallTaskStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { callId, taskId } = req.params;
  const { taskStatus } = req.body;

  if (
    !taskStatus ||
    !["Open", "In Progress", "Completed"].includes(taskStatus)
  ) {
    res.status(400).json({
      success: false,
      message: "Valid status is required (Open, In Progress, or Completed)",
    });
    return;
  }

  const callTask = await CallTask.findOne({
    where: {
      callId,
      taskId,
    },
  });

  if (!callTask) {
    res.status(404).json({
      success: false,
      message: "Task assignment not found for this call",
    });
    return;
  }

  // Socket.io emit for live updates
  socketService.emitCallTaskStatusUpdated({
    callId: Number(callId),
    taskId: Number(taskId),
    taskStatus,
    callTask,
  });

  await callTask.update({ taskStatus });

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    data: callTask,
  });
  return;
};

export const getCallTasks = createHandler(getCallTasksHandler);
export const addTaskToCall = createHandler(addTaskToCallHandler);
export const updateCallTaskStatus = createHandler(updateCallTaskStatusHandler);
