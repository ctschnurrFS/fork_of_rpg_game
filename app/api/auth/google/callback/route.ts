import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createSessionToken } from "@/lib/auth/session";
import { cookies } from "next/headers"; // <-- This is correct

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
    const cookieStore = await cookies(); // Await the cookies function here
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

    // Verify ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.redirect(
        new URL("/sign-in?error=no_email", request.url)
      );
    }

    // Create session
    await createSessionToken(payload.email);

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_failed", request.url)
    );
  }
}
