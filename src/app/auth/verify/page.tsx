"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  const verify = useCallback(async () => {
    if (!token) {
      setStatus("error");
      setMessage("Missing token.");
      return;
    }

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email verified successfully! You can now sign in.");
        toast.success("Email verified!");
      } else {
        setStatus("error");
        setMessage(data.error || "Verification failed.");
        toast.error(data.error || "Verification failed.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }, [token]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          {status === "loading" && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
          {status === "success" && <CheckCircle2 className="h-6 w-6 text-green-500" />}
          {status === "error" && <XCircle className="h-6 w-6 text-destructive" />}
          Verification
        </CardTitle>
        <CardDescription>
          {status === "loading" ? "Please wait while we verify your email." : "Verification result"}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-6">
        <p className="text-lg font-medium">{message}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/sign-in">
            Go to Sign In
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="text-lg font-medium">Loading...</p>
          </CardContent>
        </Card>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
