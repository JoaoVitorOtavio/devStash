import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    if (isLoggedIn) return;
    return Response.redirect(new URL("/api/auth/signin", nextUrl));
  }
});

// Optionally, don't invoke Proxy on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
