import { Model, DataTypes, Transaction } from "sequelize";
import { sequelize } from "@config/database";
import Tag from "@models/tag";
import Task from "@models/task";
import {
  type CallAttributes,
  type CallInput,
} from "@internal-types/models/call";

class Call extends Model<CallAttributes, CallInput> implements CallAttributes {
  declare id: number;
  declare name: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associations with tags
  declare addTags: (
    tags: Tag[],
    options?: { transaction?: Transaction },
  ) => Promise<void>;
  declare getTags: () => Promise<Tag[]>;

  // Association with tasks
  declare addTask: (
    task: Task,
    options?: { through?: { taskStatus?: string }; transaction?: Transaction },
  ) => Promise<void>;
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
