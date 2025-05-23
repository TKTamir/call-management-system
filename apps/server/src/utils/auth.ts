import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_REFRESH_SECRET_STRICT, JWT_SECRET_STRICT } from "../config/jwt";
import { type TokenPayload } from "../types/models/user";

dotenv.config();

const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (id: number, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET_STRICT, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (id: number): string => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET_STRICT, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_STRICT) as JwtPayload;
    if (typeof decoded === "object" && "id" in decoded) {
      return decoded as TokenPayload;
    }
    return null;
  } catch (err) {
    console.error("JWT verification error:", err);
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET_STRICT) as JwtPayload;

    if (typeof decoded === "object" && "id" in decoded) {
      return decoded as TokenPayload;
    }

    return null;
  } catch (error) {
    console.error("JWT refresh token verification error:", error);
    return null;
  }
};

export const generateTokens = (
  id: number,
  role: string,
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken(id, role);
  const refreshToken = generateRefreshToken(id);
  return { accessToken, refreshToken };
};
