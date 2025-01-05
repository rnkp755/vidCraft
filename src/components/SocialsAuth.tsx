"use client";
import Image from "next/image";
import * as React from "react";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn, useSignUp } from "@clerk/nextjs";

const SocialsAuth = () => {
      const { signIn } = useSignIn();
      const { signUp, setActive } = useSignUp();

      if (!signIn || !signUp) return null;

      const signInWith = (strategy: OAuthStrategy) => {
            return signIn.authenticateWithRedirect({
                  strategy,
                  redirectUrl: "/dashboard",
                  redirectUrlComplete: "/dashboard",
            });
      };

      async function handleSignIn(strategy: OAuthStrategy) {
            if (!signIn || !signUp) return null;

            const userExistsButNeedsToSignIn =
                  signUp.verifications.externalAccount.status ===
                        "transferable" &&
                  signUp.verifications.externalAccount.error?.code ===
                        "external_account_exists";

            if (userExistsButNeedsToSignIn) {
                  const res = await signIn.create({ transfer: true });

                  if (res.status === "complete") {
                        setActive({
                              session: res.createdSessionId,
                        });
                  }
            }

            const userNeedsToBeCreated =
                  signIn.firstFactorVerification.status === "transferable";

            if (userNeedsToBeCreated) {
                  const res = await signUp.create({
                        transfer: true,
                  });

                  if (res.status === "complete") {
                        setActive({
                              session: res.createdSessionId,
                        });
                  }
            } else {
                  signInWith(strategy);
            }
      }
      return (
            <div className="flex justify-center items-center gap-6">
                  <div onClick={() => handleSignIn("oauth_google")}>
                        <Image
                              className="cursor-pointer"
                              src="/socials/google-icon.svg"
                              alt="logo"
                              width={50}
                              height={50}
                        />
                  </div>
                  <div>
                        <Image
                              className="cursor-pointer"
                              src="/socials/fb-icon.svg"
                              alt="logo"
                              width={50}
                              height={50}
                        />
                  </div>
                  <div>
                        <div className="bg-white rounded-full">
                              <Image
                                    className="cursor-pointer"
                                    src="/socials/github-icon.svg"
                                    alt="logo"
                                    width={50}
                                    height={50}
                              />
                        </div>
                  </div>
                  <div>
                        <div className="bg-white rounded-full">
                              <Image
                                    className="cursor-pointer"
                                    src="/socials/linkedin-icon.svg"
                                    alt="logo"
                                    width={50}
                                    height={50}
                              />
                        </div>
                  </div>
            </div>
      );
};

export default SocialsAuth;
