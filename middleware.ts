import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
