import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { AuthPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "nextcampus-secret-key-change-in-production";
const COOKIE_NAME = "nc_token";

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // Check cookie
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
}

export function getUserFromRequest(request: Request): AuthPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
