import { Role } from "@prisma/client";
import { db } from "./db.js";
import { AppError } from "./errors.js";
export async function requireProjectAccess(projectId: string, user: { id: string; role: Role }) {
  const project = await db.project.findFirst({ where: { id: projectId, OR: [{ creatorId: user.id }, { members: { some: { userId: user.id } } }] } });
  if (!project) throw new AppError(404, "Project not found or inaccessible");
  return project;
}
export async function requireProjectAdmin(projectId: string, user: { id: string; role: Role }) {
  if (user.role !== Role.ADMIN) throw new AppError(403, "Admin access required");
  const project = await db.project.findFirst({ where: { id: projectId, OR: [{ creatorId: user.id }, { members: { some: { userId: user.id } } }] } });
  if (!project) throw new AppError(404, "Project not found or inaccessible");
  return project;
}
