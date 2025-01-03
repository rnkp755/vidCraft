/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
      Card,
      CardHeader,
      CardTitle,
      CardContent,
      CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import SocialsAuth from "@/components/SocialsAuth";
export default function SignUp() {
      const { isLoaded, signUp, setActive } = useSignUp();
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [emailAddress, setEmailAddress] = useState("");
      const [password, setPassword] = useState("");
      const [btnMsg, setBtnMsg] = useState("Sign Up");
      const [pendingVerification, setPendingVerification] = useState(false);
      const [code, setCode] = useState("");
      const [error, setError] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const router = useRouter();

      if (!isLoaded) {
            return (
                  <div className="flex items-center justify-center min-h-screen bg-black">
                        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg">
                              <div className="animate-pulse space-y-4">
                                    {/* Title Skeleton */}
                                    <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>

                                    {/* First Name Skeleton */}
                                    <div className="space-y-2">
                                          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                          <div className="h-10 bg-gray-700 rounded"></div>
                                    </div>

                                    {/* Last Name Skeleton */}
                                    <div className="space-y-2">
                                          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                          <div className="h-10 bg-gray-700 rounded"></div>
                                    </div>

                                    {/* Email Skeleton */}
                                    <div className="space-y-2">
                                          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                          <div className="h-10 bg-gray-700 rounded"></div>
                                    </div>

                                    {/* Password Skeleton */}
                                    <div className="space-y-2">
                                          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                          <div className="h-10 bg-gray-700 rounded"></div>
                                    </div>

                                    {/* Button Skeleton */}
                                    <div className="h-10 bg-gray-700 rounded w-full"></div>
                              </div>
                        </div>
                  </div>
            );
      }

      const signUpWithFB = (strategy: OAuthStrategy) => {
            return signUp.authenticateWithRedirect({
                  strategy,
                  redirectUrl: "/sign-up/sso-callback",
                  redirectUrlComplete: "/dashboard",
            });
      };

      async function submit(e: React.FormEvent) {
            e.preventDefault();
            if (!isLoaded) {
                  return;
            }
            setError("");
            setBtnMsg("Signing Up...");
            try {
                  await signUp.create({
                        emailAddress,
                        password,
                        firstName,
                        lastName,
                  });

                  await signUp.prepareEmailAddressVerification({
                        strategy: "email_code",
                  });

                  setPendingVerification(true);
                  setBtnMsg("Verify Email");
            } catch (err: any) {
                  console.error(JSON.stringify(err, null, 2));
                  setError(err.errors[0].message);
                  setBtnMsg("Sign Up");
            }
      }

      async function onPressVerify(e: React.FormEvent) {
            e.preventDefault();
            if (!isLoaded) {
                  return;
            }
            setError("");
            setBtnMsg("Verifying...");
            try {
                  const completeSignUp =
                        await signUp.attemptEmailAddressVerification({
                              code,
                        });
                  console.log(completeSignUp);
                  if (completeSignUp.status !== "complete") {
                        console.log(JSON.stringify(completeSignUp, null, 2));
                  }

                  if (completeSignUp.status === "complete") {
                        await setActive({
                              session: completeSignUp.createdSessionId,
                        });
                        const {
                              createdUserId,
                              firstName,
                              lastName,
                              emailAddress,
                        } = completeSignUp;
                        const response = await axios.post("/api/sign-up", {
                              createdUserId,
                              firstName,
                              lastName,
                              emailAddress,
                        });
                        if (response.status === 200) {
                              router.push("/dashboard");
                        } else {
                              setError(response.data.message);
                              throw new Error(response.data.message);
                        }
                  }
            } catch (err: any) {
                  console.error(JSON.stringify(err, null, 2));
                  setError(err.errors[0].longMessage);
                  setBtnMsg("Verify Email");
            }
      }

      return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                  <Card className="w-full max-w-md bg-gray-800">
                        <CardHeader>
                              <CardTitle className="text-2xl font-bold text-center text-white">
                                    Sign Up for Vidcraft
                              </CardTitle>
                        </CardHeader>
                        <CardContent>
                              {!pendingVerification ? (
                                    <div className="flex-col">
                                          <SocialsAuth />
                                          <div className="flex w-full items-center gap-2 py-4 text-sm text-slate-200">
                                                <div className="h-px w-full bg-slate-600"></div>
                                                OR
                                                <div className="h-px w-full bg-slate-600"></div>
                                          </div>
                                          <form
                                                onSubmit={submit}
                                                className="space-y-4"
                                          >
                                                <div className="space-y-2">
                                                      <Label
                                                            htmlFor="name"
                                                            className="text-white"
                                                      >
                                                            First Name
                                                      </Label>
                                                      <Input
                                                            type="text"
                                                            id="firstName"
                                                            value={firstName}
                                                            onChange={(e) =>
                                                                  setFirstName(
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                            required
                                                            className="bg-gray-700 text-white placeholder-gray-400"
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label
                                                            htmlFor="name"
                                                            className="text-white"
                                                      >
                                                            Last Name
                                                      </Label>
                                                      <Input
                                                            type="text"
                                                            id="lastName"
                                                            value={lastName}
                                                            onChange={(e) =>
                                                                  setLastName(
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                            required
                                                            className="bg-gray-700 text-white placeholder-gray-400"
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label
                                                            htmlFor="email"
                                                            className="text-white"
                                                      >
                                                            Email
                                                      </Label>
                                                      <Input
                                                            type="email"
                                                            id="email"
                                                            value={emailAddress}
                                                            onChange={(e) =>
                                                                  setEmailAddress(
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                            required
                                                            className="bg-gray-700 text-white placeholder-gray-400"
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label
                                                            htmlFor="password"
                                                            className="text-white"
                                                      >
                                                            Password
                                                      </Label>
                                                      <div className="relative">
                                                            <Input
                                                                  type={
                                                                        showPassword
                                                                              ? "text"
                                                                              : "password"
                                                                  }
                                                                  id="password"
                                                                  value={
                                                                        password
                                                                  }
                                                                  onChange={(
                                                                        e
                                                                  ) =>
                                                                        setPassword(
                                                                              e
                                                                                    .target
                                                                                    .value
                                                                        )
                                                                  }
                                                                  required
                                                                  className="bg-gray-700 text-white placeholder-gray-400"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  onClick={() =>
                                                                        setShowPassword(
                                                                              !showPassword
                                                                        )
                                                                  }
                                                                  className="absolute right-2 top-1/2 -translate-y-1/2"
                                                            >
                                                                  {showPassword ? (
                                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                                  ) : (
                                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                                  )}
                                                            </button>
                                                      </div>
                                                </div>
                                                {error && (
                                                      <Alert variant="destructive">
                                                            <AlertDescription className="text-red-500">
                                                                  {error}
                                                            </AlertDescription>
                                                      </Alert>
                                                )}
                                                <Button
                                                      type="submit"
                                                      className="w-full bg-primary hover:bg-primary-dark"
                                                >
                                                      {btnMsg}
                                                </Button>
                                          </form>
                                    </div>
                              ) : (
                                    <form
                                          onSubmit={onPressVerify}
                                          className="space-y-4"
                                    >
                                          <div className="space-y-2">
                                                <Label
                                                      htmlFor="code"
                                                      className="text-white"
                                                >
                                                      Verification Code
                                                </Label>
                                                <Input
                                                      id="code"
                                                      value={code}
                                                      onChange={(e) =>
                                                            setCode(
                                                                  e.target.value
                                                            )
                                                      }
                                                      placeholder="Enter verification code"
                                                      required
                                                      className="bg-gray-700 text-white placeholder-gray-400"
                                                />
                                          </div>
                                          {error && (
                                                <Alert variant="destructive">
                                                      <AlertDescription className="text-red-500">
                                                            {error}
                                                      </AlertDescription>
                                                </Alert>
                                          )}
                                          <Button
                                                type="submit"
                                                className="w-full bg-primary hover:bg-primary-dark"
                                          >
                                                {btnMsg}
                                          </Button>
                                    </form>
                              )}
                        </CardContent>
                        <CardFooter className="justify-center">
                              <p className="text-sm text-gray-100">
                                    Already have an account?{" "}
                                    <Link
                                          href="/sign-in"
                                          className="font-medium text-gray-400 hover:underline"
                                    >
                                          Sign in
                                    </Link>
                              </p>
                        </CardFooter>
                  </Card>
            </div>
      );
}
