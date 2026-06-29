"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginWithEmail, loginWithGitHub } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/server/icons";

export function SignInForm() {
  const [state, action, isPending] = useActionState(loginWithEmail, undefined);
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) return;

    function cleanParams(keysToDelete: string[]) {
      const newParams = new URLSearchParams(searchParams.toString());
      keysToDelete.forEach(key => newParams.delete(key));
      const queryString = newParams.toString();
      const newPath = window.location.pathname + (queryString ? `?${queryString}` : "");
      window.history.replaceState(null, "", newPath);
    }

    if (searchParams.get("verify")) {
      toast.success("Confirmation email sent! Please check your inbox.", { id: "verify-success" });
      cleanParams(["verify"]);
      hasShownToast.current = true;
    }
    if (searchParams.get("registered")) {
      toast.success("Account created! You can now sign in.", { id: "registered-success" });
      cleanParams(["registered"]);
      hasShownToast.current = true;
    }
    if (searchParams.get("logout")) {
      toast.success("Signed out successfully.", { id: "logout-success" });
      cleanParams(["logout"]);
      hasShownToast.current = true;
    }
    if (searchParams.get("error") === "OAuthSignin") {
      toast.error("Error signing in with GitHub. Please try again.", { id: "oauth-error" });
      cleanParams(["error"]);
      hasShownToast.current = true;
    }
  }, [searchParams]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              defaultValue="demo@devstash.io"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue="12345678"
              required
            />
          </div>
          {state?.error && (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          type="button"
          className="w-full"
          onClick={() => loginWithGitHub()}
        >
          <Icons.github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
