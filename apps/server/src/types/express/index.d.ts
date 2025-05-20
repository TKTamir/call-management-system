// eslint-disable-next-line
import * as express from "express";
import { TokenPayload } from "@internal-types/user";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
