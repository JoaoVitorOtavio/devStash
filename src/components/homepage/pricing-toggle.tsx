"use client";

import { useState } from "react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/server/utils";

const FREE_FEATURES = ["50 items", "3 collections", "Basic search", "Image uploads"];
const PRO_FEATURES = [
  "Unlimited items",
  "Unlimited collections",
  "File uploads",
  "Custom item types",
  "AI features",
  "Export (JSON / ZIP)",
];

export function PricingToggle() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="mb-12 flex items-center justify-center gap-3">
        <span className={cn("text-sm", !yearly ? "font-semibold text-foreground" : "text-muted-foreground")}>
          Monthly
        </span>
        <Switch checked={yearly} onCheckedChange={setYearly} aria-label="Toggle yearly pricing" />
        <span className={cn("text-sm", yearly ? "font-semibold text-foreground" : "text-muted-foreground")}>
          Yearly{" "}
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-500">
            Save 25%
          </span>
        </span>
      </div>

      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
        <Card className="p-8">
          <h3 className="font-semibold">Free</h3>
          <div className="mt-3 mb-6 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">$0</span>
            <span className="text-muted-foreground">/forever</span>
          </div>
          <ul className="mb-7 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="border-b border-border pb-2.5 text-sm text-muted-foreground last:border-none">
                {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </Card>

        <Card className="relative border-primary p-8 shadow-[0_0_0_1px_var(--color-primary)]">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 py-1 text-xs font-bold text-white">
            Most Popular
          </span>
          <h3 className="font-semibold">Pro</h3>
          <div className="mt-3 mb-6 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">{yearly ? "$72" : "$8"}</span>
            <span className="text-muted-foreground">{yearly ? "/yr" : "/mo"}</span>
          </div>
          <ul className="mb-7 space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="border-b border-border pb-2.5 text-sm text-muted-foreground last:border-none">
                {f}
              </li>
            ))}
          </ul>
          <Button className="w-full" asChild>
            <Link href="/register">Upgrade to Pro</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
