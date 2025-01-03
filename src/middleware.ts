import { createRouteMatcher, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
            if (!publicRoutes(req)) {
                  await auth.protect();
            } else if (req.nextUrl.pathname !== "/" && userId) {
                  return NextResponse.redirect(new URL("/dashboard", req.url));
            }
      } catch (error) {
            console.error(error);
            return NextResponse.redirect(new URL("/error", req.url));
      }
});

export const config = {
      matcher: [
            // Skip Next.js internals and all static files, unless found in search params
            "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
            // Always run for API routes
            "/(api|trpc)(.*)",
      ],
};
