import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { PricingToggle } from "@/components/homepage/pricing-toggle";

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Simple, honest pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you need more.</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <PricingToggle />
        </ScrollReveal>
      </div>
    </section>
  );
}
