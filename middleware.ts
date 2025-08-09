import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
    "/",
    "/login(.*)",
    "/register(.*)",
    "/book(.*)",
])
export default clerkMiddleware(async (auth, req) => {
  // Check if the current route is NOT part of the publicly accessible routes
  if (!isPublicRoute(req)) {
    // If the route is private, enforce authentication
    await auth.protect();

    /*
      When auth.protect() is called:
      - If the user is authenticated, request proceeds as normal
      - If the user is NOT authenticated, Clerk will automatically redirect them to the sign-in page
    */
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};