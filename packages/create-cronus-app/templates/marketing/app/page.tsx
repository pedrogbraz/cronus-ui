import { Faq } from "../components/faq";
import { FeatureGrid } from "../components/feature-grid";
import { Hero } from "../components/hero";
import { Pricing } from "../components/pricing";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { Testimonials } from "../components/testimonials";
import { WaitlistCta } from "../components/waitlist-cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <FeatureGrid />
        <Pricing />
        <Testimonials />
        <Faq />
        <WaitlistCta />
      </main>
      <SiteFooter />
    </div>
  );
}
