import {Body,Controller,Get,Post,Req,UseGuards} from "@nestjs/common";
import {ApiBearerAuth,ApiTags} from "@nestjs/swagger";
import {AuthService} from "./auth.service.js";
import {AuthGuard} from "./auth.guard.js";
@ApiTags("Authentication") @Controller("auth")
export class AuthController{
 constructor(private service:AuthService){}
 @Post("register") register(@Body() body:unknown){return this.service.register(body)}
 @Post("login") login(@Body() body:unknown){return this.service.login(body)}
 @Get("me") @UseGuards(AuthGuard) @ApiBearerAuth() me(@Req() req:any){return this.service.me(req.user.id)}
}
