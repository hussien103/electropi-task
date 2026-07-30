import { Router } from "express";
import { Prisma } from "@prisma/client";
import { db } from "../db.js";
import { authenticate } from "../auth.js";
import { id, taskSchema } from "../validation.js";
import { requireProjectAccess } from "../access.js";
import { AppError } from "../errors.js";
import { emitProject } from "../socket.js";
export const tasksRouter=Router({mergeParams:true});
tasksRouter.use(authenticate);
const include={creator:{select:{id:true,name:true}},assignee:{select:{id:true,name:true,email:true}}} as const;
tasksRouter.get("/",async(req,res)=>{
  const projectId=id.parse(req.params.projectId); await requireProjectAccess(projectId,req.user!);
  const page=Math.max(1,Number(req.query.page)||1),limit=Math.min(100,Math.max(1,Number(req.query.limit)||50));
  const sort=["createdAt","dueDate","title","priority","status"].includes(String(req.query.sort))?String(req.query.sort):"createdAt";
  const order=req.query.order==="asc"?"asc":"desc";
  const where:Prisma.TaskWhereInput={projectId};
  if(req.query.status) where.status=String(req.query.status) as never;
  if(req.query.priority) where.priority=String(req.query.priority) as never;
  if(req.query.assigneeId) where.assigneeId=String(req.query.assigneeId);
  if(req.query.search) where.OR=[{title:{contains:String(req.query.search).slice(0,100),mode:"insensitive"}},{description:{contains:String(req.query.search).slice(0,100),mode:"insensitive"}}];
  const [items,total]=await db.$transaction([db.task.findMany({where,include,orderBy:{[sort]:order},skip:(page-1)*limit,take:limit}),db.task.count({where})]);
  res.json({items,page,limit,total,pages:Math.ceil(total/limit)});
});
tasksRouter.post("/",async(req,res)=>{
  const projectId=id.parse(req.params.projectId); await requireProjectAccess(projectId,req.user!);
  const data=taskSchema.parse(req.body);
  if(data.assigneeId&&!await db.projectMember.findUnique({where:{projectId_userId:{projectId,userId:data.assigneeId}}})) throw new AppError(422,"Assignee must be a project member");
  const task=await db.task.create({data:{...data,projectId,creatorId:req.user!.id},include});
  emitProject(projectId,"task:created",task); res.status(201).json(task);
});
tasksRouter.get("/:taskId",async(req,res)=>{
  const projectId=id.parse(req.params.projectId),taskId=id.parse(req.params.taskId); await requireProjectAccess(projectId,req.user!);
  const task=await db.task.findFirst({where:{id:taskId,projectId},include:{...include,auditLogs:{include:{user:{select:{id:true,name:true}}},orderBy:{createdAt:"desc"}}}});
  if(!task) throw new AppError(404,"Task not found"); res.json(task);
});
tasksRouter.patch("/:taskId",async(req,res)=>{
  const projectId=id.parse(req.params.projectId),taskId=id.parse(req.params.taskId); await requireProjectAccess(projectId,req.user!);
  const current=await db.task.findFirst({where:{id:taskId,projectId}}); if(!current) throw new AppError(404,"Task not found");
  const data=taskSchema.partial().parse(req.body);
  if(data.assigneeId&&!await db.projectMember.findUnique({where:{projectId_userId:{projectId,userId:data.assigneeId}}})) throw new AppError(422,"Assignee must be a project member");
  const task=await db.$transaction(async tx=>{
    const updated=await tx.task.update({where:{id:taskId},data,include});
    if(data.status&&data.status!==current.status) await tx.auditLog.create({data:{taskId,userId:req.user!.id,fromStatus:current.status,toStatus:data.status}});
    return updated;
  });
  emitProject(projectId,"task:updated",task); res.json(task);
});
tasksRouter.delete("/:taskId",async(req,res)=>{
  const projectId=id.parse(req.params.projectId),taskId=id.parse(req.params.taskId); await requireProjectAccess(projectId,req.user!);
  const found=await db.task.findFirst({where:{id:taskId,projectId}}); if(!found) throw new AppError(404,"Task not found");
  await db.task.delete({where:{id:taskId}}); emitProject(projectId,"task:deleted",{id:taskId}); res.status(204).end();
});
