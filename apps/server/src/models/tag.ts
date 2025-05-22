import { Model, DataTypes, Transaction } from "sequelize";
import { sequelize } from "@config/database";
import Task from "@models/task";
import { type TagAttributes, type TagInput } from "@internal-types/models/tag";

class Tag extends Model<TagAttributes, TagInput> implements TagAttributes {
  declare id: number;
  declare name: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associated data property
  declare suggestedTasks?: Task[];

  // Task associations
  declare addSuggestedTask: (
    task: Task,
    options?: { transaction?: Transaction },
  ) => Promise<void>;
  declare getSuggestedTasks: () => Promise<Task[]>;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "tags",
    modelName: "Tag",
    timestamps: true,
  },
);

export default Tag;
