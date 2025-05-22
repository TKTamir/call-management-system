import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/database";
import Call from "@models/call";
import Tag from "@models/tag";
import {
  type TaskAttributes,
  type TaskInput,
} from "@internal-types/models/task";

class Task extends Model<TaskAttributes, TaskInput> implements TaskAttributes {
  declare id: number;
  declare name: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Association with calls
  declare getCalls: () => Promise<Call[]>;
  declare setCalls: (calls: Call[]) => Promise<void>;
  declare addCall: (call: Call) => Promise<void>;
  declare removeCall: (call: Call) => Promise<void>;

  // Association with tags
  declare getRelatedTags: () => Promise<Tag[]>;
  declare setRelatedTags: (tags: Tag[]) => Promise<void>;
  declare addRelatedTag: (tag: Tag) => Promise<void>;
  declare removeRelatedTag: (tag: Tag) => Promise<void>;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tasks",
    modelName: "Task",
    timestamps: true,
  },
);

export default Task;
