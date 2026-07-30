import {Controller,Get,Query,UseGuards} from "@nestjs/common";
import {ApiBearerAuth,ApiTags} from "@nestjs/swagger";
import {Role} from "@prisma/client";
import {AuthGuard,Roles} from "../auth/auth.guard.js";
import {PrismaService} from "../prisma.service.js";
@ApiTags("Users") @ApiBearerAuth() @UseGuards(AuthGuard) @Controller("users")
export class UsersController{
 constructor(private db:PrismaService){}
 @Get() @Roles(Role.ADMIN) list(@Query("search")search=""){const q=search.slice(0,100);return this.db.user.findMany({where:q?{OR:[{name:{contains:q,mode:"insensitive"}},{email:{contains:q,mode:"insensitive"}}]}:{},select:{id:true,name:true,email:true,role:true},take:50,orderBy:{name:"asc"}})}
}
