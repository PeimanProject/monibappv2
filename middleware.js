import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/admin", "/prot", "/user"]; // exa

function isProtectedPath(pathname) {
  const regex = new RegExp(`^/\\w{2}(${protectedPaths.join("|")})`);
  return regex.test(pathname);
}

export async function middleware(request) {
  const intlResponse = intlMiddleware(request);
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  return intlResponse;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en)/:path*"],
};
