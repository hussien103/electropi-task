import {Body,Controller,Delete,Get,HttpCode,Param,Patch,Post,Query,Req,UseGuards} from "@nestjs/common";
import {ApiBearerAuth,ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard.js";
import {TasksService} from "./tasks.service.js";
@ApiTags("Tasks") @ApiBearerAuth() @UseGuards(AuthGuard) @Controller("projects/:projectId/tasks")
export class TasksController{
 constructor(private service:TasksService){}
 @Get() list(@Param("projectId")p:string,@Req()r:any,@Query()q:any){return this.service.list(p,r.user,q)}
 @Post() create(@Param("projectId")p:string,@Req()r:any,@Body()b:unknown){return this.service.create(p,r.user,b)}
 @Get(":id") get(@Param("projectId")p:string,@Param("id")id:string,@Req()r:any){return this.service.get(p,id,r.user)}
 @Patch(":id") update(@Param("projectId")p:string,@Param("id")id:string,@Req()r:any,@Body()b:unknown){return this.service.update(p,id,r.user,b)}
 @Delete(":id") @HttpCode(204) remove(@Param("projectId")p:string,@Param("id")id:string,@Req()r:any){return this.service.remove(p,id,r.user)}
}
