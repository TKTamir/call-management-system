import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Call from "../models/call";
import Tag from "../models/tag";
import {
  type CallTagAttributes,
  type CallTagInput,
} from "../types/models/call-tag";

class CallTag
  extends Model<CallTagAttributes, CallTagInput>
  implements CallTagAttributes
{
  declare callId: number;
  declare tagId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CallTag.init(
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
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "call_tag",
    modelName: "CallTag",
    timestamps: true,
  },
);

export default CallTag;
