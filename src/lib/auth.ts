import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "admin_token";
const TOKEN_EXPIRATION = "8h";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    throw new Error("ADMIN_USER and ADMIN_PASSWORD must be configured");
  }

  return { user, password };
}

export function validateCredentials(username: string, password: string): boolean {
  const { user, password: adminPassword } = getAdminCredentials();
  return username === user && password === adminPassword;
}

export async function createAuthToken(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticatedFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAuthToken(token);
}

export async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function isAuthenticatedRequest(request: NextRequest): Promise<boolean> {
  const token = await getTokenFromRequest(request);
  if (!token) return false;
  return verifyAuthToken(token);
}

export function getAuthCookieOptions(maxAgeSeconds = 60 * 60 * 8) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
