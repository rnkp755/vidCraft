"use client";
import React, { useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
const Dashboard = () => {
      const { isLoaded, isSignedIn, user } = useUser();
      const { signOut } = useClerk();
      const router = useRouter();

      useEffect(() => {
            if (isLoaded && !isSignedIn) {
                  router.push("/sign-in");
            }
      }, [isLoaded, isSignedIn, router]);

      if (!isLoaded || !isSignedIn) {
            return null;
      }

      const handleSignOut = async () => {
            await signOut();
            router.push("/sign-in");
      };

      return (
            <>
                  <div>Hello, {user.firstName} welcome to Clerk</div>
                  <button onClick={handleSignOut}>Sign out</button>
            </>
      );
};

export default Dashboard;
