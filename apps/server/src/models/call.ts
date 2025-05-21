import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/database";
import Tag from "@models/tag";
import Task from "@models/task";
import { type CallAttributes, type CallInput } from "@internal-types/call";

class Call extends Model<CallAttributes, CallInput> implements CallAttributes {
  declare id: number;
  declare name: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associations with tags
  declare getTags: () => Promise<Tag[]>;
  declare setTags: (tags: Tag[]) => Promise<void>;
  declare addTag: (tag: Tag) => Promise<void>;
  declare removeTag: (tag: Tag) => Promise<void>;

  // Association with tasks
  declare getTasks: () => Promise<Task[]>;
  declare setTasks: (tasks: Task[]) => Promise<void>;
  declare addTask: (task: Task) => Promise<void>;
  declare removeTask: (task: Task) => Promise<void>;
}

Call.init(
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
    tableName: "calls",
    modelName: "Call",
    timestamps: true,
  },
);

export default Call;
