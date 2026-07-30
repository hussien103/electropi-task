import {CanActivate,ExecutionContext,Injectable,SetMetadata,UnauthorizedException,ForbiddenException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {Role} from "@prisma/client";
export const Roles=(...roles:Role[])=>SetMetadata("roles",roles);
export type AuthUser={id:string;role:Role};
@Injectable()
export class AuthGuard implements CanActivate{
 constructor(private jwt:JwtService,private reflector:Reflector){}
 async canActivate(context:ExecutionContext){
  const req=context.switchToHttp().getRequest(),token=req.headers.authorization?.replace(/^Bearer\s+/i,"");
  if(!token)throw new UnauthorizedException("Authentication required");
  try{req.user=await this.jwt.verifyAsync<AuthUser>(token)}catch{throw new UnauthorizedException("Invalid or expired token")}
  const roles=this.reflector.getAllAndOverride<Role[]>("roles",[context.getHandler(),context.getClass()]);
  if(roles&&!roles.includes(req.user.role))throw new ForbiddenException("Insufficient role");
  return true;
 }
}
