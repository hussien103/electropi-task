import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { authSchema, registerSchema } from "../validation.js";
import { AppError } from "../errors.js";
import { signToken, authenticate } from "../auth.js";
export const authRouter = Router();
const publicUser = { id: true, name: true, email: true, role: true, createdAt: true } as const;
authRouter.post("/register", async (req, res) => {
  const data = registerSchema.parse(req.body);
  const { password, ...profile } = data;
  const user = await db.user.create({ data: { ...profile, passwordHash: await bcrypt.hash(password, 12) }, select: publicUser });
  res.status(201).json({ user, token: signToken(user) });
});
authRouter.post("/login", async (req, res) => {
  const data = authSchema.parse(req.body);
  const found = await db.user.findUnique({ where: { email: data.email } });
  if (!found || !(await bcrypt.compare(data.password, found.passwordHash))) throw new AppError(401, "Invalid email or password");
  const { passwordHash: _, ...user } = found;
  res.json({ user, token: signToken(found) });
});
authRouter.get("/me", authenticate, async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.user!.id }, select: publicUser });
  if (!user) throw new AppError(404, "User not found");
  res.json(user);
});
