import { Optional } from "sequelize";

export interface CallAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CallInput
  extends Optional<CallAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface CallOutput extends Required<CallAttributes> {}
