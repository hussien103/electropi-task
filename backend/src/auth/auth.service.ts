import {ConflictException,Injectable,UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
export const credentials=z.object({email:z.string().email().toLowerCase(),password:z.string().min(8).max(72)});
export const registration=credentials.extend({name:z.string().trim().min(2).max(80)});
@Injectable()
export class AuthService{
 constructor(private db:PrismaService,private jwt:JwtService){}
 private result(user:{id:string;name:string;email:string;role:any}){return{user,token:this.jwt.sign({id:user.id,role:user.role})}}
 async register(input:unknown){
  const {password,...data}=registration.parse(input);
  if(await this.db.user.findUnique({where:{email:data.email}}))throw new ConflictException("Email already registered");
  return this.result(await this.db.user.create({data:{...data,passwordHash:await bcrypt.hash(password,12)},select:{id:true,name:true,email:true,role:true}}));
 }
 async login(input:unknown){
  const data=credentials.parse(input),found=await this.db.user.findUnique({where:{email:data.email}});
  if(!found||!await bcrypt.compare(data.password,found.passwordHash))throw new UnauthorizedException("Invalid email or password");
  return this.result(found);
 }
 async me(id:string){return this.db.user.findUniqueOrThrow({where:{id},select:{id:true,name:true,email:true,role:true,createdAt:true}})}
}
