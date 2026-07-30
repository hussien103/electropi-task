import {describe,expect,it} from "vitest";
import {credentials,registration} from "./auth.service.js";
describe("authentication validation",()=>{
 it("normalizes emails",()=>expect(credentials.parse({email:"USER@EXAMPLE.COM",password:"Password1"}).email).toBe("user@example.com"));
 it("rejects weak passwords",()=>expect(()=>credentials.parse({email:"a@b.com",password:"short"})).toThrow());
 it("rejects invalid emails",()=>expect(()=>credentials.parse({email:"invalid",password:"Password1"})).toThrow());
 it("requires a useful name",()=>expect(()=>registration.parse({name:" ",email:"a@b.com",password:"Password1"})).toThrow());
 it("accepts a valid registration",()=>expect(registration.parse({name:"Amina",email:"a@b.com",password:"Password1"}).name).toBe("Amina"));
});
