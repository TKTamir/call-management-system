import { Request, Response, NextFunction } from "express";
import Tag from "../models/tag";
import Task from "../models/task";
import TagTask from "../models/TagTask";
import { sequelize } from "../config/database";
import { createHandler } from "../utils/routeHandler";
import { socketService } from "../sockets/socket";

// Get all suggested tasks for a specific tag
// Used when the Admin clicks on a specific tag in the Admin view, used to render linked suggested tasks
const getTagSuggestedTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { tagId } = req.params;

  const tag = await Tag.findByPk(tagId);

  if (!tag) {
    res.status(404).json({
      success: false,
      message: "Tag not found",
    });
    return;
  }

  const suggestedTasks = await tag.getSuggestedTasks();

  res.status(200).json({
    success: true,
    data: suggestedTasks,
  });
  return;
};

// Add suggested task to tag
// Used by the Admin in the Admin view to link a sugggested task to a tag
const addSuggestedTaskToTagHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { tagId } = req.params;
  const { taskId } = req.body;

  if (!taskId) {
    res.status(400).json({
      success: false,
      message: "Task ID is required",
    });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const tag = await Tag.findByPk(tagId, { transaction });

    if (!tag) {
      await transaction.rollback();
      res.status(404).json({
        success: false,
        message: "Tag not found",
      });
      return;
    }

    const task = await Task.findOne({
      where: {
        id: taskId,
        isSuggested: true,
      },
      transaction,
    });

    if (!task) {
      await transaction.rollback();
      res.status(404).json({
        success: false,
        message: "Suggested task not found",
      });
      return;
    }

    // Check if association already exists
    const existingAssociation = await TagTask.findOne({
      where: {
        tagId,
        taskId,
      },
      transaction,
    });

    if (existingAssociation) {
      await transaction.rollback();
      res.status(400).json({
        success: false,
        message: "Task is already linked to this tag",
      });
      return;
    }

    await tag.addSuggestedTask(task, { transaction });
    await transaction.commit();

    // Socket.io emit for live updates
    socketService.emitTagSuggestedTaskAdded({
      tagId: Number(tagId),
      taskId,
    });

    res.status(200).json({
      success: true,
      message: "Suggested task added to tag successfully",
    });
    return;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get suggested tasks for multiple tags (for call suggestions)
// Used in the User view when a call has tags, used to render the list of suggested tasks
const getSuggestedTasksForTagsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { tagIds } = req.body;

  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    res.status(400).json({
      success: false,
      message: "Tag IDs array is required",
    });
    return;
  }

  const tags = await Tag.findAll({
    where: {
      id: tagIds,
    },
    include: [
      {
        association: "suggestedTasks",
        attributes: ["id", "name"],
      },
    ],
  });

  // Flatten and deduplicate suggested tasks
  const suggestedTasksMap = new Map();

  tags.forEach((tag) => {
    tag.suggestedTasks?.forEach((task) => {
      suggestedTasksMap.set(task.id, task);
    });
  });

  const uniqueSuggestedTasks = Array.from(suggestedTasksMap.values());

  res.status(200).json({
    success: true,
    data: uniqueSuggestedTasks,
  });
  return;
};

// Get all tag-task associations
// Used in the Admin view, when the Admin clicks on a tag, it renders the list of suggested tasks assigned to the tag
const getAllTagTaskAssociationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const associations = await TagTask.findAll({
    include: [
      {
        model: Tag,
        attributes: ["id", "name"],
      },
      {
        model: Task,
        attributes: ["id", "name"],
        where: {
          isSuggested: true,
        },
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: associations,
  });
  return;
};

export const getTagSuggestedTasks = createHandler(getTagSuggestedTasksHandler);
export const addSuggestedTaskToTag = createHandler(
  addSuggestedTaskToTagHandler,
);
export const getSuggestedTasksForTags = createHandler(
  getSuggestedTasksForTagsHandler,
);
export const getAllTagTaskAssociations = createHandler(
  getAllTagTaskAssociationsHandler,
);
