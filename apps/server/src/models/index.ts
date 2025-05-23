import { sequelize } from "../config/database";
import Tag from "./tag";
import Call from "./call";
import Task from "./task";
import CallTag from "../models/CallTag";
import CallTask from "../models/CallTask";
import TagTask from "../models/TagTask";

const initializeModels = (): void => {
  // Call <-> Task (Many-to-Many through CallTask)
  Call.belongsToMany(Task, {
    through: CallTask,
    foreignKey: "callId",
    otherKey: "taskId",
    as: "tasks",
  });
  Task.belongsToMany(Call, {
    through: CallTask,
    foreignKey: "taskId",
    otherKey: "callId",
    as: "calls",
  });

  // Call <-> Tag (Many-to-Many through CallTag)
  Call.belongsToMany(Tag, {
    through: CallTag,
    foreignKey: "callId",
    otherKey: "tagId",
    as: "tags",
  });
  Tag.belongsToMany(Call, {
    through: CallTag,
    foreignKey: "tagId",
    otherKey: "callId",
    as: "calls",
  });

  // Tag <-> Task (Many-to-Many through TagTask)
  Tag.belongsToMany(Task, {
    through: TagTask,
    foreignKey: "tagId",
    otherKey: "taskId",
    as: "suggestedTasks",
  });
  Task.belongsToMany(Tag, {
    through: TagTask,
    foreignKey: "taskId",
    otherKey: "tagId",
    as: "relatedTags",
  });

  // Junction model associations
  Call.hasMany(CallTask, { foreignKey: "callId" });
  CallTask.belongsTo(Call, { foreignKey: "callId" });
  Task.hasMany(CallTask, { foreignKey: "taskId" });
  CallTask.belongsTo(Task, { foreignKey: "taskId" });

  Call.hasMany(CallTag, { foreignKey: "callId" });
  CallTag.belongsTo(Call, { foreignKey: "callId" });
  Tag.hasMany(CallTag, { foreignKey: "tagId" });
  CallTag.belongsTo(Tag, { foreignKey: "tagId" });

  Tag.hasMany(TagTask, { foreignKey: "tagId" });
  TagTask.belongsTo(Tag, { foreignKey: "tagId" });
  Task.hasMany(TagTask, { foreignKey: "taskId" });
  TagTask.belongsTo(Task, { foreignKey: "taskId" });
};

const syncDatabase = async (force = false): Promise<void> => {
  try {
    initializeModels();
    await sequelize.sync({ force });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
    throw error;
  }
};

export { sequelize, initializeModels, syncDatabase };
