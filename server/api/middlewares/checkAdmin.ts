// server/api/middlewares/checkAdmin.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const checkAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès interdit." });
  }
  next();
};
