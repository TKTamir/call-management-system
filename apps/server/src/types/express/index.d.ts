// eslint-disable-next-line
import * as express from "express";
import { type TokenPayload } from "@internal-types/models/user";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
