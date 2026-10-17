import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string().regex(/^\d+$/).transform(Number).default(3000),
    DATABASE_URL: z.string().url(),
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
