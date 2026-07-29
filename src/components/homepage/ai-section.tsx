import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";

const AI_CAPABILITIES = [
  "Auto-tagging for every item you save",
  "Instant AI summaries of long notes and docs",
  "Explain Code — understand any snippet at a glance",
  "Prompt optimization for better AI results",
];

const GENERATED_TAGS = ["javascript", "performance", "utility", "closures"];

export function AiSection() {
  return (
    <section className="bg-card/40 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <ScrollReveal>
          <Badge className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400" variant="outline">
            Pro Feature
          </Badge>
          <h2 className="text-3xl font-extrabold sm:text-4xl">AI Superpowers, built in</h2>
          <p className="mt-3 mb-6 text-muted-foreground">
            Let AI do the busywork of organizing your knowledge base.
          </p>
          <ul className="space-y-3">
            {AI_CAPABILITIES.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="font-bold text-green-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={150} className="min-w-0">
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-[#16171d] shadow-2xl shadow-black/50">
            <div className="flex items-center gap-1.5 border-b border-border bg-[#1c1e26] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">debounce.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm text-[#d4d4d4]">
              <code>{`function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`}</code>
            </pre>
            <div className="border-t border-border p-5">
              <span className="mb-2.5 block text-xs text-muted-foreground">✨ AI Generated Tags</span>
              <div className="flex flex-wrap gap-2">
                {GENERATED_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
