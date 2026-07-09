import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR";

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status = 500,
    public details?: unknown
  ) {
    super(message);
  }
}

export function apiError(code: ApiErrorCode, message: string, status = 500, details?: unknown) {
  return NextResponse.json({ ok: false, error: { code, message, details } }, { status });
}

export function apiOk<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return apiError(error.code, error.message, error.status, error.details);
  }
  if (error instanceof ZodError) {
    return apiError("VALIDATION_ERROR", "Invalid request.", 400, error.flatten());
  }
  return apiError("SERVER_ERROR", "Something went wrong.", 500);
}
