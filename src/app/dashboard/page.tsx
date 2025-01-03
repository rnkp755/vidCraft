"use client";
import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
const Dashboard = () => {
      const { isLoaded, isSignedIn, user } = useUser();
      const { signOut } = useClerk();

      if (!isLoaded || !isSignedIn) {
            return null;
      }

      return (
            <>
                  <div>Hello, {user.firstName} welcome to Clerk</div>
                  <button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
                        Sign out
                  </button>
            </>
      );
};

export default Dashboard;
