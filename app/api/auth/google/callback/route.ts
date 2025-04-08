import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createSessionToken, setSession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Validate state parameter
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value;
    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(
        new URL("/sign-in?error=invalid_state", request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/sign-in?error=missing_code", request.url)
      );
    }

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
    });

    if (!tokens.id_token) {
      return NextResponse.redirect(
        new URL("/sign-in?error=no_id_token", request.url)
      );
    }

    // Verify ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.redirect(
        new URL("/sign-in?error=no_email", request.url)
      );
    }

    // Find or create user in database
    let user = await db.query.users.findFirst({
      where: eq(users.email, payload.email),
    });

    if (!user) {
      // Create new user if doesn't exist
      [user] = await db
        .insert(users)
        .values({
          email: payload.email,
          name: payload.name,
          image: payload.picture,
          // Add other required fields
        })
        .returning();
    }

    if (!user?.id) {
      throw new Error("Failed to create user");
    }

    // Create response object
    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    // Set session cookie
    response.cookies.set({
      name: "session",
      value: await createSessionToken({
        id: user.id,
        email: user.email,
      }),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Cleanup OAuth state cookie
    response.cookies.delete("google_oauth_state");

    console.log("Auth successful for user:", user.email);
    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_failed", request.url)
    );
  }
}
