import { Router } from "express";
import { db } from "../db.js";
import { authenticate, adminOnly } from "../auth.js";
import { id, projectSchema } from "../validation.js";
import { requireProjectAccess, requireProjectAdmin } from "../access.js";
import { AppError } from "../errors.js";
export const projectsRouter = Router();
projectsRouter.use(authenticate);
projectsRouter.get("/", async (req, res) => {
  const q = typeof req.query.search === "string" ? req.query.search.slice(0, 100) : "";
  const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const where = { OR: [{ creatorId: req.user!.id }, { members: { some: { userId: req.user!.id } } }], ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}) };
  const [items, total] = await db.$transaction([
    db.project.findMany({ where, include: { _count: { select: { tasks: true, members: true } } }, orderBy: { updatedAt: "desc" }, skip: (page-1)*limit, take: limit }),
    db.project.count({ where })
  ]);
  res.json({ items, page, limit, total, pages: Math.ceil(total/limit) });
});
projectsRouter.post("/", adminOnly, async (req, res) => {
  const data = projectSchema.parse(req.body);
  res.status(201).json(await db.project.create({ data: { ...data, creatorId: req.user!.id, members: { create: { userId: req.user!.id } } } }));
});
projectsRouter.get("/:projectId", async (req, res) => {
  const projectId = id.parse(req.params.projectId); await requireProjectAccess(projectId, req.user!);
  res.json(await db.project.findUnique({ where: { id: projectId }, include: { members: { include: { user: { select: { id:true,name:true,email:true,role:true } } } } } }));
});
projectsRouter.patch("/:projectId", adminOnly, async (req, res) => {
  const projectId = id.parse(req.params.projectId); await requireProjectAdmin(projectId, req.user!);
  res.json(await db.project.update({ where: { id: projectId }, data: projectSchema.partial().parse(req.body) }));
});
projectsRouter.delete("/:projectId", adminOnly, async (req, res) => {
  const projectId = id.parse(req.params.projectId); await requireProjectAdmin(projectId, req.user!);
  await db.project.delete({ where: { id: projectId } }); res.status(204).end();
});
projectsRouter.post("/:projectId/members", adminOnly, async (req, res) => {
  const projectId = id.parse(req.params.projectId), userId = id.parse(req.body.userId); await requireProjectAdmin(projectId, req.user!);
  const user = await db.user.findUnique({ where: { id: userId } }); if (!user) throw new AppError(404, "User not found");
  await db.projectMember.upsert({ where: { projectId_userId: { projectId,userId } }, create: { projectId,userId }, update: {} });
  res.status(201).json({ projectId,userId });
});
projectsRouter.delete("/:projectId/members/:userId", adminOnly, async (req, res) => {
  const projectId=id.parse(req.params.projectId), userId=id.parse(req.params.userId); const project=await requireProjectAdmin(projectId,req.user!);
  if (project.creatorId===userId) throw new AppError(422,"Project creator cannot be removed");
  await db.projectMember.deleteMany({ where:{projectId,userId} }); res.status(204).end();
});
projectsRouter.get("/:projectId/users", async (req,res) => {
  const projectId=id.parse(req.params.projectId); await requireProjectAccess(projectId,req.user!);
  const rows=await db.projectMember.findMany({where:{projectId},include:{user:{select:{id:true,name:true,email:true,role:true}}}});
  res.json(rows.map(x=>x.user));
});
