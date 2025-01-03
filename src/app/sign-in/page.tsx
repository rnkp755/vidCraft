/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
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
import SocialsAuth from "@/components/SocialsAuth";

export default function SignIn() {
      const { isLoaded, signIn, setActive } = useSignIn();
      const [emailAddress, setEmailAddress] = useState("");
      const [password, setPassword] = useState("");
      const [btnMsg, setBtnMsg] = useState("Sign In");
      const [error, setError] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const router = useRouter();

      if (!isLoaded) {
            // Skeleton
            return (
                  <div className="flex items-center justify-center min-h-screen bg-black">
                        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg">
                              <div className="animate-pulse space-y-4">
                                    <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
                                    <div className="space-y-2">
                                          <div className="h-4 bg-gray-700 rounded"></div>
                                          <div className="h-4 bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="h-10 bg-gray-700 rounded"></div>
                                    <div className="h-10 bg-gray-700 rounded"></div>
                                    <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto"></div>
                              </div>
                        </div>
                  </div>
            );
      }

      async function submit(e: React.FormEvent) {
            e.preventDefault();
            if (!isLoaded) {
                  return;
            }
            setBtnMsg("Signing In...");
            try {
                  const result = await signIn.create({
                        identifier: emailAddress,
                        password,
                  });

                  if (result.status === "complete") {
                        await setActive({ session: result.createdSessionId });
                        router.push("/dashboard");
                  } else {
                        console.error(JSON.stringify(result, null, 2));
                  }
            } catch (err: any) {
                  console.error("error", err.errors[0].message);
                  setError(err.errors[0].message);
                  setBtnMsg("Sign In");
            }
      }

      return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                  <Card className="w-full max-w-md bg-gray-800">
                        <CardHeader>
                              <CardTitle className="text-2xl font-bold text-center text-white">
                                    Sign In to Vidcraft
                              </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                                                  e.target.value
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
                                                            value={password}
                                                            onChange={(e) =>
                                                                  setPassword(
                                                                        e.target
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
                                                Sign In
                                          </Button>
                                    </form>
                              </div>
                        </CardContent>
                        <CardFooter className="justify-center">
                              <p className="text-sm text-gray-100">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                          href="/sign-up"
                                          className="font-medium text-gray-400 hover:underline"
                                    >
                                          Sign up
                                    </Link>
                              </p>
                        </CardFooter>
                  </Card>
            </div>
      );
}
