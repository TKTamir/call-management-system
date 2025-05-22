import { Optional } from "sequelize";

export interface TagTaskAttributes {
  tagId: number;
  taskId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TagTaskInput
  extends Optional<TagTaskAttributes, "createdAt" | "updatedAt"> {}

export interface TagTaskOutput extends Required<TagTaskAttributes> {}
