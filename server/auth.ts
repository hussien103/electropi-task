import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { config } from "./config.js";
import { AppError } from "./errors.js";
export const signToken = (user: { id: string; role: Role }) => jwt.sign(user, config.JWT_SECRET, { expiresIn: "8h" });
export const authenticate: RequestHandler = (req, _res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return next(new AppError(401, "Authentication required"));
  try { req.user = jwt.verify(token, config.JWT_SECRET) as { id: string; role: Role }; next(); }
  catch { next(new AppError(401, "Invalid or expired token")); }
};
export const adminOnly: RequestHandler = (req, _res, next) => req.user?.role === Role.ADMIN ? next() : next(new AppError(403, "Admin access required"));
