// server/api/middlewares/checkAuth.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/auth.js";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtUserPayload;

    req.user = decoded;
  } catch {
    req.user = null;
  }

  next();
};
