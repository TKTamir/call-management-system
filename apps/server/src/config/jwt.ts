import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

if (!JWT_REFRESH_SECRET) {
  throw new Error("Missing JWT_REFRESH_SECRET environment variable");
}

export const JWT_SECRET_STRICT = JWT_SECRET as string;
export const JWT_REFRESH_SECRET_STRICT = JWT_REFRESH_SECRET as string;