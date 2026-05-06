import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check for role-based access
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/kds") && token?.role !== "ADMIN" && token?.role !== "STAFF") {
      // For testing, we can allow ADMIN or STAFF
      // For now, if no role, redirect
      if (!token?.role) {
         return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/kds/:path*", "/profile/:path*", "/checkout/:path*"],
};
