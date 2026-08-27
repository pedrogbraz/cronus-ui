import { Geist } from "next/font/google";
import { CompareSection } from "../components/compare-section";
import { FaqSection } from "../components/faq-section";
import { Hero } from "../components/hero";
import { LicenseSection } from "../components/license-section";
import { PackSection } from "../components/pack-section";
import { PricingSection } from "../components/pricing-section";
import { SignalBand } from "../components/signal-band";

const display = Geist({
  subsets: ["latin"],
  display: "swap",
});

export default function ProHomePage() {
  return (
    <main id="main-content">
      <Hero displayClassName={display.className} />
      <SignalBand displayClassName={display.className} />
      <PackSection />
      <CompareSection />
      <PricingSection />
      <LicenseSection />
      <FaqSection />
    </main>
  );
}
