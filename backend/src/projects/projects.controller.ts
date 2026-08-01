import {Body,Controller,Delete,Get,HttpCode,Param,Patch,Post,Query,Req,UseGuards} from "@nestjs/common";
import {ApiBearerAuth,ApiOperation,ApiQuery,ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard.js";
import {ProjectsService} from "./projects.service.js";
@ApiTags("Projects") @ApiBearerAuth() @UseGuards(AuthGuard) @Controller("projects")
export class ProjectsController{
 constructor(private service:ProjectsService){}
 @Get() @ApiOperation({summary:"List accessible projects with search and pagination"}) @ApiQuery({name:"search",required:false}) @ApiQuery({name:"page",required:false,type:Number}) @ApiQuery({name:"limit",required:false,type:Number}) list(@Req()r:any,@Query()q:any){return this.service.list(r.user,q)}
 @Post() create(@Req()r:any,@Body()b:unknown){return this.service.create(r.user,b)}
 @Get(":id") get(@Param("id")id:string,@Req()r:any){return this.service.get(id,r.user)}
 @Patch(":id") update(@Param("id")id:string,@Req()r:any,@Body()b:unknown){return this.service.update(id,r.user,b)}
 @Delete(":id") @HttpCode(204) remove(@Param("id")id:string,@Req()r:any){return this.service.remove(id,r.user)}
 @Post(":id/members") add(@Param("id")id:string,@Req()r:any,@Body("email")email:string){return this.service.addMemberByEmail(id,r.user,email)}
 @Delete(":id/members/:userId") @HttpCode(204) removeMember(@Param("id")id:string,@Param("userId")uid:string,@Req()r:any){return this.service.removeMember(id,r.user,uid)}
 @Get(":id/users") members(@Param("id")id:string,@Req()r:any){return this.service.members(id,r.user)}
}
