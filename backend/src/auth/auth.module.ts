import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AuthController} from "./auth.controller.js";
import {AuthService} from "./auth.service.js";
import {AuthGuard} from "./auth.guard.js";
@Module({imports:[JwtModule.registerAsync({inject:[ConfigService],useFactory:(c:ConfigService)=>({secret:c.getOrThrow("JWT_SECRET"),signOptions:{expiresIn:"8h"}})})],controllers:[AuthController],providers:[AuthService,AuthGuard],exports:[AuthGuard,JwtModule]})
export class AuthModule{}
