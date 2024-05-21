import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
    JWT_SECRET: z.string(),
    JWT_RESET_PASSWORD_SECRET: z.string(),
    APP_URL: z.string(),
    EXPIRES_IN: z.string(),
    EXPIRES_IN_RESET_PASSWORD: z.string(),
    AUTH_USER_NODEMAILER: z.string(),
    AUTH_PASSWORD_NODEMAILER: z.string(),
    HOST_NODEMAILER: z.string(),
    PORT_NODEMAILER: z.coerce.number(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASS: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_SCHEMA: z.string(),
    PORT: z.coerce.number().default(4444),
});
const _env = envSchema.safeParse(process.env);

if (_env.success == false) {
    console.error("❌ Invalid enviroment variables!", _env.error.format());

    throw new Error("❌ Invalid enviroment variables!");
}

export const env = _env.data;
