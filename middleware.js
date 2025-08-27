import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Only allow admins into /admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!token || !token.isAdmin) {
      const loginUrl = new URL("/admin-login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
