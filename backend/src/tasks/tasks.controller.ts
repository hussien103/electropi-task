import {Body,Controller,Delete,Get,HttpCode,Param,Patch,Post,Query,Req,UseGuards} from "@nestjs/common";
import {ApiBearerAuth,ApiBody,ApiOperation,ApiQuery,ApiResponse,ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard.js";
import {TasksService} from "./tasks.service.js";
@ApiTags("Tasks") @ApiBearerAuth() @UseGuards(AuthGuard) @Controller("projects/:projectId/tasks")
export class TasksController{
 constructor(private service:TasksService){}
 @Get() @ApiOperation({summary:"List accessible project tasks with filtering, search, sorting, and pagination"}) @ApiQuery({name:"search",required:false}) @ApiQuery({name:"status",required:false,enum:["TODO","IN_PROGRESS","DONE"]}) @ApiQuery({name:"priority",required:false,enum:["LOW","MEDIUM","HIGH","URGENT"]}) @ApiQuery({name:"assigneeId",required:false}) @ApiQuery({name:"sort",required:false,enum:["createdAt","dueDate","title","priority","status"]}) @ApiQuery({name:"order",required:false,enum:["asc","desc"]}) @ApiQuery({name:"page",required:false,type:Number}) @ApiQuery({name:"limit",required:false,type:Number}) @ApiResponse({status:200,description:"Paginated task result"}) list(@Param("projectId")p:string,@Req()r:any,@Query()q:any){return this.service.list(p,r.user,q)}
 @Post() @ApiOperation({summary:"Create a task (project owner or Admin)"}) @ApiBody({schema:{type:"object",required:["title","dueDate"],properties:{title:{type:"string"},description:{type:"string"},status:{type:"string",enum:["TODO","IN_PROGRESS","DONE"]},priority:{type:"string",enum:["LOW","MEDIUM","HIGH","URGENT"]},dueDate:{type:"string",format:"date-time"},assigneeId:{type:"string",nullable:true}}}}) create(@Param("projectId")p:string,@Req()r:any,@Body()b:unknown){return this.service.create(p,r.user,b)}
 @Get(":id") get(@Param("projectId")p:string,@Param("id")id:string,@Req()r:any){return this.service.get(p,id,r.user)}
 @Get(":id/audit") @ApiOperation({summary:"Get a task's status-change audit history"}) audit(@Param("projectId")p:string,@Param("id")id:string,@Req()r:any){return this.service.audit(p,id,r.user)}
 @Patch(":id") update(@Param("projectId")p:string,@Param("id")id:string,@Req()r:any,@Body()b:unknown){return this.service.update(p,id,r.user,b)}
 @Delete(":id") @HttpCode(204) remove(@Param("projectId")p:string,@Param("id")id:string,@Req()r:any){return this.service.remove(p,id,r.user)}
}
