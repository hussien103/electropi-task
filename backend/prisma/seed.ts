import "dotenv/config";
import { PrismaClient, Role, TaskStatus, Priority } from "@prisma/client";
import bcrypt from "bcryptjs";
const db=new PrismaClient();
async function main(){
  const passwordHash=await bcrypt.hash("Password123!",12);
  const admin=await db.user.upsert({where:{email:"admin@teamflow.dev"},update:{name:"Amina Admin",passwordHash,role:Role.ADMIN},create:{name:"Amina Admin",email:"admin@teamflow.dev",passwordHash,role:Role.ADMIN}});
  const member=await db.user.upsert({where:{email:"member@teamflow.dev"},update:{name:"Moe Member",passwordHash,role:Role.MEMBER},create:{name:"Moe Member",email:"member@teamflow.dev",passwordHash,role:Role.MEMBER}});
  let project=await db.project.findFirst({where:{name:"Product Launch",creatorId:admin.id}});
  if(!project) project=await db.project.create({data:{name:"Product Launch",description:"Coordinate the next product release.",creatorId:admin.id,members:{create:[{userId:admin.id},{userId:member.id}]}}});
  await db.project.update({where:{id:project.id},data:{description:"Coordinate the next product release."}});
  await Promise.all([admin.id,member.id].map(userId=>db.projectMember.upsert({where:{projectId_userId:{projectId:project.id,userId}},create:{projectId:project.id,userId},update:{}})));
  if(await db.task.count({where:{projectId:project.id}})===0) await db.task.createMany({data:[
    {projectId:project.id,title:"Prepare launch checklist",description:"Confirm owners and launch gates.",status:TaskStatus.IN_PROGRESS,priority:Priority.HIGH,dueDate:new Date(Date.now()+86400000*4),creatorId:admin.id,assigneeId:member.id},
    {projectId:project.id,title:"Publish release notes",description:"Draft customer-facing release notes.",status:TaskStatus.TODO,priority:Priority.MEDIUM,dueDate:new Date(Date.now()+86400000*7),creatorId:admin.id,assigneeId:admin.id}
  ]});
  console.log("Seeded admin@teamflow.dev and member@teamflow.dev (Password123!)");
}
main().finally(()=>db.$disconnect());
