import { NextRequest } from "next/server";
import { z } from "zod";

export { z };

export async function parseJson<T extends z.ZodTypeAny>(request: NextRequest, schema: T): Promise<z.infer<T>> {
  const body = await request.json().catch(() => ({}));
  return schema.parse(body);
}

export function parseQuery<T extends z.ZodTypeAny>(request: NextRequest, schema: T): z.infer<T> {
  return schema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));
}

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id.");
export const phoneSchema = z.string().min(7).max(20);
export const nonEmptyString = z.string().trim().min(1);
