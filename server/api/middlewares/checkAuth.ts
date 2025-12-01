import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Type pour étendre req.user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};