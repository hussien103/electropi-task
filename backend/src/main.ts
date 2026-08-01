import "reflect-metadata";
import {NestFactory} from "@nestjs/core";
import {IoAdapter} from "@nestjs/platform-socket.io";
import {SwaggerModule,DocumentBuilder} from "@nestjs/swagger";
import helmet from "helmet";
import {AppModule} from "./app.module.js";
import {HttpExceptionFilter} from "./http-exception.filter.js";
import {corsOrigin} from "./cors.js";
async function bootstrap(){
 const app=await NestFactory.create(AppModule);
 const express=app.getHttpAdapter().getInstance();
 express.disable("etag");
 express.use((_request:any,response:any,next:()=>void)=>{response.setHeader("Cache-Control","no-store, no-cache, must-revalidate, private");response.setHeader("Pragma","no-cache");response.setHeader("Expires","0");next()});
 express.get("/",(_request:any,response:any)=>response.status(200).json({name:"TeamFlow API",status:"ok",documentation:"/api/docs",openapi:"/api/docs-json"}));
 express.get("/health",(_request:any,response:any)=>response.status(200).json({status:"ok"}));
 app.useWebSocketAdapter(new IoAdapter(app));
 app.setGlobalPrefix("api");app.enableCors({origin:corsOrigin});app.use(helmet());app.useGlobalFilters(new HttpExceptionFilter());
 const config=new DocumentBuilder().setTitle("TeamFlow API").setDescription("JWT-secured team task board API").setVersion("1.0").addBearerAuth().build();
 SwaggerModule.setup("api/docs",app,SwaggerModule.createDocument(app,config));
 await app.listen(process.env.PORT||4000);
 console.log(`TeamFlow API listening on http://localhost:${process.env.PORT||4000}`);
}
bootstrap();
