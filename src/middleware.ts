import { createRouteMatcher, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher([
    "/",
    "/api/webhook/register",
    "/sign-in(.*)",
    "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    try {
        if (!publicRoutes(req)) {
            await auth.protect();
        } else {
            return NextResponse.redirect(new URL("/sign-in", req.url));
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
