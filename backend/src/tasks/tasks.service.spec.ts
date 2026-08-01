import {ForbiddenException} from "@nestjs/common";
import {Role,TaskStatus} from "@prisma/client";
import {beforeEach,describe,expect,it,vi} from "vitest";
import {TasksService} from "./tasks.service.js";

const member={id:"member-1",role:Role.MEMBER};
const admin={id:"admin-1",role:Role.ADMIN};
const project={id:"project-1",creatorId:"owner-1"};
const current={id:"task-1",projectId:project.id,assigneeId:member.id,status:TaskStatus.TODO};

describe("task authorization and auditing",()=>{
 let db:any,projects:any,gateway:any,service:TasksService;
 beforeEach(()=>{
  db={task:{findFirst:vi.fn().mockResolvedValue(current)},projectMember:{findUnique:vi.fn()},$transaction:vi.fn()};
  projects={requireAccess:vi.fn().mockResolvedValue(project),requireOwnerOrAdmin:vi.fn()};
  gateway={emit:vi.fn()};
  service=new TasksService(db,projects,gateway);
 });

 it("allows a Member to change the status of their assigned task and records an audit entry",async()=>{
  const updated={...current,status:TaskStatus.IN_PROGRESS};
  const auditCreate=vi.fn().mockResolvedValue({});
  db.$transaction.mockImplementation((work:any)=>work({task:{update:vi.fn().mockResolvedValue(updated)},auditLog:{create:auditCreate}}));
  await expect(service.update(project.id,current.id,member,{status:TaskStatus.IN_PROGRESS})).resolves.toEqual(updated);
  expect(auditCreate).toHaveBeenCalledWith({data:{taskId:current.id,userId:member.id,fromStatus:TaskStatus.TODO,toStatus:TaskStatus.IN_PROGRESS}});
  expect(gateway.emit).toHaveBeenCalledWith(project.id,"task:updated",updated);
 });

 it("prevents a Member from changing an unassigned or another user's task",async()=>{
  db.task.findFirst.mockResolvedValue({...current,assigneeId:"someone-else"});
  await expect(service.update(project.id,current.id,member,{status:TaskStatus.DONE})).rejects.toThrow("Members can only update tasks assigned to themselves");
  expect(db.$transaction).not.toHaveBeenCalled();
 });

 it("prevents a Member from editing details even on their assigned task",async()=>{
  await expect(service.update(project.id,current.id,member,{title:"Changed title"})).rejects.toThrow("Members can only change the status");
  expect(db.$transaction).not.toHaveBeenCalled();
 });

 it("does not create an audit record when an Admin changes task details without changing status",async()=>{
  const updated={...current,title:"Clearer title"};
  const auditCreate=vi.fn();
  db.$transaction.mockImplementation((work:any)=>work({task:{update:vi.fn().mockResolvedValue(updated)},auditLog:{create:auditCreate}}));
  await service.update(project.id,current.id,admin,{title:"Clearer title"});
  expect(auditCreate).not.toHaveBeenCalled();
 });

 it("requires project-owner or Admin authorization before creating a task",async()=>{
  projects.requireOwnerOrAdmin.mockRejectedValue(new ForbiddenException("Only the project creator or an Admin can modify this project"));
  await expect(service.create(project.id,member,{title:"Forbidden task",dueDate:"2026-08-10"})).rejects.toBeInstanceOf(ForbiddenException);
  expect(projects.requireOwnerOrAdmin).toHaveBeenCalledWith(project.id,member);
 });
});
