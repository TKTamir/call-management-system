import { DataTypes, Model } from "sequelize";
import { sequelize } from "@config/database";
import Call from "@models/call";
import Task from "@models/task";
import {
  type CallTaskAttributes,
  type CallTaskInput,
} from "@internal-types/models/call-task";

class CallTask
  extends Model<CallTaskAttributes, CallTaskInput>
  implements CallTaskAttributes
{
  declare callId: number;
  declare taskId: number;
  declare taskStatus: "Open" | "In Progress" | "Completed";

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CallTask.init(
  {
    callId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Call,
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
    taskStatus: {
      type: DataTypes.ENUM("Open", "In Progress", "Completed"),
      defaultValue: "Open",
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "call_task",
    modelName: "CallTask",
    timestamps: true,
  },
);

export default CallTask;
