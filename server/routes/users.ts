import { Router } from "express";
import { db } from "../db.js";
import { authenticate, adminOnly } from "../auth.js";
export const usersRouter=Router();
usersRouter.use(authenticate,adminOnly);
usersRouter.get("/",async(req,res)=>{
  const search=typeof req.query.search==="string"?req.query.search.slice(0,100):"";
  res.json(await db.user.findMany({where:search?{OR:[{name:{contains:search,mode:"insensitive"}},{email:{contains:search,mode:"insensitive"}}]}:{},select:{id:true,name:true,email:true,role:true},take:50,orderBy:{name:"asc"}}));
});
