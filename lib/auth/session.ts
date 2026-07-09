import { NextRequest, NextResponse } from "next/server";
import { getSessionSecret } from "@/lib/env";
import { isRole, type UserRole } from "@/lib/auth/roles";

export const SESSION_COOKIE = "abseco_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const REFRESH_WINDOW_MS = 1000 * 60 * 30;

export type SessionUser = {
  id: string;
  role: UserRole;
  email?: string;
  phone?: string;
  name?: string;
};

export type AuthSession = {
  sid: string;
  user: SessionUser;
  issuedAt: number;
  expiresAt: number;
};

function base64UrlEncode(value: string | Uint8Array) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

async function verify(payload: string, signature: string) {
  const expected = await sign(payload);
  return expected === signature;
}

function isSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") return false;
  const candidate = value as AuthSession;
  return (
    typeof candidate.sid === "string" &&
    typeof candidate.issuedAt === "number" &&
    typeof candidate.expiresAt === "number" &&
    Boolean(candidate.user) &&
    typeof candidate.user.id === "string" &&
    isRole(candidate.user.role)
  );
}

export async function createSession(user: SessionUser): Promise<AuthSession> {
  const now = Date.now();
  return {
    sid: crypto.randomUUID(),
    user,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS
  };
}

export async function encodeSession(session: AuthSession) {
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function decodeSession(raw?: string | null): Promise<AuthSession | null> {
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature || !(await verify(payload, signature))) return null;
  try {
    const parsed = JSON.parse(base64UrlDecode(payload));
    if (!isSession(parsed)) return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest) {
  return decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(response: NextResponse, session: AuthSession) {
  response.cookies.set(SESSION_COOKIE, await encodeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor((session.expiresAt - Date.now()) / 1000)
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  response.cookies.set("abseco_admin", "", { path: "/", maxAge: 0 });
}

export async function maybeRefreshSession(request: NextRequest, response: NextResponse, session: AuthSession | null) {
  if (!session) return;
  if (session.expiresAt - Date.now() > REFRESH_WINDOW_MS) return;
  await setSessionCookie(response, {
    ...session,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS
  });
}
