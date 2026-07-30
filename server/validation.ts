import { z } from "zod";
export const id = z.string().cuid();
export const authSchema = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(8).max(72) });
export const registerSchema = authSchema.extend({ name: z.string().trim().min(2).max(80) });
export const projectSchema = z.object({ name: z.string().trim().min(2).max(100), description: z.string().trim().max(1000).default("") });
export const taskSchema = z.object({
  title: z.string().trim().min(2).max(150), description: z.string().trim().max(3000).default(""),
  status: z.enum(["TODO","IN_PROGRESS","DONE"]).default("TODO"),
  priority: z.enum(["LOW","MEDIUM","HIGH","URGENT"]).default("MEDIUM"),
  dueDate: z.coerce.date(), assigneeId: z.string().cuid().nullable().optional()
});
