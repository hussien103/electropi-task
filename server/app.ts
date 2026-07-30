import "./types.js";
import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { tasksRouter } from "./routes/tasks.js";
import { usersRouter } from "./routes/users.js";
import { errorHandler, notFound } from "./errors.js";
import { openapi } from "./openapi.js";
import { config } from "./config.js";
export const app=express();
app.use(helmet({contentSecurityPolicy:false}),cors({origin:config.CLIENT_URL}),express.json({limit:"100kb"}));
app.use("/api/auth",rateLimit({windowMs:60_000,limit:20,standardHeaders:"draft-8"}),authRouter);
app.use("/api/projects",projectsRouter);
app.use("/api/projects/:projectId/tasks",tasksRouter);
app.use("/api/users",usersRouter);
app.get("/api/health",(_req,res)=>res.json({status:"ok"}));
app.use("/api/docs",swaggerUi.serve,swaggerUi.setup(openapi));
if(process.env.NODE_ENV==="production"){
  const client=path.resolve("dist/client");
  app.use(express.static(client));
  app.get("/{*splat}",(_req,res)=>res.sendFile(path.join(client,"index.html")));
}
app.use(notFound,errorHandler);
