import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
export class AppError extends Error {
  constructor(public status: number, message: string, public details?: unknown) { super(message); }
}
export const notFound: RequestHandler = (_req, _res, next) => next(new AppError(404, "Route not found"));
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) return res.status(422).json({ message: "Validation failed", errors: err.flatten() });
  if (err instanceof AppError) return res.status(err.status).json({ message: err.message, details: err.details });
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") return res.status(409).json({ message: "A record with this value already exists" });
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
};
