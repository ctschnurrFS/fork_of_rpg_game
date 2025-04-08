"use server";

import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NewUser } from "@/lib/db/schema";

const key = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.SESSION_SECRET || "fallback-dev-secret"
);
const SALT_ROUNDS = 10;

// Password utilities remain the same
export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

// Enhanced Session Types
interface SessionPayload extends JWTPayload {
  userId: number;
  email?: string;
}

interface SessionData {
  user: {
    id: number;
    email?: string;
  };
  expires: string;
}

// Consolidated token creation
export async function createSessionToken(user: { id: number; email?: string }) {
  const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day in seconds

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    exp: expiresAt,
  } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);

  console.debug("Created session token for user:", { id: user.id });
  return token;
}

// Enhanced verification with debugging
export async function verifyToken(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, key);
    console.debug("Decoded token payload:", payload);

    if (!payload.userId) {
      throw new Error("Token missing userId");
    }

    return {
      user: {
        id: payload.userId,
        email: payload.email,
      },
      expires: payload.exp ? new Date(payload.exp * 1000).toISOString() : "",
    };
  } catch (error) {
    console.error(
      "Token verification failed:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

// Session management
export async function getSession() {
  const cookieStore = await cookies(); // No await needed
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    console.debug("No session cookie found");
    return null;
  }

  const session = await verifyToken(sessionCookie);
  if (!session) {
    console.error("Invalid session token");
    return null;
  }

  console.debug("Retrieved session for user:", session.user.id);
  return session;
}

export async function setSession(user: NewUser) {
  if (!user.id) {
    throw new Error("Cannot create session for user without ID");
  }

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
  });

  const cookieStore = await cookies(); // No await needed
  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 1 day
  });

  console.debug("Session set for user:", user.id);
}

// Cleanup
export async function destroySession() {
  const cookieStore = await cookies(); // No await needed
  cookieStore.delete("session");
  console.debug("Session destroyed");
}
