import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string().regex(/^\d+$/).transform(Number).default(3000),
    DATABASE_URL: z.string().url(),
    DB_HOST: z.string().default("localhost"),
    DB_PORT: z.string().regex(/^\d+$/).transform(Number).default(3306),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string().optional().default(""),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "Environment variables are not valid:",
        parsedEnv.error.format(),
    );
    throw new Error("Environment variables are not valid");
}

console.log("Environment variables loaded successfully:", parsedEnv.data);

export const envData = parsedEnv.data;
