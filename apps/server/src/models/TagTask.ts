import { DataTypes, Model } from "sequelize";
import { sequelize } from "@config/database";
import Tag from "@models/tag";
import Task from "@models/task";
import {
  type TagTaskAttributes,
  type TagTaskInput,
} from "@internal-types/models/tag-task";

class TagTask
  extends Model<TagTaskAttributes, TagTaskInput>
  implements TagTaskAttributes
{
  declare tagId: number;
  declare taskId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TagTask.init(
  {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    taskId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Task,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "tag_task",
    modelName: "TagTask",
    timestamps: true,
  },
);

export default TagTask;
