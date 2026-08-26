import { CompareSection } from "../components/compare-section";
import { FaqSection } from "../components/faq-section";
import { Hero } from "../components/hero";
import { LicenseSection } from "../components/license-section";
import { PackSection } from "../components/pack-section";
import { PricingSection } from "../components/pricing-section";

export default function ProHomePage() {
  return (
    <main id="main-content">
      <Hero />
      <PackSection />
      <CompareSection />
      <PricingSection />
      <LicenseSection />
      <FaqSection />
    </main>
  );
}
