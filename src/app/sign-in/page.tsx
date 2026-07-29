import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Navbar } from "@/components/homepage/navbar";

export default function SignInPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center p-4 pt-24">
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
