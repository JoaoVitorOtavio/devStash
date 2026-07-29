import { Navbar } from "@/components/homepage/navbar";
import { Hero } from "@/components/homepage/hero";
import { FeaturesSection } from "@/components/homepage/features-section";
import { AiSection } from "@/components/homepage/ai-section";
import { PricingSection } from "@/components/homepage/pricing-section";
import { CtaSection } from "@/components/homepage/cta-section";
import { Footer } from "@/components/homepage/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <AiSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
