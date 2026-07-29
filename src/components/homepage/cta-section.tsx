import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";

export function CtaSection() {
  return (
    <section className="border-y border-border bg-gradient-to-br from-indigo-500/10 to-pink-500/10 px-6 py-24">
      <ScrollReveal className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Organize Your Knowledge?</h2>
        <p className="mt-3 mb-8 text-muted-foreground">
          Join developers who stopped losing snippets, prompts, and commands in the chaos.
        </p>
        <Button size="lg" asChild>
          <Link href="/register">Get Started Free</Link>
        </Button>
      </ScrollReveal>
    </section>
  );
}
