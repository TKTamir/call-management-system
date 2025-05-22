import { Request, Response, NextFunction } from "express";
import Call from "@models/call";
import Tag from "@models/tag";
import { sequelize } from "@config/database";
import { createHandler } from "@utils/routeHandler";

// Add tag to call
// Used by the User in the User view to assign a tag or multiple tags to a call
const addTagsToCallHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { callId } = req.params;
  const { tagIds } = req.body;

  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    res.status(400).json({
      success: false,
      message: "Tag IDs array is required",
    });
    return;
  }

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

    const tags = await Tag.findAll({
      where: {
        id: tagIds,
      },
      transaction,
    });

    if (tags.length !== tagIds.length) {
      await transaction.rollback();
      res.status(400).json({
        success: false,
        message: "One or more tags not found",
      });
      return;
    }

    await call.addTags(tags, { transaction });
    await transaction.commit();

    // Socket.io emit for live updates
    // io.emit('callTagsAdded', {
    // callId,
    // tagIds
    // });

    res.status(200).json({
      success: true,
      message: "Tags added to call successfully",
    });
    return;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get Call Tags
// Used to get all tags that are assigned to a call
const getCallTagsHandler = async (
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

  const tags = await call.getTags();

  res.status(200).json({
    success: true,
    data: tags,
  });
  return;
};

export const addTagsToCall = createHandler(addTagsToCallHandler);
export const getCallTags = createHandler(getCallTagsHandler);
