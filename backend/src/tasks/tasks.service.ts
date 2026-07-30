import {Injectable,NotFoundException,UnprocessableEntityException} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {z} from "zod";
import {PrismaService} from "../prisma.service.js";
import {ProjectsService} from "../projects/projects.service.js";
import {TasksGateway} from "./tasks.gateway.js";
import type {AuthUser} from "../auth/auth.guard.js";
const taskDto=z.object({title:z.string().trim().min(2).max(150),description:z.string().trim().max(3000).default(""),status:z.enum(["TODO","IN_PROGRESS","DONE"]).default("TODO"),priority:z.enum(["LOW","MEDIUM","HIGH","URGENT"]).default("MEDIUM"),dueDate:z.coerce.date(),assigneeId:z.string().cuid().nullable().optional()});
const include={creator:{select:{id:true,name:true}},assignee:{select:{id:true,name:true,email:true}}} as const;
@Injectable()
export class TasksService{
 constructor(private db:PrismaService,private projects:ProjectsService,private gateway:TasksGateway){}
 private async validateAssignee(projectId:string,userId?:string|null){if(userId&&!await this.db.projectMember.findUnique({where:{projectId_userId:{projectId,userId}}}))throw new UnprocessableEntityException("Assignee must be a project member")}
 async list(projectId:string,user:AuthUser,q:any){await this.projects.requireAccess(projectId,user);const page=Math.max(1,+q.page||1),limit=Math.min(100,Math.max(1,+q.limit||50)),sort=["createdAt","dueDate","title","priority","status"].includes(q.sort)?q.sort:"createdAt",order=q.order==="asc"?"asc":"desc";const where:Prisma.TaskWhereInput={projectId,...(q.status?{status:q.status}:{}),...(q.priority?{priority:q.priority}:{}),...(q.assigneeId?{assigneeId:q.assigneeId}:{}),...(q.search?{OR:[{title:{contains:String(q.search).slice(0,100),mode:"insensitive"}},{description:{contains:String(q.search).slice(0,100),mode:"insensitive"}}]}:{})};const[items,total]=await this.db.$transaction([this.db.task.findMany({where,include,orderBy:{[sort]:order},skip:(page-1)*limit,take:limit}),this.db.task.count({where})]);return{items,total,page,limit,pages:Math.ceil(total/limit)}}
 async create(projectId:string,user:AuthUser,body:unknown){await this.projects.requireAccess(projectId,user);const data=taskDto.parse(body);await this.validateAssignee(projectId,data.assigneeId);const task=await this.db.task.create({data:{...data,projectId,creatorId:user.id},include});this.gateway.emit(projectId,"task:created",task);return task}
 async get(projectId:string,id:string,user:AuthUser){await this.projects.requireAccess(projectId,user);const task=await this.db.task.findFirst({where:{id,projectId},include:{...include,auditLogs:{include:{user:{select:{id:true,name:true}}},orderBy:{createdAt:"desc"}}}});if(!task)throw new NotFoundException("Task not found");return task}
 async update(projectId:string,id:string,user:AuthUser,body:unknown){await this.projects.requireAccess(projectId,user);const current=await this.db.task.findFirst({where:{id,projectId}});if(!current)throw new NotFoundException("Task not found");const data=taskDto.partial().parse(body);await this.validateAssignee(projectId,data.assigneeId);const task=await this.db.$transaction(async tx=>{const updated=await tx.task.update({where:{id},data,include});if(data.status&&data.status!==current.status)await tx.auditLog.create({data:{taskId:id,userId:user.id,fromStatus:current.status,toStatus:data.status}});return updated});this.gateway.emit(projectId,"task:updated",task);return task}
 async remove(projectId:string,id:string,user:AuthUser){await this.get(projectId,id,user);await this.db.task.delete({where:{id}});this.gateway.emit(projectId,"task:deleted",{id})}
}
