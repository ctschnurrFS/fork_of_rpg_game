import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionToken, verifyToken } from "@/lib/auth/session"; // Updated import
//import { getUser } from "@/lib/db/queries";


const protectedRoutes = "/dashboard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");
  const isProtectedRoute = pathname.startsWith(protectedRoutes);

// const user = await getUser();
  //console.log(`[Middleware] Running for path: ${request.nextUrl.pathname}`);

  // Redirect to sign-in if protected route and no session

// console.log("CHECK MIDDLEWARE: " + user?.role);
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let response = NextResponse.next();

  if (sessionCookie) {
    try {
      const sessionData = await verifyToken(sessionCookie.value);

      if (!sessionData?.user?.id) {
        throw new Error("Invalid session data");
      }

      // Refresh the session token
      const newToken = await createSessionToken({
        id: sessionData.user.id,
        email: sessionData.user.email,
      });

      // Set the new token
      response.cookies.set({
        name: "session",
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
      });
    } catch (error) {
      console.error("Session verification failed:", error);
      response.cookies.delete("session");
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
