import {describe,expect,it} from "vitest";
import {authSchema,projectSchema,registerSchema,taskSchema} from "./validation";
describe("request validation",()=>{
  it("normalizes email addresses",()=>expect(authSchema.parse({email:"USER@EXAMPLE.COM",password:"Password1"}).email).toBe("user@example.com"));
  it("rejects weak passwords",()=>expect(()=>authSchema.parse({email:"a@b.com",password:"short"})).toThrow());
  it("rejects invalid registration names",()=>expect(()=>registerSchema.parse({name:" ",email:"a@b.com",password:"Password1"})).toThrow());
  it("trims project input",()=>expect(projectSchema.parse({name:"  Launch  "}).name).toBe("Launch"));
  it("rejects unsupported task status",()=>expect(()=>taskSchema.parse({title:"Task",dueDate:"2027-01-01",status:"BLOCKED"})).toThrow());
  it("coerces task due dates and applies defaults",()=>{const task=taskSchema.parse({title:"Task",dueDate:"2027-01-01"});expect(task.dueDate).toBeInstanceOf(Date);expect(task.status).toBe("TODO");expect(task.priority).toBe("MEDIUM")});
  it("limits oversized task descriptions",()=>expect(()=>taskSchema.parse({title:"Task",dueDate:"2027-01-01",description:"x".repeat(3001)})).toThrow());
});
