import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require login
const isProRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/karyawan(.*)",
  "/settings(.*)",
]);

// Routes that are public (no auth check needed)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isProRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
