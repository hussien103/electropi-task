import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  DATABASE_URL: z.string().default("postgresql://teamflow:teamflow@localhost:5432/teamflow"),
  JWT_SECRET: z.string().min(32).default("development-only-secret-change-me-123456789"),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().default("http://localhost:5173")
});
export const config = schema.parse(process.env);
