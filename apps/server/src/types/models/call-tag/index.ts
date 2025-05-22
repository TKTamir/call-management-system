import { Optional } from "sequelize";

export interface CallTagAttributes {
  callId: number;
  tagId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CallTagInput
  extends Optional<CallTagAttributes, "createdAt" | "updatedAt"> {}

export interface CallTagOutput extends Required<CallTagAttributes> {}
