import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
});

export async function GET() {
  try {
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID(); // Add nonce for additional security

    const authorizationUrl = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
      prompt: "consent",
      state: state,
      nonce: nonce,
      include_granted_scopes: true,
    });

    const response = NextResponse.redirect(authorizationUrl);

    // Set both state and nonce as HttpOnly cookies
    response.cookies.set("google_oauth_state", state, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });

    response.cookies.set("google_oauth_nonce", nonce, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Google auth initiation error:", error);
    return new NextResponse("Authentication failed", { status: 500 });
  }
}
