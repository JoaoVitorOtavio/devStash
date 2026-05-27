"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) return;

    if (searchParams.get("login")) {
      toast.success("Welcome back!", { id: "login-success" });
      hasShownToast.current = true;
      
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("login");
      const queryString = newParams.toString();
      const newPath = window.location.pathname + (queryString ? `?${queryString}` : "");
      window.history.replaceState(null, "", newPath);
    }
  }, [searchParams, router]);

  return null;
}
