import { NextRequest } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(request: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.key}:${getClientIp(request)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, resetAt: now + options.windowMs };
  }

  if (existing.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { allowed: true, remaining: options.limit - existing.count, resetAt: existing.resetAt };
}
