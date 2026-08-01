import {ForbiddenException,Injectable,NotFoundException,UnprocessableEntityException} from "@nestjs/common";
import {Role} from "@prisma/client";
import {z} from "zod";
import {PrismaService} from "../prisma.service.js";
import type {AuthUser} from "../auth/auth.guard.js";
const projectDto=z.object({name:z.string().trim().min(2).max(100),description:z.string().trim().max(1000).default("")});
const memberEmail=z.string().email().toLowerCase();
@Injectable()
export class ProjectsService{
 constructor(private db:PrismaService){}
 private access(id:string,user:AuthUser){return{id,OR:[{creatorId:user.id},{members:{some:{userId:user.id}}}]}}
 async requireAccess(id:string,user:AuthUser){const p=await this.db.project.findFirst({where:this.access(id,user)});if(!p)throw new NotFoundException("Project not found or inaccessible");return p}
 async requireAdmin(id:string,user:AuthUser){if(user.role!==Role.ADMIN)throw new ForbiddenException("Admin access required");return this.requireAccess(id,user)}
 async requireOwnerOrAdmin(id:string,user:AuthUser){const project=await this.requireAccess(id,user);if(project.creatorId!==user.id&&user.role!==Role.ADMIN)throw new ForbiddenException("Only the project creator or an Admin can modify this project");return project}
 async list(user:AuthUser,q:any){const search=String(q.search||"").slice(0,100),page=Math.max(1,+q.page||1),limit=Math.min(50,Math.max(1,+q.limit||12));const where={OR:[{creatorId:user.id},{members:{some:{userId:user.id}}}],...(search?{name:{contains:search,mode:"insensitive" as const}}:{})};const[items,total]=await this.db.$transaction([this.db.project.findMany({where,include:{_count:{select:{tasks:true,members:true}}},orderBy:{updatedAt:"desc"},skip:(page-1)*limit,take:limit}),this.db.project.count({where})]);return{items,total,page,limit,pages:Math.ceil(total/limit)}}
 async create(user:AuthUser,body:unknown){const data=projectDto.parse(body);return this.db.project.create({data:{...data,creatorId:user.id,members:{create:{userId:user.id}}}})}
 async get(id:string,user:AuthUser){await this.requireAccess(id,user);return this.db.project.findUnique({where:{id},include:{creator:{select:{id:true,name:true,email:true}},members:{include:{user:{select:{id:true,name:true,email:true,role:true}}}}}})}
 async update(id:string,user:AuthUser,body:unknown){await this.requireOwnerOrAdmin(id,user);return this.db.project.update({where:{id},data:projectDto.partial().parse(body)})}
 async remove(id:string,user:AuthUser){await this.requireOwnerOrAdmin(id,user);await this.db.project.delete({where:{id}})}
 async addMemberByEmail(id:string,user:AuthUser,email:string){await this.requireOwnerOrAdmin(id,user);const target=await this.db.user.findUnique({where:{email:memberEmail.parse(email)},select:{id:true,name:true,email:true,role:true}});if(!target)throw new NotFoundException("No registered user found with that email");await this.db.projectMember.upsert({where:{projectId_userId:{projectId:id,userId:target.id}},create:{projectId:id,userId:target.id},update:{}});return target}
 async removeMember(id:string,user:AuthUser,userId:string){const p=await this.requireOwnerOrAdmin(id,user);if(p.creatorId===userId)throw new UnprocessableEntityException("Project creator cannot be removed");await this.db.projectMember.deleteMany({where:{projectId:id,userId}})}
 async members(id:string,user:AuthUser){await this.requireAccess(id,user);const rows=await this.db.projectMember.findMany({where:{projectId:id},include:{user:{select:{id:true,name:true,email:true,role:true}}}});return rows.map(x=>x.user)}
}
