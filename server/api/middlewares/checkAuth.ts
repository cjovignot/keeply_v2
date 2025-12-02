// server/api/middlewares/checkAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Étend Request pour inclure req.user
export interface AuthRequest extends Request {
  user?: any;
}

export const checkAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    req.user = null;
    next();
  }
};
