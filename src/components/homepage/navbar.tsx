"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code } from "lucide-react";
import { cn } from "@/server/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/95 backdrop-blur"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-17 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-primary">
            <Code className="h-4 w-4" />
          </span>
          DevStash
        </Link>

        <div className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
