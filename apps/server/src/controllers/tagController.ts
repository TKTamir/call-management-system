import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import Tag from "@models/tag";
import { createHandler } from "@utils/routeHandler";

// Get all tags
// Responds with all tags both for the Admin view and the User view
const getAllTagsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const tags = await Tag.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({
    success: true,
    data: tags,
  });
  return;
};

// Get tag by ID
// Used for development purposes
const getTagByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  const tag = await Tag.findByPk(id);

  if (!tag) {
    res.status(404).json({
      success: false,
      message: "Tag not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: tag,
  });
  return;
};

// Create new tag
// Used by the Admin in the Admin view to create tags
const createTagHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({
      success: false,
      message: "Tag name is required",
    });
    return;
  }

  const tag = await Tag.create({ name });

  // Socket.io emit for live updates
  // io.emit('tagCreated', tag);

  res.status(201).json({
    success: true,
    data: tag,
  });
  return;
};

// Update tag
// Used by the Admin to rename tags in the Admin view
const updateTagHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Tag name is required",
    });
    return;
  }

  const tag = await Tag.findByPk(id);

  if (!tag) {
    res.status(404).json({
      success: false,
      message: "Tag not found",
    });
    return;
  }

  const existingTag = await Tag.findOne({
    where: {
      name: name.trim(),
      id: { [Op.ne]: id },
    },
  });

  if (existingTag) {
    res
      .status(400)
      .json({ success: false, message: "Tag with this name already exists" });
    return;
  }

  await tag.update({ name });

  // Socket.io emit for live updates
  // io.emit('tagUpdated', {
  //   tag
  // });

  res.status(200).json({
    success: true,
    data: tag,
  });
  return;
};

export const getAllTags = createHandler(getAllTagsHandler);
export const getTagById = createHandler(getTagByIdHandler);
export const createTag = createHandler(createTagHandler);
export const updateTag = createHandler(updateTagHandler);
