import "reflect-metadata";
import {NestFactory} from "@nestjs/core";
import {SwaggerModule,DocumentBuilder} from "@nestjs/swagger";
import helmet from "helmet";
import {AppModule} from "./app.module.js";
import {HttpExceptionFilter} from "./http-exception.filter.js";
async function bootstrap(){
 const app=await NestFactory.create(AppModule);
 app.setGlobalPrefix("api");app.enableCors({origin:process.env.CLIENT_URL||"http://localhost:5173"});app.use(helmet());app.useGlobalFilters(new HttpExceptionFilter());
 const config=new DocumentBuilder().setTitle("TeamFlow API").setDescription("JWT-secured team task board API").setVersion("1.0").addBearerAuth().build();
 SwaggerModule.setup("api/docs",app,SwaggerModule.createDocument(app,config));
 await app.listen(process.env.PORT||4000);
 console.log(`TeamFlow API listening on http://localhost:${process.env.PORT||4000}`);
}
bootstrap();
