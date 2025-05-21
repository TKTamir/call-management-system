import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/database";
import Task from "@models/task";
import { TagAttributes, TagInput } from "@internal-types/tag";

class Tag extends Model<TagAttributes, TagInput> implements TagAttributes {
  declare id: number;
  declare name: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Association with tasks
  declare getSuggestedTasks: () => Promise<Task[]>;
  declare setSuggestedTasks: (tasks: Task[]) => Promise<void>;
  declare addSuggestedTask: (task: Task) => Promise<void>;
  declare removeSuggestedTask: (task: Task) => Promise<void>;
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
