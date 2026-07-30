import {Body,Controller,Delete,Get,HttpCode,Param,Patch,Post,Query,Req,UseGuards} from "@nestjs/common";
import {ApiBearerAuth,ApiTags} from "@nestjs/swagger";
import {Role} from "@prisma/client";
import {AuthGuard,Roles} from "../auth/auth.guard.js";
import {ProjectsService} from "./projects.service.js";
@ApiTags("Projects") @ApiBearerAuth() @UseGuards(AuthGuard) @Controller("projects")
export class ProjectsController{
 constructor(private service:ProjectsService){}
 @Get() list(@Req()r:any,@Query()q:any){return this.service.list(r.user,q)}
 @Post() @Roles(Role.ADMIN) create(@Req()r:any,@Body()b:unknown){return this.service.create(r.user,b)}
 @Get(":id") get(@Param("id")id:string,@Req()r:any){return this.service.get(id,r.user)}
 @Patch(":id") @Roles(Role.ADMIN) update(@Param("id")id:string,@Req()r:any,@Body()b:unknown){return this.service.update(id,r.user,b)}
 @Delete(":id") @Roles(Role.ADMIN) @HttpCode(204) remove(@Param("id")id:string,@Req()r:any){return this.service.remove(id,r.user)}
 @Post(":id/members") @Roles(Role.ADMIN) add(@Param("id")id:string,@Req()r:any,@Body("userId")uid:string){return this.service.addMember(id,r.user,uid)}
 @Delete(":id/members/:userId") @Roles(Role.ADMIN) @HttpCode(204) removeMember(@Param("id")id:string,@Param("userId")uid:string,@Req()r:any){return this.service.removeMember(id,r.user,uid)}
 @Get(":id/users") members(@Param("id")id:string,@Req()r:any){return this.service.members(id,r.user)}
}
