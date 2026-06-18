// middleware.js
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // 1. Optimistically extract the Better Auth session token cookie
  const sessionCookie = getSessionCookie(request);

  // Define route condition blocks
  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/vendor") ||
    pathname.startsWith("/user");

  const isTicketDetails =
    pathname.startsWith("/tickets/") && pathname !== "/tickets/";

  if (!sessionCookie) {
    if (isDashboard || isTicketDetails) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // 3. Strict Verification Layer via API
  if (isDashboard || isTicketDetails) {
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

      if (!session || !session.user) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      if (isTicketDetails) {
        return NextResponse.next();
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
    "/tickets/:path+",
  ],
};
