import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_REFRESH_SECRET_STRICT, JWT_SECRET_STRICT } from "@config/jwt";
import { TokenPayload } from "@internal-types/user";

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

export const generateAccessToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET_STRICT, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET_STRICT, {
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
  userId: number,
  role: string,
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};
