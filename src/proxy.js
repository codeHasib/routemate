// middleware.js
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // 1. Optimistically extract the Better Auth session token cookie
  const sessionCookie = getSessionCookie(request);

  // 2. Gatekeeper: If they are trying to reach any dashboard but have no cookie, boot them to signin
  if (!sessionCookie) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/vendor") ||
      pathname.startsWith("/user")
    ) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // 3. Strict Role Isolation Layer via API Verification
  // Since we know a cookie exists, we verify their exact role with the backend
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/vendor") ||
    pathname.startsWith("/user")
  ) {
    try {
      const res = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );

      const session = await res.json();

      // If the cookie was invalid/expired on the backend, clear out and redirect
      if (!session || !session.user) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      const userRole = session.user.role; // Expected variations: 'admin', 'vendor', 'user'

      // 🛑 RULE A: Prevent non-admins from poking around /admin paths
      if (pathname.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url),
        );
      }

      // 🛑 RULE B: Prevent non-vendors from accessing /vendor paths
      if (pathname.startsWith("/vendor") && userRole !== "vendor") {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url),
        );
      }

      // 🛑 RULE C: Prevent non-regular users from logging into /user paths
      if (pathname.startsWith("/user") && userRole !== "user") {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url),
        );
      }
    } catch (error) {
      console.error("Kernel Middleware Sync Interruption:", error);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

// Intercept all specialized dashboard routes globally
export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/user/:path*",
    "/tickets/:path",
  ],
};
