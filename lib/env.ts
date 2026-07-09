import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().optional(),
  AUTH_SESSION_SECRET: z.string().optional(),
  ABSECO_SESSION_SECRET: z.string().optional(),
  ABSECO_ADMIN_EMAIL: z.string().email().optional(),
  ABSECO_ADMIN_PASSWORD: z.string().min(12).optional(),
  ABSECO_ADMIN_ROLE: z.enum(["admin", "super_admin"]).optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  ABSECO_DEFAULT_BOOKING_MODE: z.enum(["fixed", "percentage"]).optional(),
  ABSECO_DEFAULT_BOOKING_VALUE: z.coerce.number().optional(),
  ABSECO_DEFAULT_GST_PERCENTAGE: z.coerce.number().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const env = parsed.data;

export function getEnv() {
  return env;
}

export function getSessionSecret() {
  const secret = env.AUTH_SESSION_SECRET || env.ABSECO_SESSION_SECRET;
  if (!secret && env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET is required in production.");
  }
  return secret || "development-only-session-secret-change-before-production";
}

export function requireEnv(name: keyof typeof env) {
  const value = env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

export function getAdminCredentials() {
  if (!env.ABSECO_ADMIN_EMAIL || !env.ABSECO_ADMIN_PASSWORD) {
    return null;
  }
  return {
    email: env.ABSECO_ADMIN_EMAIL,
    password: env.ABSECO_ADMIN_PASSWORD,
    role: env.ABSECO_ADMIN_ROLE || "admin"
  };
}
