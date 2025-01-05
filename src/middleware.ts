import { createRouteMatcher, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = createRouteMatcher([
      "/",
      "/api/sign-in(.*)",
      "/api/sign-up(.*)",
      "/sign-in(.*)",
      "/sign-up(.*)",
      "/error(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
      try {
            const { userId }: { userId: string | null } = await auth();

            // If the user is logged in and trying to access any public route (except "/"), redirect to the dashboard
            if (userId && publicRoutes(req) && req.nextUrl.pathname !== "/") {
                  return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // If the route is not public and the user is not logged in, protect the route and redirect to sign-in
            if (!publicRoutes(req) && !userId) {
                  return NextResponse.redirect(new URL("/sign-in", req.url));
            }

            // For public routes (except "/"), allow access even for non-logged-in users
            // The default action is to proceed with the request if all conditions are met
            return NextResponse.next();
      } catch (error) {
            console.error(error);
            // In case of an error, redirect to the error page
            return NextResponse.redirect(new URL("/error", req.url));
      }
});

export const config = {
      matcher: [
            // Skip Next.js internals and static files
            "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
            // Always run for API routes
            "/(api|trpc)(.*)",
      ],
};
