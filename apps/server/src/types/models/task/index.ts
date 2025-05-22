import { Optional } from "sequelize";

export interface TaskAttributes {
  id: number;
  name: string;
  isSuggested?: boolean
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskInput
  extends Optional<
    TaskAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

export interface TaskOutput extends Required<TaskAttributes> {}
