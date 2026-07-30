import {ArgumentsHost,Catch,ExceptionFilter,HttpException,HttpStatus} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {ZodError} from "zod";
@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
 catch(error:unknown,host:ArgumentsHost){const response=host.switchToHttp().getResponse();if(error instanceof ZodError)return response.status(422).json({message:"Validation failed",errors:error.flatten()});if(error instanceof HttpException)return response.status(error.getStatus()).json(error.getResponse());if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002")return response.status(409).json({message:"A record with this value already exists"});console.error(error);return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})}
}
