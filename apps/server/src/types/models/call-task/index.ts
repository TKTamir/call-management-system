import { Optional } from "sequelize";

export interface CallTaskAttributes {
  callId: number;
  taskId: number;
  taskStatus: "Open" | "In Progress" | "Completed";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CallTaskInput
  extends Optional<
    CallTaskAttributes,
    "createdAt" | "updatedAt" | "taskStatus"
  > {}

export interface CallTaskOutput extends Required<CallTaskAttributes> {}
