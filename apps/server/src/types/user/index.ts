export interface TokenPayload {
  id: number;
  role?: "user" | "admin";
  iat?: number;
  exp?: number;
}
