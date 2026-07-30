import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {z} from "zod";
import {DatabaseModule} from "./database.module.js";
import {AuthModule} from "./auth/auth.module.js";
import {ProjectsModule} from "./projects/projects.module.js";
import {TasksModule} from "./tasks/tasks.module.js";
import {UsersModule} from "./users/users.module.js";
const env=z.object({DATABASE_URL:z.string(),JWT_SECRET:z.string().min(32),PORT:z.coerce.number().default(4000),CLIENT_URL:z.string().default("http://localhost:5173")});
@Module({imports:[ConfigModule.forRoot({isGlobal:true,validate:v=>env.parse(v)}),DatabaseModule,AuthModule,ProjectsModule,TasksModule,UsersModule]})
export class AppModule{}
