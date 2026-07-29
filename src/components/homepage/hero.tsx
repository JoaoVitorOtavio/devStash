import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { ChaosVisual } from "@/components/homepage/chaos-visual";
import { ITEM_TYPE_PALETTE } from "@/components/homepage/item-type-palette";

const DASHBOARD_PREVIEW_TYPES = [
  ITEM_TYPE_PALETTE.snippet,
  ITEM_TYPE_PALETTE.prompt,
  ITEM_TYPE_PALETTE.command,
  ITEM_TYPE_PALETTE.note,
  ITEM_TYPE_PALETTE.image,
  ITEM_TYPE_PALETTE.url,
];

export function Hero() {
  return (
    <header className="px-6 pb-20 pt-40 md:pt-44">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            Centralized Developer Knowledge Hub
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            Stop Losing Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Developer Knowledge
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Code snippets, AI prompts, commands, notes, and links — scattered across Notion, Slack,
            GitHub gists, and a hundred browser tabs. DevStash brings it all into one searchable,
            AI-enhanced hub.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">See Features</a>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal
          delay={150}
          className="mt-16 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]"
        >
          <div>
            <span className="mb-3 block text-sm font-semibold text-muted-foreground">
              Your knowledge today...
            </span>
            <ChaosVisual />
          </div>

          <div className="flex justify-center text-primary md:rotate-0 rotate-90">
            <svg
              className="h-10 w-10 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <polyline points="13 5 20 12 13 19" />
            </svg>
          </div>

          <div>
            <span className="mb-3 block text-sm font-semibold text-muted-foreground">
              ...with DevStash
            </span>
            <div className="grid h-[320px] grid-cols-[70px_1fr] overflow-hidden rounded-2xl border border-border bg-card/60">
              <div className="flex flex-col gap-2.5 border-r border-border bg-card p-4">
                <div className="h-2.5 rounded bg-primary" />
                <div className="h-2.5 rounded bg-muted" />
                <div className="h-2.5 rounded bg-muted" />
                <div className="h-2.5 rounded bg-muted" />
                <div className="h-2.5 rounded bg-muted" />
              </div>
              <div className="grid grid-cols-3 grid-rows-2 gap-2.5 p-4">
                {DASHBOARD_PREVIEW_TYPES.map(({ color }, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-card"
                    style={{ borderTop: `3px solid ${color}` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </header>
  );
}
