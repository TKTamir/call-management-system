import {Optional} from "sequelize";

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  email: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface TokenPayload {
  id: number;
  role?: "user" | "admin";
  iat?: number;
  exp?: number;
}
