export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  email: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TokenPayload {
  id: number;
  role?: "user" | "admin";
  iat?: number;
  exp?: number;
}
