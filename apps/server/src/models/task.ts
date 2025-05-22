import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/database";
import {
  type TaskAttributes,
  type TaskInput,
} from "@internal-types/models/task";

class Task extends Model<TaskAttributes, TaskInput> implements TaskAttributes {
  declare id: number;
  declare name: string;
  declare isSuggested: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
    isSuggested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
